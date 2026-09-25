import { and, eq } from "drizzle-orm";
import { getNetworkDb, schema } from "@/lib/network-db";

const escapeIcs = (value: string) => value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
const stamp = (date: Date) => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await getNetworkDb();
  const [event] = await db.select().from(schema.networkEvents).where(and(eq(schema.networkEvents.id, id), eq(schema.networkEvents.status, "approved"))).limit(1);
  if (!event) return new Response("Not found", { status: 404 });

  const location = [event.venue, event.address, event.location, event.region].filter(Boolean).join(", ");
  const body = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//NAMI Creative//Network Events//EN", "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT", `UID:${event.id}@namicreative.co.uk`, `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(event.startsAt)}`, `DTEND:${stamp(event.endsAt || event.startsAt)}`,
    `SUMMARY:${escapeIcs(event.title)}`, `DESCRIPTION:${escapeIcs(event.fullDescription || event.summary)}`,
    `LOCATION:${escapeIcs(location)}`, event.bookingUrl ? `URL:${escapeIcs(event.bookingUrl)}` : "",
    "END:VEVENT", "END:VCALENDAR",
  ].filter(Boolean).join("\r\n");

  return new Response(body, { headers: { "Content-Type": "text/calendar; charset=utf-8", "Content-Disposition": `attachment; filename="${event.slug}.ics"`, "Cache-Control": "public, max-age=300" } });
}
