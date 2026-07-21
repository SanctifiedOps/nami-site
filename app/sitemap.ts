import type { MetadataRoute } from "next";
import { services } from "@/lib/content/services";
import { work } from "@/lib/content/work";
import { getAllPosts } from "@/lib/content/insights";
import { offers } from "@/lib/content/offers";

const SITE = "https://namicreative.co.uk";
const LAST_SEO_UPDATE = new Date("2026-07-21");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, lastModified: LAST_SEO_UPDATE, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE}/network`, lastModified: LAST_SEO_UPDATE, changeFrequency: "weekly", priority: 0.95 },
    { url: `${SITE}/services`, lastModified: LAST_SEO_UPDATE, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE}/work`, lastModified: LAST_SEO_UPDATE, changeFrequency: "monthly", priority: 0.85 },
    { url: `${SITE}/about`, lastModified: LAST_SEO_UPDATE, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE}/contact`, lastModified: LAST_SEO_UPDATE, changeFrequency: "yearly", priority: 0.75 },
    { url: `${SITE}/insights`, lastModified: LAST_SEO_UPDATE, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE}/process`, lastModified: LAST_SEO_UPDATE, changeFrequency: "monthly", priority: 0.65 },
    { url: `${SITE}/pricing`, lastModified: LAST_SEO_UPDATE, changeFrequency: "monthly", priority: 0.65 },
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

  const insightRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE}/insights/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  const offerRoutes: MetadataRoute.Sitemap = offers.map((o) => ({
    url: `${SITE}/offers/${o.slug}`,
    lastModified: LAST_SEO_UPDATE,
    changeFrequency: "monthly",
    priority: 0.65,
  }));

  return [
    ...staticRoutes,
    ...serviceRoutes,
    ...workRoutes,
    ...insightRoutes,
    ...offerRoutes,
  ];
}
