import type { Metadata } from "next";
import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { requireNetworkAdminSession } from "@/lib/network-auth/session";
import { getNetworkDb, schema } from "@/lib/network-db";
import {
  MemberArticle,
  type MemberArticleView,
} from "@/app/network/news/member-article";

export const metadata: Metadata = {
  title: "Publication preview | NAMI Network admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function mediaUrl(key: string | null | undefined) {
  if (!key) return null;
  return `/api/network/media/${key.split("/").map(encodeURIComponent).join("/")}`;
}

export default async function ContributionPublicationPreviewPage({
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

  const [cover] = await db
    .select()
    .from(schema.contributionAssets)
    .where(
      and(
        eq(schema.contributionAssets.contributionId, id),
        eq(schema.contributionAssets.kind, "cover"),
        eq(schema.contributionAssets.status, "ready"),
      ),
    )
    .limit(1);

  const { contribution, member, profile } = record;
  const article: MemberArticleView = {
    title: contribution.title,
    summary: contribution.summary,
    format: contribution.format,
    content: contribution.contentJson,
    publishedAt: (contribution.publishedAt || contribution.updatedAt).toISOString(),
    coverImageUrl: mediaUrl(cover?.r2Key),
    author: {
      id: member.id,
      name: profile?.displayName || member.firstName || member.email,
      speciality: profile?.speciality || "NAMI Creative Network member",
      location: profile?.location || "North East England",
      bio: profile?.bio || "A member of the NAMI Creative Network.",
      profileImageUrl: mediaUrl(profile?.profileImageKey),
    },
  };

  return <MemberArticle article={article} previewMode />;
}
