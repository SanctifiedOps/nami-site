import { z } from "zod";
import { getMemberSession } from "@/lib/network-auth/session";
import { verifyTurnstile } from "@/lib/network-auth/turnstile";
import { getNetworkDb, schema } from "@/lib/network-db";
import { queueOwnerAlert } from "@/lib/network-ops/owner-alerts";
import { getRuntimeEnvironment } from "@/lib/cloudflare-env";

const ticketSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(200),
  subject: z.string().trim().min(3).max(140),
  description: z.string().trim().min(20).max(3000),
  pageUrl: z.string().trim().url().max(500).optional().or(z.literal("")),
  priority: z.enum(["normal", "urgent"]).default("normal"),
  turnstileToken: z.string().optional(),
  website: z.string().optional(),
});

export async function POST(request: Request) {
  const parsed = ticketSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Check the ticket details and try again." }, { status: 400 });
  if (parsed.data.website?.trim()) return Response.json({ ok: true });

  const remoteIp = request.headers.get("cf-connecting-ip");
  if (!(await verifyTurnstile(parsed.data.turnstileToken, remoteIp))) {
    return Response.json({ error: "Please complete the security check and try again." }, { status: 400 });
  }

  const auth = await getMemberSession();
  const db = await getNetworkDb();
  const id = `NAMI-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  const now = new Date();
  await db.insert(schema.supportTickets).values({
    id,
    memberId: auth?.member.id,
    name: parsed.data.name,
    email: parsed.data.email.toLowerCase(),
    subject: parsed.data.subject,
    description: parsed.data.description,
    pageUrl: parsed.data.pageUrl || null,
    status: "open",
    priority: parsed.data.priority,
    createdAt: now,
    updatedAt: now,
  });

  const env = await getRuntimeEnvironment();
  const appUrl = env.APP_URL || "https://namicreative.co.uk";
  try {
    await queueOwnerAlert({
      kind: "ticket",
      recordId: id,
      subject: `NAMI support ticket: ${parsed.data.subject}`,
      heading: "A new support ticket needs checking",
      body: `${parsed.data.name} reported: ${parsed.data.subject}`,
      actionUrl: `${appUrl.replace(/\/$/, "")}/network/admin#tickets`,
    });
  } catch (error) {
    console.error("Ticket saved but owner alert failed:", error);
  }

  return Response.json({ ok: true, ticketId: id });
}
