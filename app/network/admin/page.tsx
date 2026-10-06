import type { Metadata } from "next";
import { desc, eq, gte, inArray, like } from "drizzle-orm";
import { requireNetworkAdminSession } from "@/lib/network-auth/session";
import { getNetworkDb, schema } from "@/lib/network-db";
import { getGaSnapshot, getInstagramSnapshot, getMailchimpSnapshot } from "@/lib/network-admin/external-data";
import { parseFeaturedMemberProposal } from "@/lib/network-sync/featured-member";
import { AdminDashboard } from "./admin-dashboard";

export const metadata: Metadata = { title: "Network admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const iso = (value: Date | null) => value?.toISOString() ?? null;

export default async function NetworkAdminPage() {
  const admin = await requireNetworkAdminSession();
  const db = await getNetworkDb();
  const searchCutoff = new Date(Date.now() - 90 * 86400000);
  const [applications, memberRows, tickets, events, eventRevisions, alerts, emailJobs, syncJobs, eventSyncJobs, mailchimpJobs, bioJobs, dismissedJobRows, searchEvents, eventAnalytics, ga, instagram, mailchimp, featuredProposalRows, contributionRows] = await Promise.all([
    db.select().from(schema.networkApplications).orderBy(desc(schema.networkApplications.submittedAt)),
    db.select({ member: schema.members, profile: schema.memberProfiles }).from(schema.members)
      .leftJoin(schema.memberProfiles, eq(schema.memberProfiles.memberId, schema.members.id)).orderBy(desc(schema.members.joinedAt)),
    db.select().from(schema.supportTickets).orderBy(desc(schema.supportTickets.createdAt)),
    db.select().from(schema.networkEvents).orderBy(desc(schema.networkEvents.submittedAt)),
    db.select().from(schema.eventRevisions).orderBy(desc(schema.eventRevisions.submittedAt)),
    db.select().from(schema.ownerAlertJobs).orderBy(desc(schema.ownerAlertJobs.createdAt)).limit(100),
    db.select().from(schema.emailJobs).orderBy(desc(schema.emailJobs.createdAt)).limit(100),
    db.select().from(schema.sheetSyncJobs).orderBy(desc(schema.sheetSyncJobs.createdAt)).limit(100),
    db.select().from(schema.eventSheetSyncJobs).orderBy(desc(schema.eventSheetSyncJobs.createdAt)).limit(100),
    db.select().from(schema.mailchimpSyncJobs).orderBy(desc(schema.mailchimpSyncJobs.createdAt)).limit(100),
    db.select().from(schema.bioGenerationJobs).orderBy(desc(schema.bioGenerationJobs.createdAt)).limit(100),
    db.select().from(schema.systemState).where(like(schema.systemState.key, "admin-dismissed-job:%")),
    db.select().from(schema.directorySearchEvents).where(gte(schema.directorySearchEvents.createdAt, searchCutoff)).orderBy(desc(schema.directorySearchEvents.createdAt)).limit(5000),
    db.select().from(schema.eventAnalytics).where(gte(schema.eventAnalytics.createdAt, searchCutoff)).orderBy(desc(schema.eventAnalytics.createdAt)).limit(10000),
    getGaSnapshot(),
    getInstagramSnapshot(),
    getMailchimpSnapshot(),
    db.select().from(schema.systemState).where(eq(schema.systemState.key, "featured-member-proposal")).limit(1),
    db.select({ contribution: schema.contributions, member: schema.members, profile: schema.memberProfiles })
      .from(schema.contributions)
      .innerJoin(schema.members, eq(schema.members.id, schema.contributions.memberId))
      .leftJoin(schema.memberProfiles, eq(schema.memberProfiles.memberId, schema.members.id))
      .where(inArray(schema.contributions.status, ["submitted", "under_review"]))
      .orderBy(desc(schema.contributions.submittedAt)),
  ]);

  const featuredProposal = parseFeaturedMemberProposal(featuredProposalRows[0]?.value);
  const featuredCandidate = featuredProposal?.status === "pending"
    ? memberRows.find(({ member }) => member.id === featuredProposal.memberId)
    : null;
  const currentFeatured = memberRows.find(({ profile }) => profile?.featured);

  const dismissedJobs = new Set(dismissedJobRows.map((item) => item.key));
  const isDismissed = (jobType: string, id: string) => dismissedJobs.has(`admin-dismissed-job:${jobType}:${id}`);
  const failedJobs = [
    ...alerts.filter((item) => item.status === "failed" && !isDismissed("owner-alert", item.id)).map((item) => ({ id: item.id, jobType: "owner-alert" as const, type: "Owner notification", recordId: item.recordId, status: item.status, attempts: item.attempts, error: item.lastError, nextAttemptAt: iso(item.nextAttemptAt), updatedAt: iso(item.updatedAt)! })),
    ...emailJobs.filter((item) => item.status === "failed" && !isDismissed("member-email", item.id)).map((item) => ({ id: item.id, jobType: "member-email" as const, type: "Member email", recordId: item.memberId || item.recipient, status: item.status, attempts: item.attempts, error: item.lastError, nextAttemptAt: iso(item.nextAttemptAt), updatedAt: iso(item.updatedAt)! })),
    ...syncJobs.filter((item) => item.status === "failed" && !isDismissed("sheet-sync", item.id)).map((item) => ({ id: item.id, jobType: "sheet-sync" as const, type: "Google Sheet sync", recordId: item.memberId, status: item.status, attempts: item.attempts, error: item.lastError, nextAttemptAt: iso(item.nextAttemptAt), updatedAt: iso(item.updatedAt)! })),
    ...eventSyncJobs.filter((item) => item.status === "failed" && !isDismissed("event-sheet-sync", item.id)).map((item) => ({ id: item.id, jobType: "event-sheet-sync" as const, type: "Event Google Sheet sync", recordId: item.eventId, status: item.status, attempts: item.attempts, error: item.lastError, nextAttemptAt: iso(item.nextAttemptAt), updatedAt: iso(item.updatedAt)! })),
    ...mailchimpJobs.filter((item) => item.status === "failed" && !isDismissed("mailchimp-sync", item.id)).map((item) => ({ id: item.id, jobType: "mailchimp-sync" as const, type: "Mailchimp sync", recordId: item.applicationId, status: item.status, attempts: item.attempts, error: item.lastError, nextAttemptAt: iso(item.nextAttemptAt), updatedAt: iso(item.updatedAt)! })),
    ...bioJobs.filter((item) => item.status === "failed" && !isDismissed("bio-generation", item.id)).map((item) => ({ id: item.id, jobType: "bio-generation" as const, type: "NAMI bio generation", recordId: item.applicationId, status: item.status, attempts: item.attempts, error: item.lastError, nextAttemptAt: iso(item.nextAttemptAt), updatedAt: iso(item.updatedAt)! })),
  ].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  return <AdminDashboard
    adminName={admin.member.firstName || admin.session.user.name || "Admin"}
    featuredApproval={featuredCandidate && featuredProposal ? {
      memberId: featuredCandidate.member.id,
      displayName: featuredCandidate.profile?.displayName ?? featuredProposal.displayName,
      speciality: featuredCandidate.profile?.speciality ?? "",
      location: featuredCandidate.profile?.location ?? "",
      proposedAt: featuredProposal.proposedAt,
      currentFeaturedName: currentFeatured?.profile?.displayName ?? null,
    } : null}
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
    eventRevisions={eventRevisions.map((item) => ({ ...item, submittedAt: iso(item.submittedAt)!, reviewedAt: iso(item.reviewedAt) }))}
    contributions={contributionRows.map(({ contribution, member, profile }) => ({
      id: contribution.id,
      title: contribution.title,
      summary: contribution.summary,
      format: contribution.format,
      status: contribution.status,
      memberName: profile?.displayName || member.firstName || member.email,
      submittedAt: iso(contribution.submittedAt),
      updatedAt: iso(contribution.updatedAt)!,
    }))}
    operations={{
      failedAlerts: alerts.filter((item) => item.status === "failed" && !isDismissed("owner-alert", item.id)).length,
      pendingAlerts: alerts.filter((item) => item.status === "pending").length,
      failedEmails: emailJobs.filter((item) => item.status === "failed" && !isDismissed("member-email", item.id)).length,
      pendingEmails: emailJobs.filter((item) => item.status === "pending").length,
      failedSyncs: syncJobs.filter((item) => item.status === "failed" && !isDismissed("sheet-sync", item.id)).length + eventSyncJobs.filter((item) => item.status === "failed" && !isDismissed("event-sheet-sync", item.id)).length,
      pendingSyncs: syncJobs.filter((item) => item.status === "pending").length + eventSyncJobs.filter((item) => item.status === "pending").length,
      failedMailchimp: mailchimpJobs.filter((item) => item.status === "failed" && !isDismissed("mailchimp-sync", item.id)).length,
      pendingMailchimp: mailchimpJobs.filter((item) => item.status === "pending").length,
      failedBios: bioJobs.filter((item) => item.status === "failed" && !isDismissed("bio-generation", item.id)).length,
      pendingBios: bioJobs.filter((item) => item.status === "pending").length,
    }}
    failedJobs={failedJobs}
    searchEvents={searchEvents.map((item) => ({ ...item, createdAt: iso(item.createdAt)! }))}
    eventAnalytics={eventAnalytics.map((item) => ({ ...item, createdAt: iso(item.createdAt)! }))}
    ga={ga}
    instagram={instagram}
    mailchimp={mailchimp}
  />;
}
