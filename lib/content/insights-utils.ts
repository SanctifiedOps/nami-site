/**
 * Client-safe types and helpers for the Insights content layer.
 * Filesystem readers (fs/path) live in `insights.ts` (server-only).
 */

export type InsightFrontmatter = {
  title: string;
  subtitle?: string;
  summary: string;
  pillar: string;
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
