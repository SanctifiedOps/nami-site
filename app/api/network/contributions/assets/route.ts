import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { getMemberSession } from "@/lib/network-auth/session";
import { getMemberMediaBucket, getNetworkDb, schema } from "@/lib/network-db";
import { imageDimensions } from "@/lib/network-profile/image-dimensions";

const MAX_IMAGE_BYTES = 3 * 1024 * 1024;
const editableStatuses = new Set(["draft", "changes_requested"]);

export async function POST(request: Request) {
  const auth = await getMemberSession();
  if (!auth) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.formData();
  const file = body.get("image");
  const contributionId = String(body.get("contributionId") ?? "");
  const altText = String(body.get("altText") ?? "").trim();
  const kind = body.get("kind") === "inline" ? "inline" : "cover";
  const caption = String(body.get("caption") ?? "").trim().slice(0, 300);
  const position = Math.max(0, Number(body.get("position") ?? 0) || 0);

  if (!(file instanceof File) || !contributionId) {
    return Response.json({ error: "Choose a valid image." }, { status: 400 });
  }
  if (altText.length < 4 || altText.length > 180) {
    return Response.json(
      { error: "Describe the image in 4 to 180 characters." },
      { status: 400 },
    );
  }
  if (
    file.size > MAX_IMAGE_BYTES ||
    !["image/webp", "image/jpeg"].includes(file.type)
  ) {
    return Response.json(
      { error: "That image could not be prepared. Choose a JPG or WebP under 3MB." },
      { status: 400 },
    );
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const dimensions = imageDimensions(bytes, file.type);
  if (!dimensions || dimensions.width < 640 || dimensions.height < 360) {
    return Response.json(
      { error: "Images must be at least 640 by 360 pixels." },
      { status: 400 },
    );
  }

  const db = await getNetworkDb();
  const [contribution] = await db
    .select()
    .from(schema.contributions)
    .where(
      and(
        eq(schema.contributions.id, contributionId),
        eq(schema.contributions.memberId, auth.member.id),
      ),
    )
    .limit(1);
  if (!contribution) {
    return Response.json({ error: "Contribution not found." }, { status: 404 });
  }
  if (!editableStatuses.has(contribution.status)) {
    return Response.json(
      { error: "Images cannot change while this contribution is in review." },
      { status: 409 },
    );
  }

  const id = crypto.randomUUID();
  const extension = file.type === "image/jpeg" ? "jpg" : "webp";
  const key = `network-members/${auth.member.id}/contributions/${contribution.id}/${id}.${extension}`;
  const bucket = await getMemberMediaBucket();
  await bucket.put(key, bytes, {
    httpMetadata: {
      contentType: file.type,
      cacheControl: "public, max-age=31536000, immutable",
    },
  });

  const now = new Date();
  try {
    await db.batch([
      db
        .update(schema.contributionAssets)
        .set({ status: "removed", updatedAt: now })
        .where(
          kind === "cover"
            ? and(
                eq(schema.contributionAssets.contributionId, contribution.id),
                eq(schema.contributionAssets.kind, "cover"),
                eq(schema.contributionAssets.status, "ready"),
              )
            : eq(schema.contributionAssets.id, "__no_existing_inline_asset__"),
        ),
      db.insert(schema.contributionAssets).values({
        id,
        contributionId: contribution.id,
        memberId: auth.member.id,
        r2Key: key,
        kind,
        altText,
        caption,
        position,
        width: dimensions.width,
        height: dimensions.height,
        contentType: file.type,
        status: "ready",
        createdAt: now,
        updatedAt: now,
      }),
    ]);
  } catch (error) {
    await bucket.delete(key);
    throw error;
  }

  // Keep replaced files in R2. Immutable submission versions may still refer
  // to them even though they are no longer the current cover.
  return Response.json({
    ok: true,
    asset: {
      id,
      kind,
      url: `/api/network/media/${key.split("/").map(encodeURIComponent).join("/")}`,
      altText,
      caption,
      width: dimensions.width,
      height: dimensions.height,
    },
  });
}

const assetUpdateSchema = z.object({
  assetId: z.string().uuid(),
  altText: z.string().trim().min(4).max(180),
  caption: z.string().trim().max(300).optional(),
});

export async function PUT(request: Request) {
  const auth = await getMemberSession();
  if (!auth) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = assetUpdateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json(
      { error: "Describe the image in 4 to 180 characters." },
      { status: 400 },
    );
  }

  const db = await getNetworkDb();
  const [asset] = await db
    .select({ asset: schema.contributionAssets, contribution: schema.contributions })
    .from(schema.contributionAssets)
    .innerJoin(
      schema.contributions,
      eq(schema.contributions.id, schema.contributionAssets.contributionId),
    )
    .where(
      and(
        eq(schema.contributionAssets.id, parsed.data.assetId),
        eq(schema.contributionAssets.memberId, auth.member.id),
      ),
    )
    .limit(1);
  if (!asset) return Response.json({ error: "Image not found." }, { status: 404 });
  if (!editableStatuses.has(asset.contribution.status)) {
    return Response.json(
      { error: "Images cannot change while this contribution is in review." },
      { status: 409 },
    );
  }

  await db
    .update(schema.contributionAssets)
    .set({ altText: parsed.data.altText, ...(parsed.data.caption !== undefined ? { caption: parsed.data.caption } : {}), updatedAt: new Date() })
    .where(eq(schema.contributionAssets.id, asset.asset.id));
  return Response.json({ ok: true });
}
