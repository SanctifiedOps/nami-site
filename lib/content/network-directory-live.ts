import {
  networkDirectoryMembers,
  type NetworkDirectoryMember,
} from "@/lib/content/network-directory";
import { normalizeExternalUrl } from "@/lib/external-url";

type DirectoryFeedMember = Partial<NetworkDirectoryMember> & {
  imageStatus?: string;
};

function clean(value: unknown, max = 500) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function instagramUrl(value: string) {
  const trimmed = value.trim();
  const candidate = /[\s,]/.test(trimmed)
    ? trimmed.split(/[\s,]+/).find((part) =>
        part.startsWith("@") || /^https?:\/\/(www\.)?instagram\.com\//i.test(part),
      ) ?? ""
    : trimmed;
  const handle = candidate
    .replace(/^https?:\/\/(www\.)?instagram\.com\//i, "")
    .replace(/^@/, "")
    .split(/[/?#]/)[0];

  // A display name such as "Axe & Grain Bespoke Works" is not an Instagram
  // handle. Multiple submitted @handles remain supported by using the first.
  return /^[a-z0-9._]+$/i.test(handle)
    ? `https://www.instagram.com/${handle}/`
    : "";
}

function profileImageUrl(value: string) {
  const trimmed = clean(value, 500);
  if (!trimmed) return "";
  const driveId = trimmed.match(/[?&]id=([a-zA-Z0-9_-]{10,100})/)?.[1]
    ?? trimmed.match(/\/d\/([a-zA-Z0-9_-]{10,100})/)?.[1];
  return driveId ? `/api/network/profile-image/${driveId}` : trimmed;
}

function validMember(value: unknown): NetworkDirectoryMember | null {
  if (!value || typeof value !== "object") return null;
  const wrapped = value as { properties?: unknown };
  const source =
    wrapped.properties && typeof wrapped.properties === "object"
      ? wrapped.properties
      : value;
  const item = source as DirectoryFeedMember;
  const id = clean(item.id, 160);
  const name = clean(item.name, 120);
  const category = clean(item.category, 80);
  const location = clean(item.location, 140);
  const instagram = clean(item.instagram, 120);
  const description = clean(item.description, 800);
  if (!id || !name || !category || !location || !description) return null;

  const profileImage =
    clean(item.imageStatus, 40).toLowerCase() === "ready"
      ? profileImageUrl(item.profileImage ?? "")
      : "";

  return {
    id,
    name,
    category,
    location,
    instagram,
    instagramUrl: instagramUrl(instagram),
    websiteUrl: normalizeExternalUrl(clean(item.websiteUrl, 500)),
    description,
    profileImage: profileImage || undefined,
    imageAlt: clean(item.imageAlt, 200) || `${name} profile picture`,
    featured: false,
  };
}

export async function getNetworkDirectoryMembers() {
  const url = process.env.DIRECTORY_FEED_WEBHOOK_URL;
  const fallbackMembers = networkDirectoryMembers.map((member) => ({
    ...member,
    websiteUrl: normalizeExternalUrl(member.websiteUrl),
  }));
  if (!url) return fallbackMembers;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
      next: { revalidate: 60 },
    });
    if (!response.ok) return fallbackMembers;

    const text = await response.text();
    const data = JSON.parse(text) as unknown;
    if (!Array.isArray(data)) return fallbackMembers;

    const liveMembers = data
      .map(validMember)
      .filter((member): member is NetworkDirectoryMember => Boolean(member));
    const members = new Map(
      fallbackMembers.map((member) => [member.id, member]),
    );
    for (const member of liveMembers) {
      const existing = members.get(member.id);
      members.set(member.id, {
        ...existing,
        ...member,
        profileImage: member.profileImage ?? existing?.profileImage,
        imageAlt: member.imageAlt ?? existing?.imageAlt,
        featured: existing?.featured ?? member.featured,
      });
    }
    return [...members.values()];
  } catch {
    return fallbackMembers;
  }
}
