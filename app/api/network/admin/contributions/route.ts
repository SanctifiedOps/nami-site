import { and, asc, eq } from "drizzle-orm";
import { z } from "zod";
import { getRuntimeEnvironment } from "@/lib/cloudflare-env";
import { sendNetworkEmail } from "@/lib/network-auth/email";
import { getNetworkAdminSession } from "@/lib/network-auth/session";
import {
  contributionContentHash,
  validateContributionForSubmission,
} from "@/lib/network-contributions/server";
import { getNetworkDb, schema } from "@/lib/network-db";
import type { ContributionAssetSnapshot } from "@/lib/network-contributions/types";

const moderationActionSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("start_review"),
    contributionId: z.string().uuid(),
  }),
  z.object({
    action: z.literal("request_changes"),
    contributionId: z.string().uuid(),
    feedback: z.string().trim().min(5).max(2000),
  }),
  z.object({
    action: z.literal("approve"),
    contributionId: z.string().uuid(),
  }),
  z.object({
    action: z.literal("reject"),
    contributionId: z.string().uuid(),
    feedback: z.string().trim().min(5).max(2000),
  }),
]);

const reviewableStatuses = new Set(["submitted", "under_review"]);

export async function POST(request: Request) {
  const admin = await getNetworkAdminSession();
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = moderationActionSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) {
    return Response.json(
      { error: "Check the moderation action and try again." },
      { status: 400 },
    );
  }

  const db = await getNetworkDb();
  const [record] = await db
    .select({ contribution: schema.contributions, member: schema.members })
    .from(schema.contributions)
    .innerJoin(schema.members, eq(schema.members.id, schema.contributions.memberId))
    .where(eq(schema.contributions.id, parsed.data.contributionId))
    .limit(1);

  if (!record) {
    return Response.json({ error: "Contribution not found." }, { status: 404 });
  }

  const { contribution, member } = record;
  const now = new Date();

  if (parsed.data.action === "start_review") {
    if (contribution.status !== "submitted") {
      return Response.json(
        { error: "Only a submitted contribution can enter review." },
        { status: 409 },
      );
    }
    await db.batch([
      db
        .update(schema.contributions)
        .set({
          status: "under_review",
          reviewerId: admin.member.id,
          reviewedAt: now,
          updatedAt: now,
        })
        .where(eq(schema.contributions.id, contribution.id)),
      db.insert(schema.contributionModerationEvents).values({
        id: crypto.randomUUID(),
        contributionId: contribution.id,
        actorMemberId: admin.member.id,
        eventType: "review_started",
        createdAt: now,
      }),
    ]);
    return Response.json({ ok: true, status: "under_review" });
  }

  if (!reviewableStatuses.has(contribution.status)) {
    return Response.json(
      { error: "This contribution has already left the review queue." },
      { status: 409 },
    );
  }

  if (parsed.data.action === "approve") {
    const submissionError = validateContributionForSubmission({
      title: contribution.title,
      summary: contribution.summary,
      content: contribution.contentJson,
      originalWorkConfirmed: contribution.originalWorkConfirmed,
      imageRightsConfirmed: contribution.imageRightsConfirmed,
      noGeneratedTextConfirmed: contribution.noGeneratedTextConfirmed,
    });
    if (submissionError) {
      return Response.json(
        { error: `This submission is incomplete: ${submissionError}` },
        { status: 409 },
      );
    }

    const currentAssets = await db
      .select()
      .from(schema.contributionAssets)
      .where(
        and(
          eq(schema.contributionAssets.contributionId, contribution.id),
          eq(schema.contributionAssets.status, "ready"),
        ),
      )
      .orderBy(asc(schema.contributionAssets.position));
    const assets: ContributionAssetSnapshot[] = currentAssets.map((asset) => ({
      id: asset.id,
      kind: asset.kind,
      r2Key: asset.r2Key,
      altText: asset.altText,
      caption: asset.caption,
      position: asset.position,
      width: asset.width,
      height: asset.height,
      contentType: asset.contentType,
    }));
    const currentHash = await contributionContentHash({
      title: contribution.title,
      summary: contribution.summary,
      content: contribution.contentJson,
      assets,
    });
    if (!contribution.submittedContentHash || currentHash !== contribution.submittedContentHash) {
      return Response.json(
        {
          error:
            "The stored article no longer matches the member's submitted version. Approval has been stopped.",
        },
        { status: 409 },
      );
    }

    await db.batch([
      db
        .update(schema.contributions)
        .set({
          status: "approved",
          approvedContentHash: currentHash,
          adminFeedback: null,
          reviewerId: admin.member.id,
          reviewedAt: now,
          updatedAt: now,
        })
        .where(eq(schema.contributions.id, contribution.id)),
      db.insert(schema.contributionModerationEvents).values({
        id: crypto.randomUUID(),
        contributionId: contribution.id,
        actorMemberId: admin.member.id,
        eventType: "approved",
        createdAt: now,
      }),
    ]);

    const warning = await notifyMember({
      memberId: member.id,
      email: member.email,
      title: contribution.title,
      heading: "Your contribution has been approved",
      body: `Your contribution, ${contribution.title}, has passed review. We will let you know when it is published.`,
      contributionId: contribution.id,
    });
    return Response.json({ ok: true, status: "approved", warning });
  }

  const feedback = parsed.data.feedback.trim();
  const requestingChanges = parsed.data.action === "request_changes";
  const nextStatus = requestingChanges ? "changes_requested" : "rejected";
  await db.batch([
    db
      .update(schema.contributions)
      .set({
        status: nextStatus,
        adminFeedback: feedback,
        reviewerId: admin.member.id,
        reviewedAt: now,
        updatedAt: now,
      })
      .where(eq(schema.contributions.id, contribution.id)),
    db.insert(schema.contributionModerationEvents).values({
      id: crypto.randomUUID(),
      contributionId: contribution.id,
      actorMemberId: admin.member.id,
      eventType: requestingChanges ? "changes_requested" : "rejected",
      note: feedback,
      createdAt: now,
    }),
  ]);

  const warning = await notifyMember({
    memberId: member.id,
    email: member.email,
    title: contribution.title,
    heading: requestingChanges
      ? "Your contribution needs a change"
      : "An update about your contribution",
    body: requestingChanges
      ? `Please open ${contribution.title} in your dashboard and check the note from NAMI: ${feedback}`
      : `NAMI cannot publish ${contribution.title} in its current form. The moderation note is: ${feedback}`,
    contributionId: contribution.id,
  });

  return Response.json({ ok: true, status: nextStatus, warning });
}

async function notifyMember(input: {
  memberId: string;
  email: string;
  title: string;
  heading: string;
  body: string;
  contributionId: string;
}) {
  try {
    const env = await getRuntimeEnvironment();
    const appUrl = (env.APP_URL || "https://namicreative.co.uk").replace(/\/$/, "");
    await sendNetworkEmail({
      memberId: input.memberId,
      recipient: input.email,
      template: "contribution-review",
      subject: `NAMI Network: ${input.title}`,
      heading: input.heading,
      body: input.body,
      actionLabel: "Open my contribution",
      actionUrl: `${appUrl}/network/dashboard/contributions/${input.contributionId}`,
    });
    return undefined;
  } catch (error) {
    return error instanceof Error
      ? `The moderation decision was saved, but the member email needs a retry: ${error.message}`
      : "The moderation decision was saved, but the member email needs a retry.";
  }
}
