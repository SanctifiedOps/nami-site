import "server-only";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export async function getNetworkDb() {
  const { env } = await getCloudflareContext({ async: true });
  if (!env.DB) throw new Error("Cloudflare D1 binding DB is unavailable.");
  return drizzle(env.DB, { schema });
}

export async function getMemberMediaBucket() {
  const { env } = await getCloudflareContext({ async: true });
  if (!env.MEMBER_MEDIA) throw new Error("Cloudflare R2 binding MEMBER_MEDIA is unavailable.");
  return env.MEMBER_MEDIA;
}

export { schema };
