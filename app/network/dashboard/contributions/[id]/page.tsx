import type { Metadata } from "next";
import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { requireMemberSession } from "@/lib/network-auth/session";
import { getNetworkDb, schema } from "@/lib/network-db";
import type {
  ContributionAssetView,
  ContributionDraft,
} from "@/lib/network-contributions/types";
import { ContributionBuilder } from "../new/contribution-builder";

export const metadata: Metadata = {
  title: "Your contribution | NAMI Creative Network",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function ContributionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const auth = await requireMemberSession();
  const { id } = await params;
  const db = await getNetworkDb();
  const [record] = await db
    .select()
    .from(schema.contributions)
    .where(
      and(
        eq(schema.contributions.id, id),
        eq(schema.contributions.memberId, auth.member.id),
      ),
    )
    .limit(1);

  if (!record) notFound();

  const assets = await db
    .select()
    .from(schema.contributionAssets)
    .where(
      and(
        eq(schema.contributionAssets.contributionId, record.id),
        eq(schema.contributionAssets.status, "ready"),
      ),
    );

  const draft: ContributionDraft = {
    id: record.id,
    format: record.format,
    title: record.title,
    summary: record.summary,
    status: record.status,
    content: record.contentJson,
    originalWorkConfirmed: record.originalWorkConfirmed,
    imageRightsConfirmed: record.imageRightsConfirmed,
    noGeneratedTextConfirmed: record.noGeneratedTextConfirmed,
    updatedAt: record.updatedAt.toISOString(),
    publishedAt: record.publishedAt?.toISOString() ?? null,
    adminFeedback: record.adminFeedback,
  };

  const initialAssets: ContributionAssetView[] = assets.map((asset) => ({
    id: asset.id,
    kind: asset.kind,
    url: `/api/network/media/${asset.r2Key.split("/").map(encodeURIComponent).join("/")}`,
    altText: asset.altText,
    caption: asset.caption,
    width: asset.width,
    height: asset.height,
  }));

  return (
    <ContributionBuilder
      format={record.format}
      initialDraft={draft}
      initialAssets={initialAssets}
    />
  );
}
