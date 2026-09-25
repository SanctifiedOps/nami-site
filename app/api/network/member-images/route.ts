import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { getMemberSession } from "@/lib/network-auth/session";
import { getMemberMediaBucket, getNetworkDb, schema } from "@/lib/network-db";
import { imageDimensions } from "@/lib/network-profile/image-dimensions";
import { revalidateNetworkProfile } from "@/lib/network-profile/revalidate";
import { normalizeProfileUrl } from "@/lib/network-profile/links";

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

export async function POST(request: Request) {
  const auth = await getMemberSession();
  if (!auth) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.formData();
  const file = body.get("image");
  const kind = body.get("kind");
  const altText = String(body.get("altText") ?? "").trim();
  if (!(file instanceof File) || (kind !== "profile" && kind !== "portfolio")) {
    return Response.json({ error: "Choose a valid image." }, { status: 400 });
  }
  if (file.size > MAX_IMAGE_BYTES || !["image/webp", "image/jpeg"].includes(file.type)) {
    return Response.json({ error: "That photo could not be prepared. Please try it again." }, { status: 400 });
  }
  if (kind === "portfolio" && altText.length > 180) {
    return Response.json({ error: "Image descriptions can be up to 180 characters." }, { status: 400 });
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const dimensions = imageDimensions(bytes, file.type);
  if (!dimensions || dimensions.width < 300 || dimensions.height < 300) {
    return Response.json({ error: "The image is invalid or too small." }, { status: 400 });
  }
  const ratio = dimensions.width / dimensions.height;
  if (kind === "profile" && Math.abs(ratio - 1) > 0.02) {
    return Response.json({ error: "Profile pictures must be square." }, { status: 400 });
  }
  if (kind === "portfolio" && Math.abs(ratio - 0.75) > 0.02) {
    return Response.json({ error: "Portfolio images must use a 3:4 crop." }, { status: 400 });
  }

  const db = await getNetworkDb();
  const bucket = await getMemberMediaBucket();
  const id = crypto.randomUUID();
  const extension = file.type === "image/jpeg" ? "jpg" : "webp";
  const key = kind === "profile"
    ? `network-members/${auth.member.id}/profile/${id}.${extension}`
    : `network-members/${auth.member.id}/portfolio/${id}.${extension}`;

  let oldKey: string | null = null;
  if (kind === "profile") {
    const [profile] = await db.select({ key: schema.memberProfiles.profileImageKey }).from(schema.memberProfiles).where(eq(schema.memberProfiles.memberId, auth.member.id)).limit(1);
    oldKey = profile?.key ?? null;
  } else {
    const current = await db.select().from(schema.profileImages).where(and(eq(schema.profileImages.memberId, auth.member.id), eq(schema.profileImages.status, "ready")));
    if (current.length >= 4) return Response.json({ error: "You can upload up to four portfolio images." }, { status: 409 });
  }

  await bucket.put(key, bytes, { httpMetadata: { contentType: file.type, cacheControl: "public, max-age=31536000, immutable" } });
  const now = new Date();
  try {
    if (kind === "profile") {
      await db.batch([
        db.update(schema.memberProfiles).set({ profileImageKey: key, updatedAt: now }).where(eq(schema.memberProfiles.memberId, auth.member.id)),
        db.insert(schema.profileAuditLog).values({
          id: crypto.randomUUID(), memberId: auth.member.id, actorUserId: auth.session.user.id,
          changedFields: ["profileImageKey"], beforeJson: { profileImageKey: oldKey }, afterJson: { profileImageKey: key }, createdAt: now,
        }),
        db.insert(schema.sheetSyncJobs).values({ id: crypto.randomUUID(), memberId: auth.member.id, status: "pending", attempts: 0, nextAttemptAt: now, createdAt: now, updatedAt: now }),
      ]);
    } else {
      const current = await db.select({ position: schema.profileImages.position }).from(schema.profileImages).where(and(eq(schema.profileImages.memberId, auth.member.id), eq(schema.profileImages.status, "ready")));
      const position = current.length ? Math.max(...current.map((image) => image.position)) + 1 : 0;
      await db.batch([
        db.insert(schema.profileImages).values({ id, memberId: auth.member.id, r2Key: key, position, altText, width: dimensions.width, height: dimensions.height, contentType: file.type, status: "ready", createdAt: now, updatedAt: now }),
        db.insert(schema.profileAuditLog).values({ id: crypto.randomUUID(), memberId: auth.member.id, actorUserId: auth.session.user.id, changedFields: ["portfolioImages"], beforeJson: {}, afterJson: { added: id }, createdAt: now }),
        db.insert(schema.sheetSyncJobs).values({ id: crypto.randomUUID(), memberId: auth.member.id, status: "pending", attempts: 0, nextAttemptAt: now, createdAt: now, updatedAt: now }),
      ]);
    }
  } catch (error) {
    await bucket.delete(key);
    throw error;
  }
  if (oldKey) await bucket.delete(oldKey);
  revalidateNetworkProfile(auth.member.id);
  return Response.json({ ok: true, id, key, width: dimensions.width, height: dimensions.height });
}

const orderSchema = z.object({
  images: z.array(z.object({
    id: z.string().uuid(),
    position: z.number().int().min(0).max(3),
    altText: z.string().trim().max(180).refine((value) => !value || value.length >= 4, "Use at least four characters or leave the description blank."),
    title: z.string().trim().max(80),
    description: z.string().trim().max(180),
    linkUrl: z.string().trim().max(500),
  })).max(4),
});

export async function PUT(request: Request) {
  const auth = await getMemberSession();
  if (!auth) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = orderSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success || new Set(parsed.data?.images.map((image) => image.position)).size !== parsed.data?.images.length) {
    return Response.json({ error: "Invalid image order or description." }, { status: 400 });
  }
  const db = await getNetworkDb();
  const existing = await db.select({ id: schema.profileImages.id }).from(schema.profileImages).where(eq(schema.profileImages.memberId, auth.member.id));
  const owned = new Set(existing.map((image) => image.id));
  if (parsed.data.images.some((image) => !owned.has(image.id))) return Response.json({ error: "Invalid image." }, { status: 403 });
  const now = new Date();
  for (const image of parsed.data.images) {
    const linkUrl = image.linkUrl ? normalizeProfileUrl(image.linkUrl) : "";
    if (image.linkUrl && !linkUrl) return Response.json({ error: "Enter a valid link for your image." }, { status: 400 });
    await db.update(schema.profileImages).set({ position: image.position + 10, altText: image.altText, title: image.title, description: image.description, linkUrl: linkUrl || null, updatedAt: now }).where(and(eq(schema.profileImages.id, image.id), eq(schema.profileImages.memberId, auth.member.id)));
  }
  for (const image of parsed.data.images) {
    await db.update(schema.profileImages).set({ position: image.position, updatedAt: now }).where(and(eq(schema.profileImages.id, image.id), eq(schema.profileImages.memberId, auth.member.id)));
  }
  await db.insert(schema.sheetSyncJobs).values({ id: crypto.randomUUID(), memberId: auth.member.id, status: "pending", attempts: 0, nextAttemptAt: now, createdAt: now, updatedAt: now });
  revalidateNetworkProfile(auth.member.id);
  return Response.json({ ok: true });
}

export async function DELETE(request: Request) {
  const auth = await getMemberSession();
  if (!auth) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return Response.json({ error: "Image ID is required." }, { status: 400 });
  const db = await getNetworkDb();
  const [image] = await db.select().from(schema.profileImages).where(and(eq(schema.profileImages.id, id), eq(schema.profileImages.memberId, auth.member.id))).limit(1);
  if (!image) return Response.json({ error: "Image not found." }, { status: 404 });
  await db.delete(schema.profileImages).where(eq(schema.profileImages.id, image.id));
  const bucket = await getMemberMediaBucket();
  await bucket.delete(image.r2Key);
  await db.insert(schema.sheetSyncJobs).values({ id: crypto.randomUUID(), memberId: auth.member.id, status: "pending", attempts: 0, nextAttemptAt: new Date(), createdAt: new Date(), updatedAt: new Date() });
  revalidateNetworkProfile(auth.member.id);
  return Response.json({ ok: true });
}
