import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { getNetworkAuth } from "@/lib/network-auth/auth";
import { getNetworkDb, schema } from "@/lib/network-db";

export async function POST() {
  if (process.env.NODE_ENV !== "development") {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const auth = await getNetworkAuth();
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return Response.json({ error: "Local sign-in failed." }, { status: 401 });

  const db = await getNetworkDb();
  const [existing] = await db.select().from(schema.members).where(eq(schema.members.authUserId, session.user.id)).limit(1);
  if (existing) return Response.json({ ok: true });

  const memberId = "joe-wilson-nami-creative";
  const [memberWithId] = await db.select().from(schema.members).where(eq(schema.members.id, memberId)).limit(1);
  const now = new Date();

  if (memberWithId) {
    await db.update(schema.members).set({ authUserId: session.user.id, accountStatus: "active", approvalStatus: "approved", role: "admin", updatedAt: now }).where(eq(schema.members.id, memberId));
  } else {
    await db.insert(schema.members).values({ id: memberId, firstName: "Joe", email: session.user.email, emailNormalized: session.user.email.toLowerCase(), authUserId: session.user.id, accountStatus: "active", approvalStatus: "approved", role: "admin", joinedAt: now, createdAt: now, updatedAt: now });
    await db.insert(schema.memberProfiles).values({ memberId, displayName: "Joe Wilson / NAMI Creative", location: "Newcastle upon Tyne", primaryGroup: "creative-services", speciality: "Creative consultant", bio: "A freelance creative consultant helping North East creatives, brands and businesses make waves, get their work seen and create a stronger impact.", about: "", websiteUrl: "https://namicreative.co.uk", instagramUrl: "https://www.instagram.com/namicreativeuk/", profileImageKey: null, published: true, updatedAt: now });
  }

  return Response.json({ ok: true });
}
