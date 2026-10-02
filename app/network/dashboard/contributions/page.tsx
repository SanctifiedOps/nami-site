import type { Metadata } from "next";
import { desc, eq } from "drizzle-orm";
import { requireMemberSession } from "@/lib/network-auth/session";
import { getNetworkDb, schema } from "@/lib/network-db";
import type { ContributionListItem } from "@/lib/network-contributions/types";
import { ContributionDashboard } from "./contribution-dashboard";

export const metadata: Metadata = {
  title: "Your contributions | NAMI Creative Network",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function MemberContributionsPage({
  searchParams,
}: {
  searchParams: Promise<{ submitted?: string }>;
}) {
  const auth = await requireMemberSession();
  const { submitted } = await searchParams;
  const db = await getNetworkDb();
  const records = await db
    .select()
    .from(schema.contributions)
    .where(eq(schema.contributions.memberId, auth.member.id))
    .orderBy(desc(schema.contributions.updatedAt));
  const firstName =
    auth.member.firstName.trim() ||
    auth.session.user.name?.trim().split(/\s+/)[0] ||
    "there";

  const contributions: ContributionListItem[] = records.map((record) => ({
    id: record.id,
    format: record.format,
    title: record.title,
    summary: record.summary,
    status: record.status,
    updatedAt: record.updatedAt.toISOString(),
    publishedAt: record.publishedAt?.toISOString() ?? null,
    adminFeedback: record.adminFeedback,
  }));

  return (
    <ContributionDashboard
      firstName={firstName}
      contributions={contributions}
      notice={submitted === "1" ? "Your contribution is in the review queue." : undefined}
    />
  );
}
