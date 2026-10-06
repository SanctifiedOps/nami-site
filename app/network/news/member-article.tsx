import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Calendar, Clock3, MapPin } from "lucide-react";
import {
  contributionFormatDetails,
  type ContributionAssetView,
  type ContributionDocument,
  type ContributionFormat,
} from "@/lib/network-contributions/types";

export type MemberArticleView = {
  title: string;
  summary: string;
  format: ContributionFormat;
  content: ContributionDocument;
  publishedAt: string;
  author: {
    id: string;
    name: string;
    speciality: string;
    location: string;
    bio: string;
    profileImageUrl?: string | null;
  };
  coverImageUrl?: string | null;
  inlineAssets?: ContributionAssetView[];
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function readTime(article: MemberArticleView) {
  const wordCount = [
    article.title,
    article.summary,
    ...article.content.blocks.map((block) => block.text),
  ]
    .join(" ")
    .trim()
    .split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / 220));
}

export function MemberArticle({
  article,
  previewMode = false,
}: {
  article: MemberArticleView;
  previewMode?: boolean;
}) {
  const format = contributionFormatDetails[article.format];
  const inlineAssets = article.inlineAssets ?? [];

  return (
    <main className="min-h-screen bg-surface-0 pb-24 pt-24 text-fg md:pt-28">
      {previewMode && (
        <div className="container-shell mb-6">
          <div className="rounded-2xl border border-accent/30 bg-accent/5 px-4 py-3 text-sm">
            Local publication preview. This is how an approved member contribution will read.
          </div>
        </div>
      )}

      <article>
        <header className="container-shell py-8 md:py-12">
          <Link
            href={previewMode ? "/network/admin/contributions/preview" : "/network/news"}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.13em] text-fg-muted transition hover:text-accent"
          >
            <ArrowLeft size={14} aria-hidden />
            Back to stories
          </Link>

          <div className="mt-9 grid gap-8 lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-end lg:gap-16">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.19em] text-accent">
                From the Network / {format.shortLabel}
              </p>
              <h1 className="mt-4 max-w-5xl text-[clamp(2.6rem,6vw,6.5rem)] font-semibold leading-[0.9] tracking-[-0.055em] text-balance">
                {article.title}
              </h1>
            </div>
            <div className="border-t border-line pt-5 lg:border-l lg:border-t-0 lg:pl-7">
              <p className="text-base leading-relaxed text-fg-muted">{article.summary}</p>
              <div className="mt-5 flex flex-wrap gap-4 text-xs text-fg-subtle">
                <span className="inline-flex items-center gap-2">
                  <Calendar size={13} aria-hidden />
                  {formatDate(article.publishedAt)}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Clock3 size={13} aria-hidden />
                  {readTime(article)} min read
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="container-shell">
          {article.coverImageUrl ? (
            <div className="aspect-[16/7] min-h-72 overflow-hidden bg-surface-2">
              <img
                src={article.coverImageUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="relative aspect-[16/6] min-h-64 overflow-hidden border-y border-line bg-surface-1">
              <div className="absolute inset-x-8 bottom-8 flex items-end justify-between gap-5">
                <p className="max-w-xl text-2xl font-semibold leading-tight tracking-[-0.035em] md:text-4xl">
                  Written by {article.author.name}
                </p>
                <span className="hidden font-mono text-xs text-fg-subtle md:block">NAMI / MEMBER VOICE</span>
              </div>
            </div>
          )}
        </div>

        <div className="container-shell grid gap-12 py-12 md:py-16 lg:grid-cols-[minmax(0,47rem)_18rem] lg:justify-between lg:gap-20">
          <div className="space-y-7 text-[1.05rem] leading-[1.85] text-fg-muted md:text-lg">
            {article.content.blocks.map((block, index) =>
              block.type === "image" ? (() => {
                const asset = inlineAssets.find((item) => item.id === block.assetId);
                return asset ? <figure key={block.id} className="my-10"><img src={asset.url} alt={block.altText || asset.altText} className="max-h-[46rem] w-full object-contain" />{block.text && <figcaption className="mt-3 text-sm text-fg-subtle">{block.text}</figcaption>}</figure> : null;
              })() : block.type === "heading" ? (
                <h2
                  key={block.id}
                  className="pt-5 text-3xl font-semibold leading-tight tracking-[-0.04em] text-fg md:text-4xl"
                >
                  {block.text}
                </h2>
              ) : block.type === "quote" ? (
                <blockquote
                  key={block.id}
                  className="my-10 border-y border-accent py-7 text-2xl font-medium italic leading-relaxed text-fg md:text-3xl"
                >
                  {block.text}
                </blockquote>
              ) : (
                block.text.split(/\n\s*\n/).filter(Boolean).map((paragraph, paragraphIndex) => (
                  <p
                    key={`${block.id}-${paragraphIndex}`}
                    className={index === 0 && paragraphIndex === 0 ? "whitespace-pre-line text-xl leading-[1.7] text-fg md:text-2xl" : "whitespace-pre-line"}
                  >
                    {paragraph.trim()}
                  </p>
                ))
              ),
            )}
          </div>

          <aside className="lg:sticky lg:top-32 lg:self-start">
            <p className="border-b border-line pb-3 text-xs font-bold uppercase tracking-[0.17em] text-accent">
              Written by a Network member
            </p>
            {article.author.profileImageUrl ? (
              <img
                src={article.author.profileImageUrl}
                alt={`${article.author.name} profile picture`}
                className="mt-5 aspect-square w-24 rounded-full border border-accent/40 object-cover"
              />
            ) : (
              <div className="mt-5 grid size-24 place-items-center rounded-full border border-accent/40 bg-surface-2 text-2xl font-semibold text-accent">
                {article.author.name
                  .split(/\s|\//)
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((part) => part[0])
                  .join("")
                  .toUpperCase()}
              </div>
            )}
            <h2 className="mt-5 text-2xl font-semibold leading-tight">{article.author.name}</h2>
            <p className="mt-2 text-sm text-fg-muted">{article.author.speciality}</p>
            <p className="mt-2 inline-flex items-center gap-2 text-xs text-fg-subtle">
              <MapPin size={13} className="text-accent" aria-hidden />
              {article.author.location}
            </p>
            <p className="mt-5 text-sm leading-relaxed text-fg-muted">{article.author.bio}</p>
            <Link
              href={`/network/directory/member/${article.author.id}`}
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold transition hover:text-accent"
            >
              View member profile
              <ArrowUpRight size={14} aria-hidden />
            </Link>

            <section className="mt-10 border-y border-accent py-6">
              <p className="text-xs font-bold uppercase tracking-[0.17em] text-accent">Member voice</p>
              <p className="mt-3 text-sm leading-relaxed text-fg-muted">
              This contribution is published in the member&apos;s own words. NAMI checks submissions but doesn&apos;t generate or rewrite them.
              </p>
            </section>
          </aside>
        </div>
      </article>
    </main>
  );
}
