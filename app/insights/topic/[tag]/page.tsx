import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { InsightsSidebar } from "@/components/insights/sidebar";
import { PostCard } from "@/components/insights/post-card";
import {
  getAllPosts,
  getAllTags,
  slugifyTag,
} from "@/lib/content/insights";

type Params = { tag: string };

export async function generateStaticParams(): Promise<Params[]> {
  const tags = await getAllTags();
  return tags.map((t) => ({ tag: slugifyTag(t) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { tag } = await params;
  const tags = await getAllTags();
  const display = tags.find((t) => slugifyTag(t) === tag);
  if (!display) return { title: "Topic not found" };
  return {
    title: `${display} · Creative Waves`,
    description: `Posts tagged ${display}, from inside the studio.`,
  };
}

export default async function TopicPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { tag } = await params;
  const allPosts = await getAllPosts();
  const allTags = await getAllTags();
  const display = allTags.find((t) => slugifyTag(t) === tag);
  if (!display) notFound();

  const posts = allPosts.filter((p) =>
    p.tags?.some((t) => slugifyTag(t) === tag),
  );
  if (posts.length === 0) notFound();

  return (
    <>
      <PageHero
        eyebrow="Creative Waves · Topic"
        title={
          <>
            Tagged <span className="text-gradient">{display}.</span>
          </>
        }
        lead={`Every Creative Waves piece tagged ${display}, from inside the studio.`}
      />

      <section className="container-shell py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-[1fr_360px] lg:gap-16">
          <div>
            <ul className="grid gap-6 md:grid-cols-2 md:gap-8">
              {posts.map((post) => (
                <li key={post.slug}>
                  <PostCard post={post} />
                </li>
              ))}
            </ul>

            <div className="mt-12 border-t border-line pt-10">
              <Link
                href="/insights"
                className="group inline-flex items-center gap-2 text-sm font-medium text-fg hover:text-accent transition-colors"
              >
                <ArrowUpRight
                  size={14}
                  aria-hidden
                  className="rotate-180 transition-transform duration-500 group-hover:-translate-x-0.5 group-hover:translate-y-0.5"
                />
                All Creative Waves
              </Link>
            </div>
          </div>

          <InsightsSidebar
            posts={allPosts}
            tags={allTags}
            className="lg:sticky lg:top-28 lg:self-start"
          />
        </div>
      </section>
    </>
  );
}
