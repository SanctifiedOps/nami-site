import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import type { InsightFrontmatter, InsightPost } from "./insights-utils";

export type { InsightFrontmatter, InsightPost } from "./insights-utils";
export { formatPostDate, slugifyTag } from "./insights-utils";

const CONTENT_DIR = path.join(process.cwd(), "content", "insights");

async function readPostFile(filename: string): Promise<InsightPost | null> {
  if (!filename.endsWith(".mdx")) return null;
  const slug = filename.replace(/\.mdx$/, "");
  const raw = await fs.readFile(path.join(CONTENT_DIR, filename), "utf8");
  const { data, content } = matter(raw);
  return {
    slug,
    body: content,
    ...(data as InsightFrontmatter),
  };
}

export async function getAllPosts(): Promise<InsightPost[]> {
  let files: string[];
  try {
    files = await fs.readdir(CONTENT_DIR);
  } catch {
    return [];
  }
  const posts = await Promise.all(files.map(readPostFile));
  return posts
    .filter((p): p is InsightPost => p !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostBySlug(
  slug: string,
): Promise<InsightPost | null> {
  try {
    return await readPostFile(`${slug}.mdx`);
  } catch {
    return null;
  }
}

/**
 * Unique tags across every post, preserving the original casing of the
 * first occurrence. Sorted alphabetically.
 */
export async function getAllTags(): Promise<string[]> {
  const posts = await getAllPosts();
  const seen = new Map<string, string>();
  for (const post of posts) {
    for (const tag of post.tags ?? []) {
      const key = tag.toLowerCase();
      if (!seen.has(key)) seen.set(key, tag);
    }
  }
  return Array.from(seen.values()).sort((a, b) => a.localeCompare(b));
}
