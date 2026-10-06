import { and, asc, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { getRuntimeEnvironment } from "@/lib/cloudflare-env";
import { getMemberSession } from "@/lib/network-auth/session";
import { getMemberMediaBucket, getNetworkDb, schema } from "@/lib/network-db";
import {
  contributionContentHash,
  contributionDraftFieldsSchema,
  contributionPlainText,
  validateContributionForSubmission,
} from "@/lib/network-contributions/server";
import { queueOwnerAlert } from "@/lib/network-ops/owner-alerts";
import type { ContributionAssetSnapshot } from "@/lib/network-contributions/types";

const contributionActionSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("create"),
    data: contributionDraftFieldsSchema,
  }),
  z.object({
    action: z.literal("save"),
    contributionId: z.string().uuid(),
    data: contributionDraftFieldsSchema,
  }),
  z.object({
    action: z.literal("submit"),
    contributionId: z.string().uuid(),
    data: contributionDraftFieldsSchema,
  }),
]);

const editableStatuses = new Set(["draft", "changes_requested"]);

const deleteContributionSchema = z.object({
  contributionId: z.string().uuid(),
});

export async function GET() {
  const auth = await getMemberSession();
  if (!auth) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const db = await getNetworkDb();
  const contributions = await db
    .select()
    .from(schema.contributions)
    .where(eq(schema.contributions.memberId, auth.member.id))
    .orderBy(desc(schema.contributions.updatedAt));
  return Response.json({ contributions });
}

export async function POST(request: Request) {
  const auth = await getMemberSession();
  if (!auth || auth.member.accountStatus !== "active") {
    return Response.json(
      { error: "An active member account is required." },
      { status: 401 },
    );
  }

  const parsed = contributionActionSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) {
    return Response.json(
      { error: "Check the contribution and try again." },
      { status: 400 },
    );
  }

  const db = await getNetworkDb();
  const now = new Date();
  const data = parsed.data.data;
  const content = {
    ...data.content,
    blocks: data.content.blocks.map((block) =>
      block.type === "paragraph" && block.richText?.length
        ? {
            ...block,
            text: block.richText.map((span) => span.text).join(""),
          }
        : block,
    ),
  };
  const normalised = {
    format: data.format,
    title: data.title.trim(),
    summary: data.summary.trim(),
    contentJson: content,
    plainText: contributionPlainText(content),
    originalWorkConfirmed: data.originalWorkConfirmed,
    imageRightsConfirmed: data.imageRightsConfirmed,
    noGeneratedTextConfirmed: data.noGeneratedTextConfirmed,
    updatedAt: now,
  };

  if (parsed.data.action === "create") {
    const contributionId = crypto.randomUUID();
    await db.batch([
      db.insert(schema.contributions).values({
        id: contributionId,
        memberId: auth.member.id,
        ...normalised,
        status: "draft",
        createdAt: now,
      }),
      db.insert(schema.contributionModerationEvents).values({
        id: crypto.randomUUID(),
        contributionId,
        actorMemberId: auth.member.id,
        eventType: "created",
        createdAt: now,
      }),
    ]);
    return Response.json({ ok: true, contributionId, status: "draft" });
  }

  const [existing] = await db
    .select()
    .from(schema.contributions)
    .where(
      and(
        eq(schema.contributions.id, parsed.data.contributionId),
        eq(schema.contributions.memberId, auth.member.id),
      ),
    )
    .limit(1);

  if (!existing) {
    return Response.json({ error: "Contribution not found." }, { status: 404 });
  }
  if (!editableStatuses.has(existing.status)) {
    return Response.json(
      { error: "This contribution cannot be changed while it is being reviewed." },
      { status: 409 },
    );
  }

  if (parsed.data.action === "save") {
    await db
      .update(schema.contributions)
      .set(normalised)
      .where(eq(schema.contributions.id, existing.id));
    return Response.json({ ok: true, contributionId: existing.id, status: existing.status });
  }

  const submissionError = validateContributionForSubmission({
    title: normalised.title,
    summary: normalised.summary,
    content: normalised.contentJson,
    originalWorkConfirmed: normalised.originalWorkConfirmed,
    imageRightsConfirmed: normalised.imageRightsConfirmed,
    noGeneratedTextConfirmed: normalised.noGeneratedTextConfirmed,
  });
  if (submissionError) {
    return Response.json({ error: submissionError }, { status: 400 });
  }

  const currentAssets = await db
    .select()
    .from(schema.contributionAssets)
    .where(
      and(
        eq(schema.contributionAssets.contributionId, existing.id),
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
  const contentHash = await contributionContentHash({
    title: normalised.title,
    summary: normalised.summary,
    content: normalised.contentJson,
    assets,
  });
  const [latestVersion] = await db
    .select({ versionNumber: schema.contributionVersions.versionNumber })
    .from(schema.contributionVersions)
    .where(eq(schema.contributionVersions.contributionId, existing.id))
    .orderBy(desc(schema.contributionVersions.versionNumber))
    .limit(1);
  const resubmission = existing.status === "changes_requested";
  const versionNumber = (latestVersion?.versionNumber ?? 0) + 1;

  await db.batch([
    db
      .update(schema.contributions)
      .set({
        ...normalised,
        status: "submitted",
        submittedContentHash: contentHash,
        adminFeedback: null,
        submittedAt: now,
      })
      .where(eq(schema.contributions.id, existing.id)),
    db.insert(schema.contributionVersions).values({
      id: crypto.randomUUID(),
      contributionId: existing.id,
      memberId: auth.member.id,
      versionNumber,
      reason: resubmission ? "resubmitted" : "submitted",
      title: normalised.title,
      summary: normalised.summary,
      contentJson: normalised.contentJson,
      assetsJson: assets,
      contentHash,
      createdAt: now,
    }),
    db.insert(schema.contributionModerationEvents).values({
      id: crypto.randomUUID(),
      contributionId: existing.id,
      actorMemberId: auth.member.id,
      eventType: resubmission ? "resubmitted" : "submitted",
      createdAt: now,
    }),
  ]);

  const env = await getRuntimeEnvironment();
  let warning: string | undefined;
  try {
    await queueOwnerAlert({
      kind: "contribution",
      recordId: existing.id,
      subject: `NAMI contribution: ${normalised.title}`,
      heading: "A member contribution is waiting for review",
      body: `${normalised.title}, submitted by ${auth.member.firstName || auth.member.email}.`,
      actionUrl: `${(env.APP_URL || "https://namicreative.co.uk").replace(/\/$/, "")}/network/admin/contributions/${existing.id}`,
    });
  } catch (alertError) {
    warning =
      alertError instanceof Error
        ? `Your contribution was submitted, but the owner alert needs a retry: ${alertError.message}`
        : "Your contribution was submitted, but the owner alert needs a retry.";
  }

  return Response.json({
    ok: true,
    contributionId: existing.id,
    status: "submitted",
    warning,
  });
}

export async function DELETE(request: Request) {
  const auth = await getMemberSession();
  if (!auth) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = deleteContributionSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) {
    return Response.json({ error: "Choose a valid draft." }, { status: 400 });
  }

  const db = await getNetworkDb();
  const [contribution] = await db
    .select()
    .from(schema.contributions)
    .where(
      and(
        eq(schema.contributions.id, parsed.data.contributionId),
        eq(schema.contributions.memberId, auth.member.id),
      ),
    )
    .limit(1);

  if (!contribution) {
    return Response.json({ error: "Draft not found." }, { status: 404 });
  }
  if (contribution.status !== "draft") {
    return Response.json(
      { error: "Only drafts can be deleted." },
      { status: 409 },
    );
  }

  const assets = await db
    .select({ r2Key: schema.contributionAssets.r2Key })
    .from(schema.contributionAssets)
    .where(eq(schema.contributionAssets.contributionId, contribution.id));

  await db
    .delete(schema.contributions)
    .where(eq(schema.contributions.id, contribution.id));

  if (assets.length) {
    const bucket = await getMemberMediaBucket();
    await Promise.allSettled(assets.map((asset) => bucket.delete(asset.r2Key)));
  }

  return Response.json({ ok: true });
}
