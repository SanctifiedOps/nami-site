interface Env {
  MAKE_WEBHOOK_URL: string;
  TRIGGER_SECRET: string;
  TIMEZONE: string;
  RECIPIENT: string;
  TEST_MODE: string;
}

type TriggerSource = "cron" | "manual";

function localParts(date: Date, timeZone: string): Record<string, string> {
  return Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(date)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );
}

export function isNineAmInLondon(date: Date, timeZone = "Europe/London"): boolean {
  const parts = localParts(date, timeZone);
  return parts.hour === "09" && parts.minute === "00";
}

function localDateKey(date: Date, timeZone: string): string {
  const parts = localParts(date, timeZone);
  return `${parts.year}-${parts.month}-${parts.day}`;
}

async function sameSecret(provided: string, expected: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const [providedHash, expectedHash] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(provided)),
    crypto.subtle.digest("SHA-256", encoder.encode(expected)),
  ]);
  const a = new Uint8Array(providedHash);
  const b = new Uint8Array(expectedHash);
  let mismatch = a.length ^ b.length;
  for (let index = 0; index < Math.min(a.length, b.length); index += 1) mismatch |= a[index] ^ b[index];
  return mismatch === 0;
}

async function triggerBriefing(env: Env, now: Date, source: TriggerSource): Promise<Response> {
  const runDate = localDateKey(now, env.TIMEZONE);
  const response = await fetch(env.MAKE_WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.TRIGGER_SECRET}`,
      "Content-Type": "application/json",
      "User-Agent": "nami-post-ideas-trigger/1.0",
    },
    body: JSON.stringify({
      runId: `nami-post-ideas-${runDate}`,
      runDate,
      requestedAt: now.toISOString(),
      source,
      timezone: env.TIMEZONE,
      recipient: env.RECIPIENT,
      testMode: env.TEST_MODE.toLowerCase() === "true",
    }),
  });

  if (!response.ok) {
    const detail = (await response.text()).slice(0, 500);
    throw new Error(`Make webhook failed with ${response.status}: ${detail}`);
  }

  console.log(JSON.stringify({ event: "briefing_triggered", runDate, source, status: response.status }));
  return response;
}

export default {
  async scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
    const scheduledAt = new Date(controller.scheduledTime);
    if (!isNineAmInLondon(scheduledAt, env.TIMEZONE)) {
      console.log(JSON.stringify({ event: "cron_skipped", scheduledAt: scheduledAt.toISOString() }));
      return;
    }
    ctx.waitUntil(triggerBriefing(env, scheduledAt, "cron"));
  },

  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (request.method === "GET" && url.pathname === "/health") {
      return Response.json({ ok: true, service: "nami-post-ideas-trigger", testMode: env.TEST_MODE === "true" });
    }
    if (request.method === "POST" && url.pathname === "/run") {
      const provided = request.headers.get("Authorization")?.replace(/^Bearer\s+/i, "") ?? "";
      if (!(await sameSecret(provided, env.TRIGGER_SECRET))) return new Response("Unauthorized", { status: 401 });
      const upstream = await triggerBriefing(env, new Date(), "manual");
      return Response.json({ ok: true, upstreamStatus: upstream.status }, { status: 202 });
    }
    return new Response("Not found", { status: 404 });
  },
};
