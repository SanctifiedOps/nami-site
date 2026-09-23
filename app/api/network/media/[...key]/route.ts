import { getMemberMediaBucket } from "@/lib/network-db";

export async function GET(_request: Request, context: { params: Promise<{ key: string[] }> }) {
  const { key } = await context.params;
  const objectKey = key.join("/");
  if (!objectKey.startsWith("network-members/") || objectKey.includes("..")) return new Response("Not found", { status: 404 });
  const bucket = await getMemberMediaBucket();
  const object = await bucket.get(objectKey);
  if (!object) return new Response("Not found", { status: 404 });
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("Cache-Control", "public, max-age=31536000, immutable");
  headers.set("X-Content-Type-Options", "nosniff");
  return new Response(object.body, { headers });
}
