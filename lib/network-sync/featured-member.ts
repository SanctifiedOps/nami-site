import "server-only";

import { and, asc, eq, ne, sql } from "drizzle-orm";
import { getNetworkDb, schema } from "@/lib/network-db";
import { sendNetworkEmail } from "@/lib/network-auth/email";
import { getRuntimeEnvironment } from "@/lib/cloudflare-env";
import { revalidateNetworkProfile } from "@/lib/network-profile/revalidate";

const londonDate = () => new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/London",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());

export async function rotateFeaturedMember() {
  const db = await getNetworkDb();
  const today = londonDate();
  const [lastRun] = await db.select().from(schema.systemState)
    .where(eq(schema.systemState.key, "featured-member-date")).limit(1);
  if (lastRun?.value === today) return { changed: false, reason: "already-rotated" };

  const [chosen] = await db.select({
    memberId: schema.memberProfiles.memberId,
    displayName: schema.memberProfiles.displayName,
  }).from(schema.memberProfiles)
    .innerJoin(schema.members, eq(schema.members.id, schema.memberProfiles.memberId))
    .where(and(
      eq(schema.memberProfiles.published, true),
      eq(schema.members.approvalStatus, "approved"),
      ne(schema.members.accountStatus, "disabled"),
      ne(schema.members.role, "admin"),
    ))
    .orderBy(
      sql`case when ${schema.memberProfiles.lastFeaturedAt} is null then 0 else 1 end`,
      asc(schema.memberProfiles.lastFeaturedAt),
      sql`random()`,
    ).limit(1);

  if (!chosen) return { changed: false, reason: "no-published-members" };
  const now = new Date();
  await db.batch([
    db.update(schema.memberProfiles).set({ featured: false, updatedAt: now }),
    db.update(schema.memberProfiles).set({ featured: true, lastFeaturedAt: now, updatedAt: now })
      .where(eq(schema.memberProfiles.memberId, chosen.memberId)),
    db.insert(schema.systemState).values({ key: "featured-member-date", value: today, updatedAt: now })
      .onConflictDoUpdate({ target: schema.systemState.key, set: { value: today, updatedAt: now } }),
    db.insert(schema.sheetSyncJobs).values({
      id: crypto.randomUUID(), memberId: chosen.memberId, status: "pending", attempts: 0,
      nextAttemptAt: now, createdAt: now, updatedAt: now,
    }),
  ]);
  revalidateNetworkProfile(chosen.memberId);

  const env = await getRuntimeEnvironment();
  try {
    await sendNetworkEmail({
      memberId: chosen.memberId,
      recipient: env.OWNER_EMAIL || "hello@namicreative.co.uk",
      template: "profile-ready",
      subject: `This week's featured NAMI member: ${chosen.displayName}`,
      heading: `${chosen.displayName} is featured this week`,
      body: "The weekly directory rotation is complete. Their profile is now featured at the top of the NAMI Creative Network directory.",
      actionLabel: "View the directory",
      actionUrl: `${env.APP_URL || "https://namicreative.co.uk"}/network/directory`,
    });
  } catch {
    // sendNetworkEmail records a retryable failed job before throwing.
  }
  return { changed: true, memberId: chosen.memberId, displayName: chosen.displayName };
}
