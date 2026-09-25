import { and, desc, eq, isNull, ne } from "drizzle-orm";
import { z } from "zod";
import { sendNetworkEmail } from "@/lib/network-auth/email";
import { createInviteToken, hashToken } from "@/lib/network-auth/tokens";
import { getRuntimeEnvironment } from "@/lib/cloudflare-env";
import { getNetworkDb, schema } from "@/lib/network-db";

const input = z.object({ email: z.string().trim().email().max(254) });
const genericMessage = "If your email matches an unclaimed Network profile, you’ll receive a secure link shortly. Check your spam folder too.";

export async function POST(request: Request) {
  const parsed = input.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Enter a valid email address." }, { status: 400 });

  const db = await getNetworkDb();
  const email = parsed.data.email.toLowerCase();
  const [record] = await db.select({ member: schema.members, profile: schema.memberProfiles })
    .from(schema.members)
    .innerJoin(schema.memberProfiles, eq(schema.memberProfiles.memberId, schema.members.id))
    .where(and(
      eq(schema.members.emailNormalized, email),
      eq(schema.members.approvalStatus, "approved"),
      ne(schema.members.accountStatus, "disabled"),
      isNull(schema.members.authUserId),
    ))
    .limit(1);

  if (!record) return Response.json({ ok: true, message: genericMessage });

  const [recentInvite] = await db.select({ createdAt: schema.memberInvites.createdAt })
    .from(schema.memberInvites)
    .where(eq(schema.memberInvites.memberId, record.member.id))
    .orderBy(desc(schema.memberInvites.createdAt))
    .limit(1);
  if (recentInvite && Date.now() - recentInvite.createdAt.getTime() < 5 * 60 * 1000) {
    return Response.json({ ok: true, message: genericMessage });
  }

  const rawToken = createInviteToken();
  const tokenHash = await hashToken(rawToken);
  const now = new Date();
  await db.batch([
    db.update(schema.memberInvites).set({ revokedAt: now }).where(and(eq(schema.memberInvites.memberId, record.member.id), isNull(schema.memberInvites.redeemedAt))),
    db.insert(schema.memberInvites).values({ id: crypto.randomUUID(), memberId: record.member.id, tokenHash, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), createdAt: now }),
    db.update(schema.members).set({ accountStatus: "invited", invitedAt: now, updatedAt: now }).where(eq(schema.members.id, record.member.id)),
  ]);

  const env = await getRuntimeEnvironment();
  const appUrl = (env.APP_URL || "https://namicreative.co.uk").replace(/\/$/, "");
  try {
    await sendNetworkEmail({
      memberId: record.member.id,
      recipient: record.member.email,
      template: "profile-ready",
      subject: "Claim your NAMI Creative Network profile",
      heading: "Your Network profile is ready",
      body: `Hi ${record.member.firstName || "there"}. Create your password to claim your profile and keep your details, links and work up to date.`,
      actionLabel: "Claim my profile",
      actionUrl: `${appUrl}/network/invite/${rawToken}`,
    });
  } catch {
    // Keep the public response neutral. Delivery failures remain visible in the admin job queue.
  }

  return Response.json({ ok: true, message: genericMessage });
}
