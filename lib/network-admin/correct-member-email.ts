import "server-only";

import { and, eq, ne } from "drizzle-orm";
import { issueMemberInvite } from "@/lib/network-auth/member-invitations";
import { getNetworkDb, schema } from "@/lib/network-db";
import { changeMailchimpContactEmail } from "@/lib/network-sync/mailchimp";

export async function correctUnclaimedMemberEmail(memberId: string, requestedEmail: string) {
  const db = await getNetworkDb();
  const now = new Date();
  const email = requestedEmail.trim().toLowerCase();
  const [target] = await db.select().from(schema.members).where(eq(schema.members.id, memberId)).limit(1);
  if (!target) throw new Error("Member not found.");
  if (target.authUserId || target.accountStatus === "active") {
    throw new Error("Active account emails must be changed through the authenticated account workflow.");
  }
  const [duplicate] = await db.select({ id: schema.members.id }).from(schema.members)
    .where(and(eq(schema.members.emailNormalized, email), ne(schema.members.id, target.id))).limit(1);
  if (duplicate) throw new Error("That email is already assigned to another member.");

  const mailchimp = await changeMailchimpContactEmail(target.email, email, target.firstName);
  await db.batch([
    db.update(schema.members).set({ email, emailNormalized: email, updatedAt: now }).where(eq(schema.members.id, target.id)),
    db.update(schema.networkApplications).set({ email }).where(eq(schema.networkApplications.id, target.id)),
    db.insert(schema.sheetSyncJobs).values({ id: crypto.randomUUID(), memberId: target.id, status: "pending", attempts: 0, nextAttemptAt: now, createdAt: now, updatedAt: now }),
  ]);
  const invite = await issueMemberInvite(target.id);
  return { memberId: target.id, email, mailchimp, inviteSent: true, invite };
}
