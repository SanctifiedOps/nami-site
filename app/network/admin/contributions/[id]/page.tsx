import type { Metadata } from "next";
import { desc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { requireNetworkAdminSession } from "@/lib/network-auth/session";
import { getNetworkDb, schema } from "@/lib/network-db";
import {
  ModerationDetail,
  type ModerationDetailRecord,
} from "../moderation-detail";

export const metadata: Metadata = {
  title: "Review contribution | NAMI Network admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function ReviewContributionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireNetworkAdminSession();
  const { id } = await params;
  const db = await getNetworkDb();
  const [record] = await db
    .select({
      contribution: schema.contributions,
      member: schema.members,
      profile: schema.memberProfiles,
    })
    .from(schema.contributions)
    .innerJoin(schema.members, eq(schema.members.id, schema.contributions.memberId))
    .leftJoin(
      schema.memberProfiles,
      eq(schema.memberProfiles.memberId, schema.members.id),
    )
    .where(eq(schema.contributions.id, id))
    .limit(1);

  if (!record) notFound();

  const [latestVersion, timeline, assets] = await Promise.all([
    db
      .select({ versionNumber: schema.contributionVersions.versionNumber })
      .from(schema.contributionVersions)
      .where(eq(schema.contributionVersions.contributionId, id))
      .orderBy(desc(schema.contributionVersions.versionNumber))
      .limit(1),
    db
      .select()
      .from(schema.contributionModerationEvents)
      .where(eq(schema.contributionModerationEvents.contributionId, id))
      .orderBy(desc(schema.contributionModerationEvents.createdAt)),
    db.select().from(schema.contributionAssets).where(eq(schema.contributionAssets.contributionId, id)),
  ]);

  const { contribution, member, profile } = record;
  const view: ModerationDetailRecord = {
    id: contribution.id,
    format: contribution.format,
    title: contribution.title,
    summary: contribution.summary,
    content: contribution.contentJson,
    status: contribution.status,
    memberName: profile?.displayName || member.firstName || member.email,
    memberEmail: member.email,
    originalWorkConfirmed: contribution.originalWorkConfirmed,
    imageRightsConfirmed: contribution.imageRightsConfirmed,
    noGeneratedTextConfirmed: contribution.noGeneratedTextConfirmed,
    submittedAt: contribution.submittedAt?.toISOString() ?? null,
    updatedAt: contribution.updatedAt.toISOString(),
    adminFeedback: contribution.adminFeedback,
    versionNumber: latestVersion[0]?.versionNumber ?? null,
    assets: assets.filter((asset) => asset.status === "ready").map((asset) => ({
      id: asset.id,
      kind: asset.kind,
      url: `/api/network/media/${asset.r2Key.split("/").map(encodeURIComponent).join("/")}`,
      altText: asset.altText,
      caption: asset.caption,
      width: asset.width,
      height: asset.height,
    })),
    timeline: timeline.map((event) => ({
      id: event.id,
      eventType: event.eventType,
      note: event.note,
      createdAt: event.createdAt.toISOString(),
    })),
  };

  return <ModerationDetail contribution={view} />;
}
