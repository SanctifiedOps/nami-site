import type { MetadataRoute } from "next";
import { services } from "@/lib/content/services";
import { work } from "@/lib/content/work";

const SITE = "https://namicreative.co.uk";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE}/work`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE}/process`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE}/insights`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.8 },
    { url: `${SITE}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const serviceRoutes: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${SITE}/services/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const workRoutes: MetadataRoute.Sitemap = work.map((w) => ({
    url: `${SITE}/work/${w.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...serviceRoutes, ...workRoutes];
}
