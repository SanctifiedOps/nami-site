import { and, eq, gt, isNull } from "drizzle-orm";
import { z } from "zod";
import { getNetworkAdminSession } from "@/lib/network-auth/session";
import { issueMemberInvite, MEMBER_INVITE_DAYS } from "@/lib/network-auth/member-invitations";
import { getNetworkDb, schema } from "@/lib/network-db";

export const dynamic = "force-dynamic";
const sendSchema = z.object({ memberId: z.string().min(2), confirmation: z.literal("SEND INVITE") });

async function invitationPreview() {
  const db = await getNetworkDb();
  const now = new Date();
  const [rows, outstanding] = await Promise.all([
    db.select({ member: schema.members, profile: schema.memberProfiles }).from(schema.members)
      .leftJoin(schema.memberProfiles, eq(schema.memberProfiles.memberId, schema.members.id)),
    db.select({ memberId: schema.memberInvites.memberId }).from(schema.memberInvites)
      .where(and(isNull(schema.memberInvites.redeemedAt), isNull(schema.memberInvites.revokedAt), gt(schema.memberInvites.expiresAt, now))),
  ]);

  const outstandingIds = new Set(outstanding.map((item) => item.memberId));
  const accountEmails = new Set(rows.filter(({ member }) => Boolean(member.authUserId)).map(({ member }) => member.emailNormalized));
  const seenEmails = new Set<string>();
  const eligible = rows.filter(({ member, profile }) => {
    if (member.accountStatus !== "unclaimed" || member.authUserId || !profile?.published || outstandingIds.has(member.id)) return false;
    const email = member.emailNormalized.trim();
    if (!email || accountEmails.has(email) || seenEmails.has(email)) return false;
    seenEmails.add(email);
    return true;
  }).sort((a, b) => (a.profile?.displayName || a.member.firstName).localeCompare(b.profile?.displayName || b.member.firstName, "en-GB"));

  return {
    eligible: eligible.length,
    active: rows.filter(({ member }) => member.accountStatus === "active").length,
    invited: rows.filter(({ member }) => member.accountStatus === "invited").length,
    disabled: rows.filter(({ member }) => member.accountStatus === "disabled").length,
    outstanding: outstandingIds.size,
    inviteDays: MEMBER_INVITE_DAYS,
    batch: eligible.slice(0, 20).map(({ member, profile }) => ({
      id: member.id,
      name: profile?.displayName || member.firstName || member.email,
      email: member.email,
    })),
  };
}

export async function GET() {
  if (!(await getNetworkAdminSession())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  return Response.json(await invitationPreview(), { headers: { "Cache-Control": "private, no-store" } });
}

export async function POST(request: Request) {
  if (!(await getNetworkAdminSession())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = sendSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Confirm this invitation before sending." }, { status: 400 });

  const preview = await invitationPreview();
  if (!preview.batch.some((member) => member.id === parsed.data.memberId)) {
    return Response.json({ error: "This member is no longer eligible for this batch." }, { status: 409 });
  }

  try {
    return Response.json({ ok: true, invite: await issueMemberInvite(parsed.data.memberId) });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "The invitation could not be sent." }, { status: 500 });
  }
}
