import "server-only";

import { getCloudflareContext } from "@opennextjs/cloudflare";

type RuntimeEnvironment = Record<string, string | undefined>;

export async function getRuntimeEnvironment(): Promise<RuntimeEnvironment> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    return { ...process.env, ...(env as unknown as RuntimeEnvironment) };
  } catch {
    return process.env;
  }
}
