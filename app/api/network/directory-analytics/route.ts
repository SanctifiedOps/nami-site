import { z } from "zod";
import { getNetworkDb, schema } from "@/lib/network-db";

const eventSchema = z.object({
  eventType: z.enum(["search", "result_clicked"]),
  anonymousSessionId: z.string().uuid(),
  searchQuery: z.string().max(80).default(""),
  categoryFilter: z.string().max(100).default("All categories"),
  locationFilter: z.string().max(100).default("All areas"),
  resultCount: z.number().int().min(0).max(10000).default(0),
  selectedMemberId: z.string().max(160).nullable().optional(),
  sourcePath: z.string().max(200).default("/network/directory"),
});

function sanitiseSearch(value: string) {
  return value
    .toLowerCase()
    .replace(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/gi, "[removed]")
    .replace(/(?:\+?44|0)\s*\d(?:[\s()-]*\d){8,}/g, "[removed]")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
}

async function digest(value: string) {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function POST(request: Request) {
  const parsed = eventSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Invalid analytics event." }, { status: 400 });

  const event = parsed.data;
  const searchQuery = sanitiseSearch(event.searchQuery);
  const fiveMinuteBucket = Math.floor(Date.now() / 300000);
  const dedupeKey = await digest([event.anonymousSessionId, event.eventType, searchQuery, event.categoryFilter, event.locationFilter, event.selectedMemberId ?? "", fiveMinuteBucket].join("|"));
  const db = await getNetworkDb();
  await db.insert(schema.directorySearchEvents).values({
    id: crypto.randomUUID(),
    eventType: event.eventType,
    anonymousSessionId: event.anonymousSessionId,
    searchQuery,
    categoryFilter: event.categoryFilter,
    locationFilter: event.locationFilter,
    resultCount: event.resultCount,
    selectedMemberId: event.selectedMemberId ?? null,
    sourcePath: event.sourcePath.startsWith("/network/") ? event.sourcePath : "/network/directory",
    dedupeKey,
    createdAt: new Date(),
  }).onConflictDoNothing();

  return Response.json({ ok: true }, { status: 202 });
}
