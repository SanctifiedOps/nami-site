import { and, asc, eq, gte } from "drizzle-orm";
import { z } from "zod";
import { getRuntimeEnvironment } from "@/lib/cloudflare-env";
import { normalizeExternalUrl } from "@/lib/external-url";
import { getMemberSession } from "@/lib/network-auth/session";
import { getNetworkDb, schema } from "@/lib/network-db";
import { queueOwnerAlert } from "@/lib/network-ops/owner-alerts";

const eventSchema = z.object({
  title: z.string().trim().min(3).max(140),
  summary: z.string().trim().min(20).max(1200),
  venue: z.string().trim().min(2).max(140),
  location: z.string().trim().min(2).max(140),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime().optional().or(z.literal("")),
  bookingUrl: z.string().trim().max(500).optional().or(z.literal("")),
});

export async function GET() {
  const env = await getRuntimeEnvironment();
  if (env.NETWORK_EVENTS_MODE !== "live") return Response.json({ error: "Not found" }, { status: 404 });
  const db = await getNetworkDb();
  const events = await db.select().from(schema.networkEvents)
    .where(and(eq(schema.networkEvents.status, "approved"), gte(schema.networkEvents.startsAt, new Date())))
    .orderBy(asc(schema.networkEvents.startsAt));
  return Response.json({ events });
}

export async function POST(request: Request) {
  const env = await getRuntimeEnvironment();
  if (env.NETWORK_EVENTS_MODE !== "live") return Response.json({ error: "Event submissions are not open yet." }, { status: 503 });
  const auth = await getMemberSession();
  if (!auth) return Response.json({ error: "Sign in before submitting an event." }, { status: 401 });
  const parsed = eventSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Check the event details and try again." }, { status: 400 });
  const startsAt = new Date(parsed.data.startsAt);
  const endsAt = parsed.data.endsAt ? new Date(parsed.data.endsAt) : null;
  if (startsAt.getTime() < Date.now() - 60_000) return Response.json({ error: "Choose a future date for the event." }, { status: 400 });
  if (endsAt && endsAt <= startsAt) return Response.json({ error: "The finish time must be after the start time." }, { status: 400 });

  const id = crypto.randomUUID();
  const now = new Date();
  const db = await getNetworkDb();
  await db.insert(schema.networkEvents).values({
    id,
    memberId: auth.member.id,
    title: parsed.data.title,
    summary: parsed.data.summary,
    venue: parsed.data.venue,
    location: parsed.data.location,
    startsAt,
    endsAt,
    bookingUrl: normalizeExternalUrl(parsed.data.bookingUrl || "") || null,
    status: "pending",
    submittedAt: now,
    updatedAt: now,
  });

  const appUrl = env.APP_URL || "https://namicreative.co.uk";
  try {
    await queueOwnerAlert({
      kind: "event",
      recordId: id,
      subject: `NAMI event submission: ${parsed.data.title}`,
      heading: "A Network event is waiting for approval",
      body: `${parsed.data.title} at ${parsed.data.venue}, submitted by ${auth.member.firstName || auth.member.email}.`,
      actionUrl: `${appUrl.replace(/\/$/, "")}/network/admin#events`,
    });
  } catch (error) {
    console.error("Event saved but owner alert failed:", error);
  }
  return Response.json({ ok: true, eventId: id });
}
