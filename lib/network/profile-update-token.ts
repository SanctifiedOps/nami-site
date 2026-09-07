import { createHmac, timingSafeEqual } from "node:crypto";

const VERSION = "v1";

function secret() {
  const value = process.env.NETWORK_PROFILE_UPDATE_SECRET || process.env.MAKE_API_TOKEN;
  if (!value) throw new Error("A profile update signing secret is not configured.");
  return value;
}

function signature(memberId: string) {
  return createHmac("sha256", secret())
    .update(`${VERSION}:${memberId}`)
    .digest("base64url");
}

export function createProfileUpdateToken(memberId: string) {
  return `${VERSION}.${Buffer.from(memberId).toString("base64url")}.${signature(memberId)}`;
}

export function readProfileUpdateToken(token: string | undefined) {
  if (!token) return null;
  const [version, encodedId, suppliedSignature, ...rest] = token.split(".");
  if (version !== VERSION || !encodedId || !suppliedSignature || rest.length) return null;

  let memberId: string;
  try {
    memberId = Buffer.from(encodedId, "base64url").toString("utf8");
  } catch {
    return null;
  }

  if (!/^[a-z0-9][a-z0-9-]{0,159}$/.test(memberId)) return null;
  const expected = Buffer.from(signature(memberId));
  const supplied = Buffer.from(suppliedSignature);
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return null;
  return memberId;
}
