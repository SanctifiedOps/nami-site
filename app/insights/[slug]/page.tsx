import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, ArrowLeft, Clock, Calendar } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { PageHero } from "@/components/sections/page-hero";
import { InsightsSidebar } from "@/components/insights/sidebar";
import { SocialShare } from "@/components/insights/social-share";
import {
  getAllPosts,
  getAllTags,
  getPostBySlug,
  formatPostDate,
} from "@/lib/content/insights";
import {
  JsonLd,
  buildArticleSchema,
  buildBreadcrumbSchema,
} from "@/components/seo/json-ld";

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
    title: `${post.title} · Creative Waves`,
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
  const tags = await getAllTags();
  const idx = allPosts.findIndex((p) => p.slug === slug);
  const next = allPosts[(idx + 1) % allPosts.length];
  const hasNext = allPosts.length > 1 && next.slug !== slug;

  return (
    <>
      <JsonLd
        schema={[
          buildArticleSchema({
            slug: post.slug,
            title: post.title,
            description: post.summary,
            datePublished: post.date,
          }),
          buildBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Creative Waves", url: "/insights" },
            { name: post.title, url: `/insights/${post.slug}` },
          ]),
        ]}
      />
      <PageHero
        eyebrow={`Creative Waves · ${post.pillar}`}
        title={post.title}
        lead={post.subtitle ?? post.summary}
      />

      {/* Meta strip */}
      <section className="container-shell py-6 md:py-8 border-b border-line">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-fg-subtle">
          <Link
            href="/insights"
            className="group inline-flex items-center gap-2 text-fg-muted transition-colors hover:text-accent"
          >
            <ArrowLeft
              size={14}
              aria-hidden
              className="transition-transform duration-500 group-hover:-translate-x-1"
            />
            All posts
          </Link>
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

      {/* Article body + sidebar */}
      <section className="container-shell py-12 md:py-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_320px] lg:gap-16">
          <article className="prose-insights">
            {post.cover && (
              <div className="not-prose relative mb-10 aspect-[16/9] overflow-hidden rounded-3xl border border-line bg-surface-1 md:mb-14">
                <Image
                  src={post.cover}
                  alt={post.title}
                  fill
                  sizes="(min-width: 1024px) 65vw, 100vw"
                  priority
                  className="object-cover"
                />
              </div>
            )}
            <MDXRemote source={post.body} />
            <SocialShare slug={post.slug} title={post.title} />
          </article>

          <InsightsSidebar
            posts={allPosts}
            tags={tags}
            excludeSlug={slug}
            className="lg:sticky lg:top-28 lg:self-start"
          />
        </div>
      </section>

      {/* Next post */}
      {hasNext && (
        <section className="container-shell py-16 md:py-20 border-t border-line">
          <Link
            href={`/insights/${next.slug}`}
            className="group block rounded-3xl border border-line bg-surface-1/60 p-10 backdrop-blur-md transition-colors hover:border-accent/40 md:p-16"
          >
            <p className="eyebrow mb-4">
              Read next · {next.pillar}
            </p>
            <p className="text-3xl font-medium leading-tight tracking-tight md:text-5xl">
              {next.title}
            </p>
            <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-accent">
              Continue
              <ArrowUpRight
                size={14}
                aria-hidden
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </span>
          </Link>
        </section>
      )}
    </>
  );
}
