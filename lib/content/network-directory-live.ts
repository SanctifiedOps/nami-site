import {
  networkDirectoryMembers,
  type NetworkDirectoryMember,
} from "@/lib/content/network-directory";
import { normalizeExternalUrl } from "@/lib/external-url";
import { normalizeInstagramProfileUrl, normalizeProfileUrl } from "@/lib/network-profile/links";

async function d1Members(): Promise<NetworkDirectoryMember[] | null> {
  try {
    const [{ getNetworkDb, schema }, { and, eq }] = await Promise.all([
      import("@/lib/network-db"),
      import("drizzle-orm"),
    ]);
    const db = await getNetworkDb();
    const rows = await db
      .select({ member: schema.members, profile: schema.memberProfiles })
      .from(schema.memberProfiles)
      .innerJoin(schema.members, eq(schema.members.id, schema.memberProfiles.memberId))
      .where(and(eq(schema.memberProfiles.published, true), eq(schema.members.approvalStatus, "approved")));
    if (!rows.length) return null;
    const images = await db
      .select()
      .from(schema.profileImages)
      .where(eq(schema.profileImages.status, "ready"))
      .orderBy(schema.profileImages.memberId, schema.profileImages.position);
    const imagesByMember = new Map<string, Array<{ src: string; alt: string; title: string; description: string; linkUrl?: string }>>();
    for (const image of images) {
      const current = imagesByMember.get(image.memberId) ?? [];
      current.push({
        src: `/api/network/media/${image.r2Key.split("/").map(encodeURIComponent).join("/")}`,
        alt: image.altText,
        title: image.title,
        description: image.description,
        linkUrl: normalizeProfileUrl(image.linkUrl) || undefined,
      });
      imagesByMember.set(image.memberId, current);
    }
    return rows.map(({ member, profile }) => ({
      id: member.id,
      name: profile.displayName,
      category: profile.speciality,
      location: profile.location,
      instagram: profile.instagramUrl ?? "",
      instagramUrl: normalizeInstagramProfileUrl(profile.instagramUrl),
      websiteUrl: normalizeProfileUrl(profile.websiteUrl),
      facebookUrl: normalizeProfileUrl(profile.facebookUrl),
      linkedinUrl: normalizeProfileUrl(profile.linkedinUrl),
      tiktokUrl: normalizeProfileUrl(profile.tiktokUrl),
      youtubeUrl: normalizeProfileUrl(profile.youtubeUrl),
      description: profile.bio,
      about: profile.about || profile.bio,
      profileImage: profile.profileImageKey
        ? `/api/network/media/${profile.profileImageKey.split("/").map(encodeURIComponent).join("/")}`
        : undefined,
      imageAlt: `${profile.displayName} profile picture`,
      featured: profile.featured,
      joinedAt: member.joinedAt.toISOString(),
      primaryGroup: profile.primaryGroup,
      portfolioImages: imagesByMember.get(member.id) ?? [],
    }));
  } catch {
    return null;
  }
}

export async function getNetworkDirectoryMembers() {
  const fallbackMembers = networkDirectoryMembers.map((member) => ({
    ...member,
    websiteUrl: normalizeExternalUrl(member.websiteUrl),
  }));
  const databaseMembers = await d1Members();
  if (databaseMembers) {
    const merged = new Map(fallbackMembers.map((member) => [member.id, member]));
    for (const member of databaseMembers) {
      const existing = merged.get(member.id);
      merged.set(member.id, {
        ...existing,
        ...member,
        profileImage: member.profileImage ?? existing?.profileImage,
        imageAlt: member.imageAlt ?? existing?.imageAlt,
      });
    }
    return [...merged.values()];
  }
  return fallbackMembers;
}
