import { and, desc, eq, isNotNull, isNull, ne } from "drizzle-orm";
import { z } from "zod";
import { directoryGroups } from "@/lib/content/network-directory-groups";
import { isNetworkAdminRequest } from "@/lib/network-auth/admin";
import { sendNetworkEmail } from "@/lib/network-auth/email";
import { createInviteToken, hashToken } from "@/lib/network-auth/tokens";
import { getMemberMediaBucket, getNetworkDb, schema } from "@/lib/network-db";
import { getRuntimeEnvironment } from "@/lib/cloudflare-env";
import { revalidateNetworkProfile } from "@/lib/network-profile/revalidate";
import { normalizeInstagramProfileUrl, normalizeProfileUrl } from "@/lib/network-profile/links";

const groupSlugs = directoryGroups.map((group) => group.slug) as [string, ...string[]];
const actionSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("approve"), applicationId: z.string().min(2), primaryGroup: z.enum(groupSlugs), speciality: z.string().trim().min(2).max(80) }),
  z.object({ action: z.literal("resend-invite"), memberId: z.string().min(2) }),
  z.object({ action: z.literal("disable"), memberId: z.string().min(2) }),
  z.object({ action: z.literal("enable"), memberId: z.string().min(2) }),
]);

async function issueInvite(memberId: string) {
  const env = await getRuntimeEnvironment();
  if (env.MEMBER_INVITATIONS_MODE !== "live" || env.OUTBOUND_EMAIL_MODE !== "live") {
    throw new Error("Member invitations are on hold.");
  }
  const db = await getNetworkDb();
  const [record] = await db.select({ member: schema.members, profile: schema.memberProfiles }).from(schema.members)
    .innerJoin(schema.memberProfiles, eq(schema.memberProfiles.memberId, schema.members.id)).where(eq(schema.members.id, memberId)).limit(1);
  if (!record) throw new Error("Member not found.");
  if (record.member.authUserId) throw new Error("This member already has an account. Use password reset instead.");
  if (record.member.accountStatus === "disabled") throw new Error("Enable this account before issuing an invitation.");
  const [otherAccount] = await db.select({ id: schema.members.id }).from(schema.members)
    .where(and(eq(schema.members.emailNormalized, record.member.emailNormalized), isNotNull(schema.members.authUserId), ne(schema.members.id, memberId))).limit(1);
  if (otherAccount) throw new Error("This email already has a member account. Link the profiles before inviting again.");
  const rawToken = createInviteToken(); const tokenHash = await hashToken(rawToken); const now = new Date();
  await db.update(schema.memberInvites).set({ revokedAt: now }).where(and(eq(schema.memberInvites.memberId, memberId), isNull(schema.memberInvites.redeemedAt)));
  await db.insert(schema.memberInvites).values({ id: crypto.randomUUID(), memberId, tokenHash, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), createdAt: now });
  await db.update(schema.members).set({ invitedAt: now, accountStatus: "invited", updatedAt: now }).where(eq(schema.members.id, memberId));
  const appUrl = env.APP_URL || "https://namicreative.co.uk";
  await sendNetworkEmail({ memberId, recipient: record.member.email, template: "profile-ready", subject: "Your NAMI Network profile is ready", heading: "Your profile is ready to claim", body: "Set up your password and you can update your directory profile, links and work whenever you like.", actionLabel: "Create my member account", actionUrl: `${appUrl}/network/invite/${rawToken}` });
}

export async function GET(request: Request) {
  if (!(await isNetworkAdminRequest(request))) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const db = await getNetworkDb();
  const applications = await db.select().from(schema.networkApplications).orderBy(desc(schema.networkApplications.submittedAt));
  const memberRows = await db.select({ member: schema.members, profile: schema.memberProfiles }).from(schema.members).leftJoin(schema.memberProfiles, eq(schema.memberProfiles.memberId, schema.members.id)).orderBy(desc(schema.members.joinedAt));
  return Response.json({ applications, members: memberRows });
}

export async function POST(request: Request) {
  if (!(await isNetworkAdminRequest(request))) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = actionSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Invalid admin action." }, { status: 400 });
  const db = await getNetworkDb(); const now = new Date();
  if (parsed.data.action === "approve") {
    const [application] = await db.select().from(schema.networkApplications).where(eq(schema.networkApplications.id, parsed.data.applicationId)).limit(1);
    if (!application) return Response.json({ error: "Application not found." }, { status: 404 });
    if (application.status !== "pending") return Response.json({ error: "This application has already been reviewed." }, { status: 409 });
    const [existingMember] = await db.select({ id: schema.members.id }).from(schema.members).where(eq(schema.members.id, application.id)).limit(1);
    if (existingMember) return Response.json({ error: "This member already exists." }, { status: 409 });
    const bucket = await getMemberMediaBucket();
    const approvedImageKey = application.profileImageKey
      ? `network-members/${application.id}/profile/${crypto.randomUUID()}.webp`
      : null;
    if (application.profileImageKey && approvedImageKey) {
      const source = await bucket.get(application.profileImageKey);
      if (!source) return Response.json({ error: "The submitted profile image could not be found." }, { status: 409 });
      await bucket.put(approvedImageKey, source.body, {
        httpMetadata: { contentType: "image/webp", cacheControl: "public, max-age=31536000, immutable" },
      });
    }
    try {
      await db.batch([
      db.insert(schema.members).values({ id: application.id, firstName: application.firstName, email: application.email, emailNormalized: application.email.toLowerCase(), approvalStatus: "approved", accountStatus: "unclaimed", joinedAt: now, createdAt: now, updatedAt: now }),
      db.insert(schema.memberProfiles).values({ memberId: application.id, displayName: application.displayName, location: application.location, primaryGroup: parsed.data.primaryGroup, speciality: parsed.data.speciality, bio: application.bio, websiteUrl: normalizeProfileUrl(application.websiteUrl), instagramUrl: normalizeInstagramProfileUrl(application.instagramUrl), profileImageKey: approvedImageKey, published: true, updatedAt: now }),
      db.update(schema.networkApplications).set({ status: "approved", reviewedAt: now }).where(eq(schema.networkApplications.id, application.id)),
      db.insert(schema.sheetSyncJobs).values({ id: crypto.randomUUID(), memberId: application.id, status: "pending", attempts: 0, nextAttemptAt: now, createdAt: now, updatedAt: now }),
      ]);
    } catch (error) {
      if (approvedImageKey) await bucket.delete(approvedImageKey);
      throw error;
    }
    if (application.profileImageKey) await bucket.delete(application.profileImageKey);
    revalidateNetworkProfile(application.id, [parsed.data.primaryGroup], true);
    return Response.json({ ok: true, memberId: application.id });
  }
  if (parsed.data.action === "resend-invite") { await issueInvite(parsed.data.memberId); return Response.json({ ok: true }); }
  const status = parsed.data.action === "disable" ? "disabled" : "active";
  const [targetMember] = await db.select({ authUserId: schema.members.authUserId }).from(schema.members).where(eq(schema.members.id, parsed.data.memberId)).limit(1);
  await db.update(schema.members).set({ accountStatus: status, updatedAt: now }).where(eq(schema.members.id, parsed.data.memberId));
  if (parsed.data.action === "disable" && targetMember?.authUserId) await db.delete(schema.session).where(eq(schema.session.userId, targetMember.authUserId));
  return Response.json({ ok: true });
}
