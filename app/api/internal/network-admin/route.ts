import { and, desc, eq, ne } from "drizzle-orm";
import { z } from "zod";
import { directoryGroups } from "@/lib/content/network-directory-groups";
import { isNetworkAdminRequest } from "@/lib/network-auth/admin";
import { getMemberMediaBucket, getNetworkDb, schema } from "@/lib/network-db";
import { issueMemberInvite } from "@/lib/network-auth/member-invitations";
import { revalidateNetworkProfile } from "@/lib/network-profile/revalidate";
import { normalizeInstagramProfileUrl, normalizeProfileUrl } from "@/lib/network-profile/links";
import { changeMailchimpContactEmail } from "@/lib/network-sync/mailchimp";

const groupSlugs = directoryGroups.map((group) => group.slug) as [string, ...string[]];
const actionSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("approve"), applicationId: z.string().min(2), primaryGroup: z.enum(groupSlugs), speciality: z.string().trim().min(2).max(80), bio: z.string().trim().min(20).max(320) }),
  z.object({ action: z.literal("resend-invite"), memberId: z.string().min(2) }),
  z.object({ action: z.literal("correct-member-email"), memberId: z.string().min(2), email: z.string().trim().email() }),
  z.object({ action: z.literal("disable"), memberId: z.string().min(2) }),
  z.object({ action: z.literal("enable"), memberId: z.string().min(2) }),
]);

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
    const submittedImageExtension = application.profileImageKey?.split(".").pop()?.toLowerCase();
    const approvedImageExtension = submittedImageExtension && ["jpg", "jpeg", "png", "webp"].includes(submittedImageExtension)
      ? (submittedImageExtension === "jpeg" ? "jpg" : submittedImageExtension)
      : "webp";
    const approvedImageKey = application.profileImageKey
      ? `network-members/${application.id}/profile/${crypto.randomUUID()}.${approvedImageExtension}`
      : null;
    if (application.profileImageKey && approvedImageKey) {
      const source = await bucket.get(application.profileImageKey);
      if (!source) return Response.json({ error: "The submitted profile image could not be found." }, { status: 409 });
      await bucket.put(approvedImageKey, source.body, {
        httpMetadata: { contentType: source.httpMetadata?.contentType || `image/${approvedImageExtension === "jpg" ? "jpeg" : approvedImageExtension}`, cacheControl: "public, max-age=31536000, immutable" },
      });
    }
    try {
      await db.batch([
      db.insert(schema.members).values({ id: application.id, firstName: application.firstName, email: application.email, emailNormalized: application.email.toLowerCase(), approvalStatus: "approved", accountStatus: "unclaimed", joinedAt: now, createdAt: now, updatedAt: now }),
      db.insert(schema.memberProfiles).values({ memberId: application.id, displayName: application.displayName, location: application.location, primaryGroup: parsed.data.primaryGroup, speciality: parsed.data.speciality, bio: parsed.data.bio, about: application.bio, websiteUrl: normalizeProfileUrl(application.websiteUrl), instagramUrl: normalizeInstagramProfileUrl(application.instagramUrl), profileImageKey: approvedImageKey, published: true, updatedAt: now }),
      db.update(schema.networkApplications).set({ status: "approved", reviewedAt: now }).where(eq(schema.networkApplications.id, application.id)),
      db.insert(schema.sheetSyncJobs).values({ id: crypto.randomUUID(), memberId: application.id, status: "pending", attempts: 0, nextAttemptAt: now, createdAt: now, updatedAt: now }),
      ]);
    } catch (error) {
      if (approvedImageKey) await bucket.delete(approvedImageKey);
      throw error;
    }
    if (application.profileImageKey) await bucket.delete(application.profileImageKey);
    revalidateNetworkProfile(application.id, [parsed.data.primaryGroup], true);
    try {
      await issueMemberInvite(application.id);
      return Response.json({ ok: true, memberId: application.id, inviteSent: true });
    } catch (error) {
      return Response.json({
        ok: true,
        memberId: application.id,
        inviteSent: false,
        warning: `The profile is live, but the claim email needs a retry: ${error instanceof Error ? error.message : "Unknown email error"}`,
      });
    }
  }
  if (parsed.data.action === "resend-invite") { await issueMemberInvite(parsed.data.memberId); return Response.json({ ok: true }); }
  if (parsed.data.action === "correct-member-email") {
    const email = parsed.data.email.trim().toLowerCase();
    const [target] = await db.select().from(schema.members).where(eq(schema.members.id, parsed.data.memberId)).limit(1);
    if (!target) return Response.json({ error: "Member not found." }, { status: 404 });
    if (target.authUserId || target.accountStatus === "active") {
      return Response.json({ error: "Active account emails must be changed through the authenticated account workflow." }, { status: 409 });
    }
    const [duplicate] = await db.select({ id: schema.members.id }).from(schema.members)
      .where(and(eq(schema.members.emailNormalized, email), ne(schema.members.id, target.id))).limit(1);
    if (duplicate) return Response.json({ error: "That email is already assigned to another member." }, { status: 409 });

    const mailchimp = await changeMailchimpContactEmail(target.email, email, target.firstName);
    await db.batch([
      db.update(schema.members).set({ email, emailNormalized: email, updatedAt: now }).where(eq(schema.members.id, target.id)),
      db.update(schema.networkApplications).set({ email }).where(eq(schema.networkApplications.id, target.id)),
      db.insert(schema.sheetSyncJobs).values({ id: crypto.randomUUID(), memberId: target.id, status: "pending", attempts: 0, nextAttemptAt: now, createdAt: now, updatedAt: now }),
    ]);
    const invite = await issueMemberInvite(target.id);
    return Response.json({ ok: true, memberId: target.id, email, mailchimp, inviteSent: true, invite });
  }
  const status = parsed.data.action === "disable" ? "disabled" : "active";
  const [targetMember] = await db.select({ authUserId: schema.members.authUserId }).from(schema.members).where(eq(schema.members.id, parsed.data.memberId)).limit(1);
  await db.update(schema.members).set({ accountStatus: status, updatedAt: now }).where(eq(schema.members.id, parsed.data.memberId));
  if (parsed.data.action === "disable" && targetMember?.authUserId) await db.delete(schema.session).where(eq(schema.session.userId, targetMember.authUserId));
  return Response.json({ ok: true });
}
