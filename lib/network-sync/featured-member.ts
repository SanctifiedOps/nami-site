import "server-only";

import { and, asc, eq, isNotNull, ne, or, sql } from "drizzle-orm";
import { getNetworkDb, schema } from "@/lib/network-db";
import { sendNetworkEmail } from "@/lib/network-auth/email";
import { getRuntimeEnvironment } from "@/lib/cloudflare-env";
import { revalidateNetworkProfile } from "@/lib/network-profile/revalidate";

const proposalStateKey = "featured-member-proposal";
const proposalDateStateKey = "featured-member-proposal-date";

export type FeaturedMemberProposal = {
  memberId: string;
  displayName: string;
  proposedAt: string;
  londonDate: string;
  status: "pending" | "approved";
  approvedAt?: string;
  approvedBy?: string;
};

const londonDate = (date = new Date()) => new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/London",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(date);

export function parseFeaturedMemberProposal(value: string | null | undefined) {
  if (!value) return null;
  try {
    const proposal = JSON.parse(value) as Partial<FeaturedMemberProposal>;
    if (
      typeof proposal.memberId !== "string"
      || typeof proposal.displayName !== "string"
      || typeof proposal.proposedAt !== "string"
      || typeof proposal.londonDate !== "string"
      || (proposal.status !== "pending" && proposal.status !== "approved")
    ) return null;
    return proposal as FeaturedMemberProposal;
  } catch {
    return null;
  }
}

export async function proposeFeaturedMember() {
  const db = await getNetworkDb();
  const today = londonDate();
  const states = await db.select().from(schema.systemState)
    .where(or(
      eq(schema.systemState.key, proposalStateKey),
      eq(schema.systemState.key, proposalDateStateKey),
    ));
  const state = new Map(states.map((item) => [item.key, item.value]));
  const existing = parseFeaturedMemberProposal(state.get(proposalStateKey));

  if (existing?.status === "pending") {
    return { changed: false, reason: "awaiting-approval", proposal: existing };
  }
  if (state.get(proposalDateStateKey) === today) {
    return { changed: false, reason: "already-proposed" };
  }

  const [chosen] = await db.select({
    memberId: schema.memberProfiles.memberId,
    displayName: schema.memberProfiles.displayName,
  }).from(schema.memberProfiles)
    .innerJoin(schema.members, eq(schema.members.id, schema.memberProfiles.memberId))
    .where(and(
      eq(schema.memberProfiles.published, true),
      eq(schema.memberProfiles.featured, false),
      isNotNull(schema.memberProfiles.profileImageKey),
      ne(schema.memberProfiles.profileImageKey, ""),
      eq(schema.members.approvalStatus, "approved"),
      ne(schema.members.accountStatus, "disabled"),
      ne(schema.members.role, "admin"),
    ))
    .orderBy(
      sql`case when ${schema.memberProfiles.lastFeaturedAt} is null then 0 else 1 end`,
      asc(schema.memberProfiles.lastFeaturedAt),
      sql`random()`,
    ).limit(1);

  if (!chosen) return { changed: false, reason: "no-eligible-members" };

  const now = new Date();
  const proposal: FeaturedMemberProposal = {
    memberId: chosen.memberId,
    displayName: chosen.displayName,
    proposedAt: now.toISOString(),
    londonDate: today,
    status: "pending",
  };

  await db.batch([
    db.insert(schema.systemState).values({ key: proposalStateKey, value: JSON.stringify(proposal), updatedAt: now })
      .onConflictDoUpdate({ target: schema.systemState.key, set: { value: JSON.stringify(proposal), updatedAt: now } }),
    db.insert(schema.systemState).values({ key: proposalDateStateKey, value: today, updatedAt: now })
      .onConflictDoUpdate({ target: schema.systemState.key, set: { value: today, updatedAt: now } }),
  ]);

  const env = await getRuntimeEnvironment();
  try {
    await sendNetworkEmail({
      memberId: chosen.memberId,
      recipient: env.OWNER_EMAIL || "hello@namicreative.co.uk",
      template: "profile-ready",
      subject: `Featured member ready for approval: ${chosen.displayName}`,
      heading: "Your next featured member is ready",
      body: `${chosen.displayName} has been selected for the next featured spot. The current member will remain featured until you review and approve this choice in the Network dashboard.`,
      actionLabel: "Review featured member",
      actionUrl: `${env.APP_URL || "https://namicreative.co.uk"}/network/admin?view=tasks#featured-member-approval`,
    });
  } catch {
    // sendNetworkEmail stores the failed attempt for the normal retry worker.
  }

  return { changed: true, proposal };
}

export async function approveFeaturedMemberProposal(memberId: string, approvedBy: string) {
  const db = await getNetworkDb();
  const [proposalRow] = await db.select().from(schema.systemState)
    .where(eq(schema.systemState.key, proposalStateKey)).limit(1);
  const proposal = parseFeaturedMemberProposal(proposalRow?.value);

  if (!proposal || proposal.status !== "pending") {
    throw new Error("There is no featured member waiting for approval.");
  }
  if (proposal.memberId !== memberId) {
    throw new Error("This featured member suggestion has changed. Refresh the dashboard and try again.");
  }

  const [candidate] = await db.select({
    memberId: schema.memberProfiles.memberId,
    displayName: schema.memberProfiles.displayName,
    primaryGroup: schema.memberProfiles.primaryGroup,
  }).from(schema.memberProfiles)
    .innerJoin(schema.members, eq(schema.members.id, schema.memberProfiles.memberId))
    .where(and(
      eq(schema.memberProfiles.memberId, memberId),
      eq(schema.memberProfiles.published, true),
      isNotNull(schema.memberProfiles.profileImageKey),
      ne(schema.memberProfiles.profileImageKey, ""),
      eq(schema.members.approvalStatus, "approved"),
      ne(schema.members.accountStatus, "disabled"),
      ne(schema.members.role, "admin"),
    )).limit(1);

  if (!candidate) throw new Error("This member is no longer eligible to be featured.");

  const current = await db.select({
    memberId: schema.memberProfiles.memberId,
    primaryGroup: schema.memberProfiles.primaryGroup,
  }).from(schema.memberProfiles).where(eq(schema.memberProfiles.featured, true));
  const now = new Date();
  const approved: FeaturedMemberProposal = {
    ...proposal,
    displayName: candidate.displayName,
    status: "approved",
    approvedAt: now.toISOString(),
    approvedBy,
  };

  await db.batch([
    db.update(schema.memberProfiles).set({ featured: false, updatedAt: now })
      .where(eq(schema.memberProfiles.featured, true)),
    db.update(schema.memberProfiles).set({ featured: true, lastFeaturedAt: now, updatedAt: now })
      .where(eq(schema.memberProfiles.memberId, candidate.memberId)),
    db.update(schema.systemState).set({ value: JSON.stringify(approved), updatedAt: now })
      .where(eq(schema.systemState.key, proposalStateKey)),
    db.insert(schema.systemState).values({ key: "featured-member-date", value: londonDate(now), updatedAt: now })
      .onConflictDoUpdate({ target: schema.systemState.key, set: { value: londonDate(now), updatedAt: now } }),
  ]);

  const syncMemberIds = new Set([candidate.memberId, ...current.map((item) => item.memberId)]);
  for (const syncMemberId of syncMemberIds) {
    await db.insert(schema.sheetSyncJobs).values({
      id: crypto.randomUUID(),
      memberId: syncMemberId,
      status: "pending",
      attempts: 0,
      nextAttemptAt: now,
      createdAt: now,
      updatedAt: now,
    });
  }

  for (const item of current) revalidateNetworkProfile(item.memberId, [item.primaryGroup]);
  revalidateNetworkProfile(candidate.memberId, [candidate.primaryGroup]);

  return { memberId: candidate.memberId, displayName: candidate.displayName };
}

export async function featureMemberImmediately(memberId: string, approvedBy: string) {
  const db = await getNetworkDb();
  const [candidate] = await db.select({ displayName: schema.memberProfiles.displayName })
    .from(schema.memberProfiles)
    .where(eq(schema.memberProfiles.memberId, memberId))
    .limit(1);
  if (!candidate) throw new Error("Member not found.");

  const now = new Date();
  const proposal: FeaturedMemberProposal = {
    memberId,
    displayName: candidate.displayName,
    proposedAt: now.toISOString(),
    londonDate: londonDate(now),
    status: "pending",
  };
  await db.insert(schema.systemState)
    .values({ key: proposalStateKey, value: JSON.stringify(proposal), updatedAt: now })
    .onConflictDoUpdate({ target: schema.systemState.key, set: { value: JSON.stringify(proposal), updatedAt: now } });

  return approveFeaturedMemberProposal(memberId, approvedBy);
}
