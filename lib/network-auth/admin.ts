import "server-only";

import { constantTimeEqual } from "better-auth/crypto";
import { getRuntimeEnvironment } from "@/lib/cloudflare-env";

function bytes(value: string) { return new TextEncoder().encode(value); }

export async function isNetworkAdminRequest(request: Request) {
  const env = await getRuntimeEnvironment();
  const expected = env.NETWORK_ADMIN_SECRET;
  const supplied = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!expected || !supplied) return false;
  const left = bytes(expected); const right = bytes(supplied);
  if (left.byteLength !== right.byteLength) return false;
  return constantTimeEqual(left, right);
}
