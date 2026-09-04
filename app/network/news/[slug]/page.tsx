import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Calendar, Clock } from "lucide-react";
import {
  formatPostDate,
  getNetworkArticleBySlug,
  getNetworkArticleSlugs,
} from "@/lib/content/network-news";

export function generateStaticParams() {
  return getNetworkArticleSlugs().map((slug) => ({ slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getNetworkArticleBySlug(slug);

  if (!article) {
    return {
      title: "Network News",
    };
  }

  return {
    title: `${article.title} | NAMI Creative Network News`,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      url: `https://namicreative.co.uk/network/news/${article.slug}`,
      images: [
        {
          url: "/nami-og%20%281%29.png",
          width: 2800,
          height: 1750,
          alt: article.title,
        },
      ],
    },
    alternates: {
      canonical: `/network/news/${article.slug}`,
    },
  };
}

export default async function NetworkNewsArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getNetworkArticleBySlug(slug);

  if (!article) notFound();

  return (
    <article className="relative overflow-hidden pt-32 md:pt-40">
      <div aria-hidden className="hairline-grid absolute inset-0 opacity-30" />
      <div aria-hidden className="absolute left-1/2 top-0 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />

      <header className="container-shell relative z-10 pb-14 text-center md:pb-20">
        <Link
          href="/network/news"
          className="group mb-8 inline-flex items-center gap-2 text-sm font-semibold text-fg-muted transition-colors hover:text-accent"
        >
          <ArrowLeft size={15} aria-hidden className="transition-transform group-hover:-translate-x-1" />
          Back to news
        </Link>
        <p className="mono-label text-accent">{article.category}</p>
        <h1 className="mx-auto mt-5 max-w-5xl text-[clamp(2.5rem,7vw,6.3rem)] font-semibold leading-[0.9] tracking-tight">
          {article.title}
        </h1>
        <p className="mx-auto mt-7 max-w-3xl text-lg leading-[1.45] text-fg-muted md:text-xl">
          {article.summary}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-fg-subtle">
          <span className="inline-flex items-center gap-2">
            <Calendar size={15} aria-hidden />
            <time dateTime={article.date}>{formatPostDate(article.date)}</time>
          </span>
          <span className="inline-flex items-center gap-2">
            <Clock size={15} aria-hidden />
            {article.minutes} min read
          </span>
        </div>
      </header>

      <div className="container-shell relative z-10 pb-20 md:pb-28">
        <div className="mx-auto max-w-3xl rounded-3xl border border-line bg-surface-1/55 p-7 backdrop-blur-md md:p-12">
          <div className="prose-insights">
            {article.body?.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-10 grid max-w-5xl gap-5 md:grid-cols-2">
          <div className="glass-refractive rounded-3xl p-7 md:p-8">
            <p className="mono-label text-accent">For creatives</p>
            <h2 className="mt-4 text-3xl font-semibold leading-[0.98] tracking-tight">
              Want NAMI to know what you are building?
            </h2>
            <p className="mt-4 leading-relaxed text-fg-muted">
              Join the Creative Network so your work can be kept in mind for features, roundups, referrals, and future opportunities.
            </p>
            <Link href="/network" className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-fg hover:text-accent">
              Join the network
              <ArrowUpRight size={14} aria-hidden className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          <div className="glass-refractive rounded-3xl p-7 md:p-8">
            <p className="mono-label text-accent">For businesses</p>
            <h2 className="mt-4 text-3xl font-semibold leading-[0.98] tracking-tight">
              Need the marketing side properly sorted?
            </h2>
            <p className="mt-4 leading-relaxed text-fg-muted">
              NAMI helps with content, websites, automation, and clearer buyer journeys so customers know what to do next.
            </p>
            <Link href="/contact" className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-fg hover:text-accent">
              Talk about the work
              <ArrowUpRight size={14} aria-hidden className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}