import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { InsightsSidebar } from "@/components/insights/sidebar";
import { NewsletterSubscribe } from "@/components/sections/newsletter-subscribe";
import { getAllPosts, formatPostDate } from "@/lib/content/insights";

export const metadata: Metadata = {
  title: "The Wake — studio notes from NAMI Creative",
  description:
    "Notes, frameworks, and breakdowns from inside the studio. Brand systems, content engines, automation infrastructure, and the work behind the work.",
};

export default async function InsightsPage() {
  const posts = await getAllPosts();
  const pillars = Array.from(new Set(posts.map((p) => p.pillar)));
  const featured = posts.find((p) => p.featured) ?? posts[0];
  const rest = posts.filter((p) => p.slug !== featured?.slug);

  return (
    <>
      <PageHero
        eyebrow="The Wake"
        title={
          <>
            Studio notes,{" "}
            <span className="text-gradient sm:block">from NAMI.</span>
          </>
        }
        lead="Brand systems, content engines, automation infrastructure. Occasional, considered, no fluff."
      >
        <NewsletterSubscribe
          variant="card"
          eyebrow="Subscribe"
          title={
            <>
              Get the next piece,{" "}
              <span className="text-gradient">when it lands.</span>
            </>
          }
          lead="One email when there's something worth your inbox. Unsubscribe anytime."
          className="max-w-2xl p-6 md:p-10"
        />
      </PageHero>

      <section className="container-shell py-20 md:py-28">
        {posts.length === 0 ? (
          <p className="text-fg-muted text-lg">
            First essays shipping shortly. Subscribe above to get them when
            they land.
          </p>
        ) : (
          <div className="grid gap-12 lg:grid-cols-[1fr_360px] lg:gap-16">
            {/* Main column */}
            <div>
              {/* Featured post — full-width prominent card */}
              {featured && (
                <Link
                  href={`/insights/${featured.slug}`}
                  className="group block overflow-hidden rounded-3xl border border-line bg-surface-1/60 p-7 backdrop-blur-md transition-colors hover:border-accent/40 md:p-12"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="eyebrow text-accent/80">
                      Featured · {featured.pillar}
                    </span>
                    <span className="text-fg-subtle">
                      {formatPostDate(featured.date)} · {featured.minutes} min
                    </span>
                  </div>
                  <h2 className="mt-6 text-[clamp(1.5rem,3.5vw,2.75rem)] font-medium leading-[1.1] tracking-tight">
                    {featured.title}
                  </h2>
                  {featured.subtitle && (
                    <p className="mt-3 text-fg-muted leading-relaxed md:text-lg">
                      {featured.subtitle}
                    </p>
                  )}
                  <p className="mt-6 text-fg-muted leading-relaxed line-clamp-3">
                    {featured.summary}
                  </p>
                  <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-fg/90 transition-colors group-hover:text-accent">
                    Read the full piece
                    <ArrowUpRight
                      size={14}
                      aria-hidden
                      className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </span>
                </Link>
              )}

              {/* Rest of posts */}
              {rest.length > 0 && (
                <ul className="mt-10 grid gap-6 md:grid-cols-2 md:gap-8">
                  {rest.map((post) => (
                    <li key={post.slug}>
                      <Link
                        href={`/insights/${post.slug}`}
                        className="group block h-full overflow-hidden rounded-2xl border border-line bg-surface-1/60 p-6 backdrop-blur-md transition-colors hover:border-accent/40 md:p-8"
                      >
                        <div className="flex items-center justify-between">
                          <span className="eyebrow text-accent/80">
                            {post.pillar}
                          </span>
                          <span className="text-xs text-fg-subtle">
                            {post.minutes} min
                          </span>
                        </div>
                        <h3 className="mt-6 text-xl font-medium leading-snug tracking-tight md:text-2xl">
                          {post.title}
                        </h3>
                        <p className="mt-4 text-fg-muted leading-relaxed line-clamp-3">
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
            </div>

            {/* Sidebar */}
            <InsightsSidebar
              posts={posts}
              pillars={pillars}
              excludeSlug={featured?.slug}
              className="lg:sticky lg:top-28 lg:self-start"
            />
          </div>
        )}
      </section>
    </>
  );
}
