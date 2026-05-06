import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

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

export function formatPostDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
