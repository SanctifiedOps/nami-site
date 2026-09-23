import { eq } from "drizzle-orm";
import { getMemberSession } from "@/lib/network-auth/session";
import { getNetworkDb, schema } from "@/lib/network-db";
import { memberProfileSchema } from "@/lib/network-profile/validation";
import { revalidateNetworkProfile } from "@/lib/network-profile/revalidate";
import { normalizeInstagramProfileUrl, normalizeProfileUrl } from "@/lib/network-profile/links";

export async function GET() {
  const auth = await getMemberSession();
  if (!auth) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const db = await getNetworkDb();
  const [profile] = await db.select().from(schema.memberProfiles).where(eq(schema.memberProfiles.memberId, auth.member.id)).limit(1);
  const images = await db.select().from(schema.profileImages).where(eq(schema.profileImages.memberId, auth.member.id)).orderBy(schema.profileImages.position);
  if (!profile) return Response.json({ error: "Profile not found" }, { status: 404 });
  return Response.json({
    profile: {
      ...profile,
      websiteUrl: normalizeProfileUrl(profile.websiteUrl),
      instagramUrl: normalizeInstagramProfileUrl(profile.instagramUrl),
      facebookUrl: normalizeProfileUrl(profile.facebookUrl),
      linkedinUrl: normalizeProfileUrl(profile.linkedinUrl),
      tiktokUrl: normalizeProfileUrl(profile.tiktokUrl),
      youtubeUrl: normalizeProfileUrl(profile.youtubeUrl),
    },
    images,
    email: auth.member.email,
  });
}

export async function PUT(request: Request) {
  const auth = await getMemberSession();
  if (!auth) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = memberProfileSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Check the highlighted profile information.", issues: parsed.error.flatten() }, { status: 400 });

  const db = await getNetworkDb();
  const [before] = await db.select().from(schema.memberProfiles).where(eq(schema.memberProfiles.memberId, auth.member.id)).limit(1);
  if (!before) return Response.json({ error: "Profile not found" }, { status: 404 });
  const changedFields = Object.entries(parsed.data).filter(([key, value]) => before[key as keyof typeof before] !== value).map(([key]) => key);
  if (!changedFields.length) return Response.json({ ok: true, changedFields: [] });

  const now = new Date();
  await db.batch([
    db.update(schema.memberProfiles).set({ ...parsed.data, updatedAt: now }).where(eq(schema.memberProfiles.memberId, auth.member.id)),
    db.insert(schema.profileAuditLog).values({
      id: crypto.randomUUID(),
      memberId: auth.member.id,
      actorUserId: auth.session.user.id,
      changedFields,
      beforeJson: Object.fromEntries(changedFields.map((field) => [field, before[field as keyof typeof before]])),
      afterJson: Object.fromEntries(changedFields.map((field) => [field, parsed.data[field as keyof typeof parsed.data]])),
      createdAt: now,
    }),
    db.insert(schema.sheetSyncJobs).values({
      id: crypto.randomUUID(),
      memberId: auth.member.id,
      status: "pending",
      attempts: 0,
      nextAttemptAt: now,
      createdAt: now,
      updatedAt: now,
    }),
  ]);
  revalidateNetworkProfile(auth.member.id, [before.primaryGroup, parsed.data.primaryGroup]);
  return Response.json({ ok: true, changedFields });
}
