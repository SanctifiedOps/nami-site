import type { Metadata } from "next";
import { desc, eq } from "drizzle-orm";
import { requireNetworkAdminSession } from "@/lib/network-auth/session";
import { getNetworkDb, schema } from "@/lib/network-db";
import {
  ModerationDashboard,
  type ModerationQueueItem,
} from "./moderation-dashboard";

export const metadata: Metadata = {
  title: "Contribution review | NAMI Network admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function ContributionModerationPage() {
  const admin = await requireNetworkAdminSession();
  const db = await getNetworkDb();
  const records = await db
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
    .orderBy(desc(schema.contributions.submittedAt));

  const contributions: ModerationQueueItem[] = records.map(
    ({ contribution, member, profile }) => ({
      id: contribution.id,
      format: contribution.format,
      title: contribution.title,
      summary: contribution.summary,
      status: contribution.status,
      memberName: profile?.displayName || member.firstName || member.email,
      memberEmail: member.email,
      submittedAt: contribution.submittedAt?.toISOString() ?? null,
      updatedAt: contribution.updatedAt.toISOString(),
      adminFeedback: contribution.adminFeedback,
    }),
  );

  return (
    <ModerationDashboard
      adminName={admin.member.firstName || admin.session.user.name || "Admin"}
      contributions={contributions}
    />
  );
}
