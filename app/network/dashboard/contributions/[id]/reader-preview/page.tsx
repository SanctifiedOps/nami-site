import type { Metadata } from "next";
import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { MemberArticle, type MemberArticleView } from "@/app/network/news/member-article";
import { requireMemberSession } from "@/lib/network-auth/session";
import { getNetworkDb, schema } from "@/lib/network-db";

export const metadata: Metadata = {
  title: "Reader preview | NAMI Creative Network",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function mediaUrl(key: string | null | undefined) {
  if (!key) return null;
  return `/api/network/media/${key.split("/").map(encodeURIComponent).join("/")}`;
}

export default async function MemberContributionReaderPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const auth = await requireMemberSession();
  const { id } = await params;
  const db = await getNetworkDb();
  const [record] = await db
    .select({
      contribution: schema.contributions,
      profile: schema.memberProfiles,
    })
    .from(schema.contributions)
    .leftJoin(
      schema.memberProfiles,
      eq(schema.memberProfiles.memberId, schema.contributions.memberId),
    )
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
        eq(schema.contributionAssets.contributionId, id),
        eq(schema.contributionAssets.status, "ready"),
      ),
    );
  const cover = assets.find((asset) => asset.kind === "cover");
  const { contribution, profile } = record;
  const article: MemberArticleView = {
    title: contribution.title || "Untitled contribution",
    summary: contribution.summary,
    format: contribution.format,
    content: contribution.contentJson,
    publishedAt: (contribution.publishedAt || contribution.updatedAt).toISOString(),
    coverImageUrl: mediaUrl(cover?.r2Key),
    inlineAssets: assets.filter((asset) => asset.kind === "inline").map((asset) => ({
      id: asset.id,
      kind: asset.kind,
      url: mediaUrl(asset.r2Key)!,
      altText: asset.altText,
      caption: asset.caption,
      width: asset.width,
      height: asset.height,
    })),
    author: {
      id: auth.member.id,
      name: profile?.displayName || auth.member.firstName || auth.member.email,
      speciality: profile?.speciality || "NAMI Creative Network member",
      location: profile?.location || "North East England",
      bio: profile?.bio || "A member of the NAMI Creative Network.",
      profileImageUrl: mediaUrl(profile?.profileImageKey),
    },
  };

  return (
    <MemberArticle
      article={article}
      previewMode
      previewBackHref="/network/dashboard/contributions"
      previewBackLabel="Back to contributions"
      previewNotice="Reader preview. This is how your contribution will look when it is published."
    />
  );
}
