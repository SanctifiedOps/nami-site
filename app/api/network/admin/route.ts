import { and, eq, isNotNull, ne } from "drizzle-orm";
import { z } from "zod";
import { directoryGroups } from "@/lib/content/network-directory-groups";
import { getNetworkAdminSession } from "@/lib/network-auth/session";
import { getMemberMediaBucket, getNetworkDb, schema } from "@/lib/network-db";
import { normalizeInstagramProfileUrl, normalizeProfileUrl } from "@/lib/network-profile/links";
import { revalidateNetworkProfile } from "@/lib/network-profile/revalidate";

const groupSlugs = directoryGroups.map((group) => group.slug) as [string, ...string[]];
const actionSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("approve-application"), applicationId: z.string().min(2), primaryGroup: z.enum(groupSlugs), speciality: z.string().trim().min(2).max(80) }),
  z.object({ action: z.literal("reject-application"), applicationId: z.string().min(2) }),
  z.object({ action: z.literal("ticket-status"), ticketId: z.string().min(3), status: z.enum(["open", "in_progress", "resolved"]) }),
  z.object({ action: z.literal("event-status"), eventId: z.string().uuid(), status: z.enum(["approved", "rejected"]) }),
  z.object({ action: z.literal("member-status"), memberId: z.string().min(2), status: z.enum(["active", "disabled"]) }),
]);

export async function POST(request: Request) {
  const admin = await getNetworkAdminSession();
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = actionSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Check the admin action and try again." }, { status: 400 });

  const db = await getNetworkDb();
  const now = new Date();

  if (parsed.data.action === "ticket-status") {
    await db.update(schema.supportTickets).set({
      status: parsed.data.status,
      resolvedAt: parsed.data.status === "resolved" ? now : null,
      updatedAt: now,
    }).where(eq(schema.supportTickets.id, parsed.data.ticketId));
    return Response.json({ ok: true });
  }

  if (parsed.data.action === "event-status") {
    await db.update(schema.networkEvents).set({
      status: parsed.data.status,
      reviewedAt: now,
      publishedAt: parsed.data.status === "approved" ? now : null,
      updatedAt: now,
    }).where(eq(schema.networkEvents.id, parsed.data.eventId));
    return Response.json({ ok: true });
  }

  if (parsed.data.action === "member-status") {
    if (parsed.data.memberId === admin.member.id) return Response.json({ error: "Your own admin account cannot be disabled here." }, { status: 409 });
    const [target] = await db.select({ authUserId: schema.members.authUserId }).from(schema.members).where(eq(schema.members.id, parsed.data.memberId)).limit(1);
    if (!target) return Response.json({ error: "Member not found." }, { status: 404 });
    await db.update(schema.members).set({ accountStatus: parsed.data.status, updatedAt: now }).where(eq(schema.members.id, parsed.data.memberId));
    if (parsed.data.status === "disabled" && target.authUserId) await db.delete(schema.session).where(eq(schema.session.userId, target.authUserId));
    return Response.json({ ok: true });
  }

  if (parsed.data.action === "reject-application") {
    const [application] = await db.select({ status: schema.networkApplications.status }).from(schema.networkApplications).where(eq(schema.networkApplications.id, parsed.data.applicationId)).limit(1);
    if (!application) return Response.json({ error: "Application not found." }, { status: 404 });
    if (application.status !== "pending") return Response.json({ error: "This application has already been reviewed." }, { status: 409 });
    await db.update(schema.networkApplications).set({ status: "rejected", reviewedAt: now }).where(eq(schema.networkApplications.id, parsed.data.applicationId));
    return Response.json({ ok: true });
  }

  const [application] = await db.select().from(schema.networkApplications).where(eq(schema.networkApplications.id, parsed.data.applicationId)).limit(1);
  if (!application) return Response.json({ error: "Application not found." }, { status: 404 });
  if (application.status !== "pending") return Response.json({ error: "This application has already been reviewed." }, { status: 409 });
  const [existingMember] = await db.select({ id: schema.members.id }).from(schema.members).where(eq(schema.members.id, application.id)).limit(1);
  if (existingMember) return Response.json({ error: "This member already exists." }, { status: 409 });
  const [otherAccount] = await db.select({ id: schema.members.id }).from(schema.members)
    .where(and(eq(schema.members.emailNormalized, application.email.toLowerCase()), isNotNull(schema.members.authUserId), ne(schema.members.id, application.id))).limit(1);
  if (otherAccount) return Response.json({ error: "This email already belongs to another member account." }, { status: 409 });

  const bucket = await getMemberMediaBucket();
  const approvedImageKey = application.profileImageKey ? `network-members/${application.id}/profile/${crypto.randomUUID()}.webp` : null;
  if (application.profileImageKey && approvedImageKey) {
    const source = await bucket.get(application.profileImageKey);
    if (!source) return Response.json({ error: "The submitted profile image could not be found." }, { status: 409 });
    await bucket.put(approvedImageKey, source.body, { httpMetadata: { contentType: "image/webp", cacheControl: "public, max-age=31536000, immutable" } });
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
  return Response.json({ ok: true });
}
