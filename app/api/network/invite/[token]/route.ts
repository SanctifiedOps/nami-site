import { and, eq, gt, isNull } from "drizzle-orm";
import { hashPassword } from "better-auth/crypto";
import { z } from "zod";
import { getNetworkDb, schema } from "@/lib/network-db";
import { hashToken } from "@/lib/network-auth/tokens";
import { verifyTurnstile } from "@/lib/network-auth/turnstile";

const redeemSchema = z.object({
  password: z.string().min(10).max(128),
  turnstileToken: z.string().optional(),
});

async function inviteForToken(rawToken: string) {
  const db = await getNetworkDb();
  const tokenHash = await hashToken(rawToken);
  const [result] = await db
    .select({ invite: schema.memberInvites, member: schema.members, profile: schema.memberProfiles })
    .from(schema.memberInvites)
    .innerJoin(schema.members, eq(schema.memberInvites.memberId, schema.members.id))
    .innerJoin(schema.memberProfiles, eq(schema.memberProfiles.memberId, schema.members.id))
    .where(and(
      eq(schema.memberInvites.tokenHash, tokenHash),
      gt(schema.memberInvites.expiresAt, new Date()),
      isNull(schema.memberInvites.redeemedAt),
      isNull(schema.memberInvites.revokedAt),
      eq(schema.members.approvalStatus, "approved"),
    ))
    .limit(1);
  return { db, result };
}

export async function GET(_request: Request, context: { params: Promise<{ token: string }> }) {
  const { token } = await context.params;
  const { result } = await inviteForToken(token);
  if (!result) return Response.json({ valid: false }, { status: 404 });
  return Response.json({ valid: true, displayName: result.profile.displayName, email: result.member.email.replace(/(^.).+(@.*$)/, "$1••••$2") });
}

export async function POST(request: Request, context: { params: Promise<{ token: string }> }) {
  const { token } = await context.params;
  const parsed = redeemSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Choose a password with at least 10 characters." }, { status: 400 });

  const remoteIp = request.headers.get("CF-Connecting-IP");
  if (!(await verifyTurnstile(parsed.data.turnstileToken, remoteIp))) {
    return Response.json({ error: "Please complete the security check and try again." }, { status: 400 });
  }

  const { db, result } = await inviteForToken(token);
  if (!result) return Response.json({ error: "This invitation has expired or has already been used." }, { status: 410 });
  if (result.member.authUserId) return Response.json({ error: "This profile already has an account. Try signing in or reset the password." }, { status: 409 });

  const now = new Date();
  const userId = crypto.randomUUID();
  const credentialId = crypto.randomUUID();
  const password = await hashPassword(parsed.data.password);

  await db.batch([
    db.insert(schema.user).values({
      id: userId,
      name: result.profile.displayName,
      email: result.member.emailNormalized,
      emailVerified: true,
      image: result.profile.profileImageKey,
      createdAt: now,
      updatedAt: now,
    }),
    db.insert(schema.account).values({
      id: credentialId,
      accountId: userId,
      providerId: "credential",
      userId,
      password,
      createdAt: now,
      updatedAt: now,
    }),
    db.update(schema.members).set({ authUserId: userId, accountStatus: "active", updatedAt: now }).where(eq(schema.members.id, result.member.id)),
    db.update(schema.memberInvites).set({ redeemedAt: now }).where(eq(schema.memberInvites.id, result.invite.id)),
  ]);

  return Response.json({ ok: true, email: result.member.email });
}
