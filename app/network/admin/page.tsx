import type { Metadata } from "next";
import { desc, eq } from "drizzle-orm";
import { requireNetworkAdminSession } from "@/lib/network-auth/session";
import { getNetworkDb, schema } from "@/lib/network-db";
import { getGaSnapshot, getInstagramSnapshot } from "@/lib/network-admin/external-data";
import { AdminDashboard } from "./admin-dashboard";

export const metadata: Metadata = { title: "Network admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const iso = (value: Date | null) => value?.toISOString() ?? null;

export default async function NetworkAdminPage() {
  const admin = await requireNetworkAdminSession();
  const db = await getNetworkDb();
  const [applications, memberRows, tickets, events, alerts, emailJobs, syncJobs, ga, instagram] = await Promise.all([
    db.select().from(schema.networkApplications).orderBy(desc(schema.networkApplications.submittedAt)),
    db.select({ member: schema.members, profile: schema.memberProfiles }).from(schema.members)
      .leftJoin(schema.memberProfiles, eq(schema.memberProfiles.memberId, schema.members.id)).orderBy(desc(schema.members.joinedAt)),
    db.select().from(schema.supportTickets).orderBy(desc(schema.supportTickets.createdAt)),
    db.select().from(schema.networkEvents).orderBy(desc(schema.networkEvents.submittedAt)),
    db.select().from(schema.ownerAlertJobs).orderBy(desc(schema.ownerAlertJobs.createdAt)).limit(100),
    db.select().from(schema.emailJobs).orderBy(desc(schema.emailJobs.createdAt)).limit(100),
    db.select().from(schema.sheetSyncJobs).orderBy(desc(schema.sheetSyncJobs.createdAt)).limit(100),
    getGaSnapshot(),
    getInstagramSnapshot(),
  ]);

  return <AdminDashboard
    adminName={admin.member.firstName || admin.session.user.name || "Admin"}
    applications={applications.map((item) => ({ ...item, submittedAt: iso(item.submittedAt)!, reviewedAt: iso(item.reviewedAt) }))}
    members={memberRows.map(({ member, profile }) => ({
      id: member.id,
      firstName: member.firstName,
      email: member.email,
      accountStatus: member.accountStatus,
      role: member.role,
      joinedAt: iso(member.joinedAt)!,
      lastLoginAt: iso(member.lastLoginAt),
      displayName: profile?.displayName ?? member.firstName,
      location: profile?.location ?? "",
      primaryGroup: profile?.primaryGroup ?? "",
      speciality: profile?.speciality ?? "",
      profileImageKey: profile?.profileImageKey ?? null,
      published: profile?.published ?? false,
      links: [profile?.websiteUrl, profile?.instagramUrl, profile?.facebookUrl, profile?.linkedinUrl, profile?.tiktokUrl, profile?.youtubeUrl].filter(Boolean) as string[],
    }))}
    tickets={tickets.map((item) => ({ ...item, createdAt: iso(item.createdAt)!, updatedAt: iso(item.updatedAt)!, resolvedAt: iso(item.resolvedAt) }))}
    events={events.map((item) => ({ ...item, startsAt: iso(item.startsAt)!, endsAt: iso(item.endsAt), submittedAt: iso(item.submittedAt)!, reviewedAt: iso(item.reviewedAt), publishedAt: iso(item.publishedAt), updatedAt: iso(item.updatedAt)! }))}
    operations={{
      failedAlerts: alerts.filter((item) => item.status === "failed").length,
      pendingAlerts: alerts.filter((item) => item.status === "pending").length,
      failedEmails: emailJobs.filter((item) => item.status === "failed").length,
      pendingEmails: emailJobs.filter((item) => item.status === "pending").length,
      failedSyncs: syncJobs.filter((item) => item.status === "failed").length,
      pendingSyncs: syncJobs.filter((item) => item.status === "pending").length,
    }}
    ga={ga}
    instagram={instagram}
  />;
}
