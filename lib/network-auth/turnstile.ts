import { getRuntimeEnvironment } from "@/lib/cloudflare-env";

export async function verifyTurnstile(token: string | undefined, remoteIp?: string | null) {
  const env = await getRuntimeEnvironment();
  if (env.APP_ENV !== "production") return true;
  const secret = env.TURNSTILE_SECRET_KEY;
  if (!secret) return false;
  if (!token) return false;

  const body = new FormData();
  body.set("secret", secret);
  body.set("response", token);
  if (remoteIp) body.set("remoteip", remoteIp);

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body,
  });
  if (!response.ok) return false;
  const result = (await response.json()) as { success?: boolean };
  return result.success === true;
}
