import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { NewsletterSubscribe } from "@/components/sections/newsletter-subscribe";
import { getAllPosts, formatPostDate } from "@/lib/content/insights";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Notes, frameworks, and breakdowns from inside the studio. The work behind the work — brand systems, content engines, and the operational layer of how good studios actually run.",
};

export default async function InsightsPage() {
  const posts = await getAllPosts();

  return (
    <>
      <PageHero
        eyebrow="Insights"
        title={
          <>
            How we think about{" "}
            <span className="text-gradient">the work.</span>
          </>
        }
        lead="Notes, frameworks, and breakdowns from inside the studio. Occasional, considered, no fluff."
      />

      <section className="container-shell py-24 md:py-32">
        {posts.length === 0 ? (
          <p className="text-fg-muted text-lg">
            First essays shipping shortly. Subscribe below to get them when they
            land.
          </p>
        ) : (
          <ul className="grid gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/insights/${post.slug}`}
                  className="group block h-full overflow-hidden rounded-2xl border border-line bg-surface-1/60 p-8 backdrop-blur-md transition-colors hover:border-accent/40"
                >
                  <div className="flex items-center justify-between">
                    <span className="eyebrow text-accent/80">
                      {post.pillar}
                    </span>
                    <span className="text-xs text-fg-subtle">
                      {post.minutes} min
                    </span>
                  </div>
                  <h2 className="mt-6 text-xl font-medium leading-snug tracking-tight md:text-2xl">
                    {post.title}
                  </h2>
                  <p className="mt-4 text-fg-muted leading-relaxed line-clamp-4">
                    {post.summary}
                  </p>
                  <div className="mt-8 flex items-center justify-between text-xs">
                    <span className="text-fg-subtle">
                      {formatPostDate(post.date)}
                    </span>
                    <ArrowUpRight
                      size={14}
                      aria-hidden
                      className="text-fg-muted transition-all group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <NewsletterSubscribe />
    </>
  );
}
