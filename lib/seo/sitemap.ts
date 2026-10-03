import { services } from "@/lib/content/services";
import { work } from "@/lib/content/work";
import { offers } from "@/lib/content/offers";
import { networkDirectoryMembers } from "@/lib/content/network-directory";
import { directoryGroups } from "@/lib/content/network-directory-groups";
import { getNetworkDirectoryMembers } from "@/lib/content/network-directory-live";

export const SITE_URL = "https://namicreative.co.uk";
export const SITEMAP_LAST_MODIFIED = "2026-10-03T00:00:00.000Z";

type SitemapEntry = {
  url: string;
  lastModified: string;
  changeFrequency: "weekly" | "monthly" | "yearly";
  priority: number;
  image?: string;
};

const xmlEscape = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

const validDate = (value: string | undefined, fallback: string) =>
  value && !Number.isNaN(Date.parse(value)) ? new Date(value).toISOString() : fallback;

export function sitemapResponse(xml: string, maxAge: number) {
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": `public, max-age=${maxAge}, stale-while-revalidate=86400`,
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export function sitemapIndexXml() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${SITE_URL}/sitemap-core.xml</loc>
    <lastmod>${SITEMAP_LAST_MODIFIED}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_URL}/sitemap-members.xml</loc>
    <lastmod>${SITEMAP_LAST_MODIFIED}</lastmod>
  </sitemap>
</sitemapindex>`;
}

export function coreSitemapXml() {
  const entries: SitemapEntry[] = [
    { url: `${SITE_URL}/`, lastModified: "2026-09-19T00:00:00.000Z", changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/network`, lastModified: "2026-09-19T00:00:00.000Z", changeFrequency: "weekly", priority: 0.95 },
    { url: `${SITE_URL}/network/directory`, lastModified: "2026-09-03T00:00:00.000Z", changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/network/directory/all`, lastModified: "2026-09-18T00:00:00.000Z", changeFrequency: "weekly", priority: 0.65 },
    { url: `${SITE_URL}/services`, lastModified: "2026-09-19T00:00:00.000Z", changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/work`, lastModified: "2026-09-19T00:00:00.000Z", changeFrequency: "monthly", priority: 0.85 },
    { url: `${SITE_URL}/about`, lastModified: "2026-09-19T00:00:00.000Z", changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/contact`, lastModified: "2026-09-19T00:00:00.000Z", changeFrequency: "yearly", priority: 0.75 },
    { url: `${SITE_URL}/process`, lastModified: "2026-09-19T00:00:00.000Z", changeFrequency: "monthly", priority: 0.65 },
    { url: `${SITE_URL}/pricing`, lastModified: "2026-09-19T00:00:00.000Z", changeFrequency: "monthly", priority: 0.65 },
    { url: `${SITE_URL}/privacy`, lastModified: "2026-09-19T00:00:00.000Z", changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified: "2026-09-19T00:00:00.000Z", changeFrequency: "yearly", priority: 0.3 },
    ...services.map((item) => ({
      url: `${SITE_URL}/services/${item.slug}`,
      lastModified: "2026-09-19T00:00:00.000Z",
      changeFrequency: "monthly" as const,
      priority: 0.72,
    })),
    ...work.map((item) => ({
      url: `${SITE_URL}/work/${item.slug}`,
      lastModified: "2026-09-19T00:00:00.000Z",
      changeFrequency: "monthly" as const,
      priority: 0.78,
    })),
    ...offers.map((item) => ({
      url: `${SITE_URL}/offers/${item.slug}`,
      lastModified: "2026-09-19T00:00:00.000Z",
      changeFrequency: "monthly" as const,
      priority: 0.65,
    })),
    ...directoryGroups.map((item) => ({
      url: `${SITE_URL}/network/directory/${item.slug}`,
      lastModified: "2026-09-18T00:00:00.000Z",
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];

  return urlsetXml(entries);
}

export async function memberSitemapXml() {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  let members = networkDirectoryMembers;

  try {
    members = await Promise.race([
      getNetworkDirectoryMembers(),
      new Promise<typeof networkDirectoryMembers>((resolve) => {
        timeout = setTimeout(() => resolve(networkDirectoryMembers), 3000);
      }),
    ]);
  } catch {
    members = networkDirectoryMembers;
  } finally {
    if (timeout) clearTimeout(timeout);
  }

  return urlsetXml(
    members.map((member) => ({
      url: `${SITE_URL}/network/directory/member/${member.id}`,
      lastModified: validDate(member.updatedAt ?? member.joinedAt, "2026-09-19T00:00:00.000Z"),
      changeFrequency: "monthly" as const,
      priority: 0.68,
      image: member.profileImage
        ? member.profileImage.startsWith("http")
          ? member.profileImage
          : `${SITE_URL}${member.profileImage}`
        : undefined,
    })),
  );
}

function urlsetXml(entries: SitemapEntry[]) {
  const includesImages = entries.some((entry) => entry.image);
  const namespace = includesImages
    ? ' xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"'
    : ' xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"';
  const urls = entries
    .map(
      (entry) => `  <url>
    <loc>${xmlEscape(entry.url)}</loc>
    <lastmod>${entry.lastModified}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority}</priority>${
      entry.image
        ? `\n    <image:image><image:loc>${xmlEscape(entry.image)}</image:loc></image:image>`
        : ""
    }
  </url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset${namespace}>\n${urls}\n</urlset>`;
}
