import "server-only";

import { and, eq, isNotNull, isNull, ne } from "drizzle-orm";
import { getRuntimeEnvironment } from "@/lib/cloudflare-env";
import { getNetworkDb, schema } from "@/lib/network-db";
import { sendNetworkEmail } from "@/lib/network-auth/email";
import { createInviteToken, hashToken } from "@/lib/network-auth/tokens";

export const MEMBER_INVITE_DAYS = 14;

export async function issueMemberInvite(memberId: string) {
  const env = await getRuntimeEnvironment();
  if (env.MEMBER_INVITATIONS_MODE !== "live" || env.OUTBOUND_EMAIL_MODE !== "live") {
    throw new Error("Member invitations are on hold.");
  }

  const db = await getNetworkDb();
  const [record] = await db.select({ member: schema.members, profile: schema.memberProfiles }).from(schema.members)
    .innerJoin(schema.memberProfiles, eq(schema.memberProfiles.memberId, schema.members.id))
    .where(eq(schema.members.id, memberId)).limit(1);
  if (!record) throw new Error("Member not found.");
  if (!record.profile.published) throw new Error("Only published profiles can be invited.");
  if (record.member.authUserId || record.member.accountStatus === "active") {
    throw new Error("This member already has an account. Use password reset instead.");
  }
  if (record.member.accountStatus === "disabled") throw new Error("Enable this account before issuing an invitation.");
  if (!record.member.emailNormalized) throw new Error("This member does not have a valid email address.");

  const [otherAccount] = await db.select({ id: schema.members.id }).from(schema.members)
    .where(and(eq(schema.members.emailNormalized, record.member.emailNormalized), isNotNull(schema.members.authUserId), ne(schema.members.id, memberId))).limit(1);
  if (otherAccount) throw new Error("This email already has a member account. Link the profiles before inviting again.");

  const rawToken = createInviteToken();
  const tokenHash = await hashToken(rawToken);
  const now = new Date();
  const inviteId = crypto.randomUUID();
  await db.update(schema.memberInvites).set({ revokedAt: now }).where(and(eq(schema.memberInvites.memberId, memberId), isNull(schema.memberInvites.redeemedAt)));
  await db.insert(schema.memberInvites).values({ id: inviteId, memberId, tokenHash, expiresAt: new Date(Date.now() + MEMBER_INVITE_DAYS * 86400000), createdAt: now });

  const appUrl = env.APP_URL || "https://namicreative.co.uk";
  try {
    await sendNetworkEmail({
      memberId,
      recipient: record.member.email,
      template: "profile-ready",
      subject: "Your NAMI Network profile is ready",
      heading: "Your profile is ready to claim",
      body: "Set up your password and you can update your directory profile, links and work whenever you like.",
      actionLabel: "Create my member account",
      actionUrl: `${appUrl}/network/invite/${rawToken}`,
    });
    await db.update(schema.members).set({ invitedAt: now, accountStatus: "invited", updatedAt: now }).where(eq(schema.members.id, memberId));
  } catch (error) {
    await db.update(schema.memberInvites).set({ revokedAt: new Date() }).where(eq(schema.memberInvites.id, inviteId));
    throw error;
  }

  return { memberId, email: record.member.email };
}
