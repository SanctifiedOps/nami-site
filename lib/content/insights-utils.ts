/**
 * Client-safe types and helpers for the Insights content layer.
 * Filesystem readers (fs/path) live in `insights.ts` (server-only).
 */

export type InsightFrontmatter = {
  title: string;
  subtitle?: string;
  summary: string;
  pillar: string;
  /** Free-form taxonomy tags. Each becomes a clickable topic in the sidebar. */
  tags?: string[];
  /** Featured image path, e.g. "/assets/blog-pics/friction-tax.png". */
  cover?: string;
  date: string;
  minutes: number;
  featured?: boolean;
};

export type InsightPost = InsightFrontmatter & {
  slug: string;
  body: string;
};

export function formatPostDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Convert a tag like "Brand Systems" to a URL slug like "brand-systems". */
export function slugifyTag(tag: string): string {
  return tag
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}
