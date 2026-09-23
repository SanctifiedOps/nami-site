import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { isNetworkAdminRequest } from "@/lib/network-auth/admin";
import { getNetworkDb, schema } from "@/lib/network-db";

const actionSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("ticket-status"), ticketId: z.string().min(3), status: z.enum(["open", "in_progress", "resolved"]) }),
  z.object({ action: z.literal("event-status"), eventId: z.string().uuid(), status: z.enum(["approved", "rejected"]) }),
]);

export async function GET(request: Request) {
  if (!(await isNetworkAdminRequest(request))) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const db = await getNetworkDb();
  const [tickets, events, alerts] = await Promise.all([
    db.select().from(schema.supportTickets).orderBy(desc(schema.supportTickets.createdAt)),
    db.select().from(schema.networkEvents).orderBy(desc(schema.networkEvents.submittedAt)),
    db.select().from(schema.ownerAlertJobs).orderBy(desc(schema.ownerAlertJobs.createdAt)).limit(100),
  ]);
  return Response.json({ tickets, events, alerts });
}

export async function POST(request: Request) {
  if (!(await isNetworkAdminRequest(request))) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = actionSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Invalid operations action." }, { status: 400 });
  const db = await getNetworkDb();
  const now = new Date();
  if (parsed.data.action === "ticket-status") {
    await db.update(schema.supportTickets).set({
      status: parsed.data.status,
      resolvedAt: parsed.data.status === "resolved" ? now : null,
      updatedAt: now,
    }).where(eq(schema.supportTickets.id, parsed.data.ticketId));
  } else {
    await db.update(schema.networkEvents).set({
      status: parsed.data.status,
      reviewedAt: now,
      publishedAt: parsed.data.status === "approved" ? now : null,
      updatedAt: now,
    }).where(eq(schema.networkEvents.id, parsed.data.eventId));
  }
  return Response.json({ ok: true });
}
