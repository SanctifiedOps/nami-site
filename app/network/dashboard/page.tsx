import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { requireMemberSession } from "@/lib/network-auth/session";
import { getNetworkDb, schema } from "@/lib/network-db";
import { DashboardForm } from "./dashboard-form";
import { normalizeInstagramProfileUrl, normalizeProfileUrl } from "@/lib/network-profile/links";
import { getRuntimeEnvironment } from "@/lib/cloudflare-env";

export const metadata: Metadata = { title: "Member dashboard", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function MemberDashboardPage() {
  const auth = await requireMemberSession();
  const env = await getRuntimeEnvironment();
  const db = await getNetworkDb();
  const [profile] = await db.select().from(schema.memberProfiles).where(eq(schema.memberProfiles.memberId, auth.member.id)).limit(1);
  if (!profile) throw new Error("Member profile not found.");
  const images = await db.select().from(schema.profileImages).where(eq(schema.profileImages.memberId, auth.member.id)).orderBy(schema.profileImages.position);
  const firstName = auth.member.firstName.trim()
    || auth.session.user.name?.trim().split(/\s+/)[0]
    || profile.displayName.trim().split(/[\s/]+/)[0]
    || "there";
  return <DashboardForm firstName={firstName} isAdmin={auth.member.role === "admin"} email={auth.member.email} eventsEnabled={env.NETWORK_EVENTS_MODE === "live"} initialProfile={{ memberId: profile.memberId, displayName: profile.displayName, location: profile.location, primaryGroup: profile.primaryGroup, speciality: profile.speciality, bio: profile.bio, websiteUrl: normalizeProfileUrl(profile.websiteUrl), instagramUrl: normalizeInstagramProfileUrl(profile.instagramUrl), facebookUrl: normalizeProfileUrl(profile.facebookUrl), linkedinUrl: normalizeProfileUrl(profile.linkedinUrl), tiktokUrl: normalizeProfileUrl(profile.tiktokUrl), youtubeUrl: normalizeProfileUrl(profile.youtubeUrl), profileImageKey: profile.profileImageKey ?? "" }} initialImages={images.map((image) => ({ id: image.id, r2Key: image.r2Key, position: image.position, altText: image.altText, width: image.width, height: image.height }))} />;
}
