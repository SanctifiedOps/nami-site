import type { MetadataRoute } from "next";
import { services } from "@/lib/content/services";
import { work } from "@/lib/content/work";
import { offers } from "@/lib/content/offers";
import { directoryGroups } from "@/lib/content/network-directory-groups";
import { getNetworkDirectoryMembers } from "@/lib/content/network-directory-live";

const SITE = "https://namicreative.co.uk";
const LAST_SEO_UPDATE = new Date("2026-09-19");
const HOMEPAGE_SEO_UPDATE = new Date("2026-09-19");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const directoryMembers = await getNetworkDirectoryMembers();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, lastModified: HOMEPAGE_SEO_UPDATE, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE}/network`, lastModified: LAST_SEO_UPDATE, changeFrequency: "weekly", priority: 0.95 },
    { url: `${SITE}/network/directory`, lastModified: new Date("2026-09-03"), changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE}/network/directory/all`, lastModified: new Date("2026-09-18"), changeFrequency: "weekly", priority: 0.65 },
    { url: `${SITE}/services`, lastModified: LAST_SEO_UPDATE, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE}/work`, lastModified: LAST_SEO_UPDATE, changeFrequency: "monthly", priority: 0.85 },
    { url: `${SITE}/about`, lastModified: LAST_SEO_UPDATE, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE}/contact`, lastModified: LAST_SEO_UPDATE, changeFrequency: "yearly", priority: 0.75 },
    { url: `${SITE}/process`, lastModified: LAST_SEO_UPDATE, changeFrequency: "monthly", priority: 0.65 },
    { url: `${SITE}/pricing`, lastModified: LAST_SEO_UPDATE, changeFrequency: "monthly", priority: 0.65 },
    { url: `${SITE}/offers/creator-wave-workshop`, lastModified: new Date("2026-08-06"), changeFrequency: "monthly", priority: 0.65 },
    { url: `${SITE}/privacy`, lastModified: LAST_SEO_UPDATE, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE}/terms`, lastModified: LAST_SEO_UPDATE, changeFrequency: "yearly", priority: 0.3 },
  ];

  const serviceRoutes: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${SITE}/services/${s.slug}`,
    lastModified: LAST_SEO_UPDATE,
    changeFrequency: "monthly",
    priority: 0.72,
  }));

  const workRoutes: MetadataRoute.Sitemap = work.map((w) => ({
    url: `${SITE}/work/${w.slug}`,
    lastModified: LAST_SEO_UPDATE,
    changeFrequency: "monthly",
    priority: 0.78,
  }));

  const offerRoutes: MetadataRoute.Sitemap = offers.map((o) => ({
    url: `${SITE}/offers/${o.slug}`,
    lastModified: LAST_SEO_UPDATE,
    changeFrequency: "monthly",
    priority: 0.65,
  }));

  const directoryRoutes: MetadataRoute.Sitemap = directoryGroups.map((group) => ({
    url: `${SITE}/network/directory/${group.slug}`,
    lastModified: new Date("2026-09-18"),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const memberRoutes: MetadataRoute.Sitemap = directoryMembers.map((member) => ({
    url: `${SITE}/network/directory/member/${member.id}`,
    lastModified: member.joinedAt && !Number.isNaN(Date.parse(member.joinedAt))
      ? new Date(member.joinedAt)
      : LAST_SEO_UPDATE,
    changeFrequency: "monthly",
    priority: 0.68,
    images: member.profileImage ? [member.profileImage.startsWith("http") ? member.profileImage : `${SITE}${member.profileImage}`] : undefined,
  }));

  return [
    ...staticRoutes,
    ...serviceRoutes,
    ...workRoutes,
    ...offerRoutes,
    ...directoryRoutes,
    ...memberRoutes,
  ];
}
