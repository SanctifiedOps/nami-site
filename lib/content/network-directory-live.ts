import {
  networkDirectoryMembers,
  type NetworkDirectoryMember,
} from "@/lib/content/network-directory";

type DirectoryFeedMember = Partial<NetworkDirectoryMember> & {
  imageStatus?: string;
};

function clean(value: unknown, max = 500) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function instagramUrl(value: string) {
  const first = value.split(/[\s,]+/).find(Boolean) ?? "";
  const handle = first
    .replace(/^https?:\/\/(www\.)?instagram\.com\//i, "")
    .replace(/^@/, "")
    .split(/[/?#]/)[0];
  return handle ? `https://www.instagram.com/${handle}/` : "";
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
      ? clean(item.profileImage, 500)
      : "";

  return {
    id,
    name,
    category,
    location,
    instagram,
    instagramUrl: instagramUrl(instagram),
    websiteUrl: clean(item.websiteUrl, 500),
    description,
    profileImage: profileImage || undefined,
    imageAlt: clean(item.imageAlt, 200) || `${name} profile picture`,
    featured: false,
  };
}

export async function getNetworkDirectoryMembers() {
  const url = process.env.DIRECTORY_FEED_WEBHOOK_URL;
  if (!url) return networkDirectoryMembers;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
      next: { revalidate: 60 },
    });
    if (!response.ok) return networkDirectoryMembers;

    const text = await response.text();
    const data = JSON.parse(text) as unknown;
    if (!Array.isArray(data)) return networkDirectoryMembers;

    const liveMembers = data
      .map(validMember)
      .filter((member): member is NetworkDirectoryMember => Boolean(member));
    const members = new Map(
      networkDirectoryMembers.map((member) => [member.id, member]),
    );
    for (const member of liveMembers) {
      const existing = members.get(member.id);
      members.set(member.id, {
        ...existing,
        ...member,
        profileImage: member.profileImage ?? existing?.profileImage,
        imageAlt: member.imageAlt ?? existing?.imageAlt,
      });
    }
    return [...members.values()];
  } catch {
    return networkDirectoryMembers;
  }
}
