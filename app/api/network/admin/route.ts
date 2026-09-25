import { and, eq, isNotNull, ne } from "drizzle-orm";
import { z } from "zod";
import { directoryGroups } from "@/lib/content/network-directory-groups";
import { getNetworkAdminSession } from "@/lib/network-auth/session";
import { getMemberMediaBucket, getNetworkDb, schema } from "@/lib/network-db";
import { normalizeInstagramProfileUrl, normalizeProfileUrl } from "@/lib/network-profile/links";
import { revalidateNetworkProfile } from "@/lib/network-profile/revalidate";
import { processNetworkJobs } from "@/lib/network-sync/process-jobs";

const groupSlugs = directoryGroups.map((group) => group.slug) as [string, ...string[]];
const eventRevisionSchema = z.object({ title:z.string(), eventType:z.string(), summary:z.string(), fullDescription:z.string(), venue:z.string(), address:z.string(), location:z.string(), region:z.string(), format:z.string(), startsAt:z.coerce.date(), endsAt:z.coerce.date().nullable(), priceType:z.string(), priceDetails:z.string(), bookingUrl:z.string().nullable(), accessibility:z.string(), ageGuidance:z.string(), contactEmail:z.string(), coverImageKey:z.string(), coverImageAlt:z.string() });
const actionSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("approve-application"), applicationId: z.string().min(2), primaryGroup: z.enum(groupSlugs), speciality: z.string().trim().min(2).max(80), bio: z.string().trim().min(20).max(320) }),
  z.object({ action: z.literal("reject-application"), applicationId: z.string().min(2) }),
  z.object({ action: z.literal("ticket-status"), ticketId: z.string().min(3), status: z.enum(["open", "in_progress", "resolved"]) }),
  z.object({ action: z.literal("event-status"), eventId: z.string().uuid(), status: z.enum(["approved", "rejected"]), feedback: z.string().trim().max(1000).optional().default("") }),
  z.object({ action: z.literal("event-cancel"), eventId: z.string().uuid() }),
  z.object({ action: z.literal("event-restore"), eventId: z.string().uuid() }),
  z.object({ action: z.literal("event-feature"), eventId: z.string().uuid(), featured: z.boolean() }),
  z.object({ action: z.literal("event-revision-status"), revisionId: z.string().uuid(), status: z.enum(["approved", "rejected"]), feedback: z.string().trim().max(1000).optional().default("") }),
  z.object({ action: z.literal("member-status"), memberId: z.string().min(2), status: z.enum(["active", "disabled"]) }),
  z.object({ action: z.literal("process-sheet-jobs") }),
]);

export async function POST(request: Request) {
  const admin = await getNetworkAdminSession();
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = actionSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Check the admin action and try again." }, { status: 400 });

  const db = await getNetworkDb();
  const now = new Date();

  if (parsed.data.action === "process-sheet-jobs") {
    return Response.json({ ok: true, ...(await processNetworkJobs(50, "sheet")) });
  }

  if (parsed.data.action === "ticket-status") {
    await db.update(schema.supportTickets).set({
      status: parsed.data.status,
      resolvedAt: parsed.data.status === "resolved" ? now : null,
      updatedAt: now,
    }).where(eq(schema.supportTickets.id, parsed.data.ticketId));
    return Response.json({ ok: true });
  }

  if (parsed.data.action === "event-status") {
    const [event] = await db.select().from(schema.networkEvents).where(eq(schema.networkEvents.id, parsed.data.eventId)).limit(1);
    if (!event) return Response.json({ error: "Event not found." }, { status: 404 });
    if (event.status !== "pending") return Response.json({ error: "This event has already been reviewed." }, { status: 409 });
    if (parsed.data.status === "approved" && (event.endsAt || event.startsAt) <= now) return Response.json({ error: "An event that has already finished cannot be approved." }, { status: 409 });
    await db.batch([
      db.update(schema.networkEvents).set({ status: parsed.data.status, adminFeedback: parsed.data.feedback || null, reviewedAt: now, publishedAt: parsed.data.status === "approved" ? now : null, updatedAt: now }).where(eq(schema.networkEvents.id, parsed.data.eventId)),
      db.insert(schema.eventSheetSyncJobs).values({ id: crypto.randomUUID(), eventId: parsed.data.eventId, status: "pending", attempts: 0, nextAttemptAt: now, createdAt: now, updatedAt: now }),
    ]);
    return Response.json({ ok: true });
  }

  if (parsed.data.action === "event-cancel" || parsed.data.action === "event-restore" || parsed.data.action === "event-feature") {
    const [event] = await db.select().from(schema.networkEvents).where(eq(schema.networkEvents.id, parsed.data.eventId)).limit(1);
    if (!event) return Response.json({ error: "Event not found." }, { status: 404 });
    if (parsed.data.action === "event-restore" && (event.endsAt || event.startsAt) <= now) return Response.json({ error: "A finished event cannot be restored to upcoming events." }, { status: 409 });
    const values = parsed.data.action === "event-cancel" ? { status: "cancelled" as const, cancelledAt: now, updatedAt: now }
      : parsed.data.action === "event-restore" ? { status: "approved" as const, cancelledAt: null, updatedAt: now }
      : { featured: parsed.data.featured, updatedAt: now };
    await db.batch([
      db.update(schema.networkEvents).set(values).where(eq(schema.networkEvents.id, parsed.data.eventId)),
      db.insert(schema.eventSheetSyncJobs).values({ id: crypto.randomUUID(), eventId: parsed.data.eventId, status: "pending", attempts: 0, nextAttemptAt: now, createdAt: now, updatedAt: now }),
    ]);
    return Response.json({ ok: true });
  }

  if (parsed.data.action === "event-revision-status") {
    const [revision] = await db.select().from(schema.eventRevisions).where(eq(schema.eventRevisions.id, parsed.data.revisionId)).limit(1);
    if (!revision) return Response.json({ error: "Event revision not found." }, { status: 404 });
    if (revision.status !== "pending") return Response.json({ error: "This revision has already been reviewed." }, { status: 409 });
    const [event] = await db.select().from(schema.networkEvents).where(eq(schema.networkEvents.id, revision.eventId)).limit(1);
    if (!event) return Response.json({ error: "Event not found." }, { status: 404 });
    if (parsed.data.status === "approved") {
      const payload = eventRevisionSchema.safeParse(revision.payload);
      if (!payload.success) return Response.json({ error: "The proposed event changes are invalid." }, { status: 400 });
      if ((payload.data.endsAt || payload.data.startsAt) <= now) return Response.json({ error: "Changes to a finished event cannot be approved." }, { status: 409 });
      await db.batch([
        db.update(schema.networkEvents).set({ ...payload.data, adminFeedback: null, reviewedAt: now, updatedAt: now }).where(eq(schema.networkEvents.id, event.id)),
        db.update(schema.eventRevisions).set({ status: "approved", adminFeedback: parsed.data.feedback || null, reviewerId: admin.member.id, reviewedAt: now }).where(eq(schema.eventRevisions.id, revision.id)),
        db.insert(schema.eventSheetSyncJobs).values({ id: crypto.randomUUID(), eventId: event.id, status: "pending", attempts: 0, nextAttemptAt: now, createdAt: now, updatedAt: now }),
      ]);
    } else {
      await db.update(schema.eventRevisions).set({ status: "rejected", adminFeedback: parsed.data.feedback || null, reviewerId: admin.member.id, reviewedAt: now }).where(eq(schema.eventRevisions.id, revision.id));
    }
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
  return Response.json({ ok: true });
}
