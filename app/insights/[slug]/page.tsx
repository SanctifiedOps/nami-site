import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, ArrowLeft, Clock, Calendar } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { PageHero } from "@/components/sections/page-hero";
import { NewsletterSubscribe } from "@/components/sections/newsletter-subscribe";
import {
  getAllPosts,
  getPostBySlug,
  formatPostDate,
} from "@/lib/content/insights";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Not found" };
  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function InsightPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const allPosts = await getAllPosts();
  const idx = allPosts.findIndex((p) => p.slug === slug);
  const next = allPosts[(idx + 1) % allPosts.length];
  const hasNext = allPosts.length > 1 && next.slug !== slug;

  return (
    <>
      <PageHero
        eyebrow={`Insights · ${post.pillar}`}
        title={post.title}
        lead={post.subtitle ?? post.summary}
      />

      {/* Meta strip */}
      <section className="container-shell py-8 md:py-12 border-b border-line">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-fg-subtle">
          <span className="inline-flex items-center gap-2">
            <Calendar size={14} aria-hidden />
            {formatPostDate(post.date)}
          </span>
          <span className="inline-flex items-center gap-2">
            <Clock size={14} aria-hidden />
            {post.minutes} min read
          </span>
        </div>
      </section>

      {/* Article body */}
      <section className="container-shell py-16 md:py-24">
        <article className="prose-insights mx-auto max-w-2xl">
          <MDXRemote source={post.body} />
        </article>
      </section>

      {/* Next + back */}
      <section className="container-shell py-16 md:py-20 border-t border-line">
        <div className="grid gap-8 md:grid-cols-[auto_1fr] md:items-center md:gap-12">
          <Link
            href="/insights"
            className="group inline-flex items-center gap-2 text-sm font-medium text-fg-muted transition-colors hover:text-accent"
          >
            <ArrowLeft
              size={14}
              aria-hidden
              className="transition-transform duration-500 group-hover:-translate-x-1"
            />
            All insights
          </Link>

          {hasNext && (
            <Link
              href={`/insights/${next.slug}`}
              className="group block rounded-2xl border border-line bg-surface-1/60 p-8 backdrop-blur-md transition-colors hover:border-accent/40 md:p-10"
            >
              <p className="eyebrow mb-3">Next · {next.pillar}</p>
              <p className="text-xl font-medium leading-snug tracking-tight md:text-2xl">
                {next.title}
              </p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-fg/80 transition-colors group-hover:text-accent">
                Read next
                <ArrowUpRight
                  size={14}
                  aria-hidden
                  className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </span>
            </Link>
          )}
        </div>
      </section>

      <NewsletterSubscribe />
    </>
  );
}
