import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { InsightsSidebar } from "@/components/insights/sidebar";
import { NewsletterSubscribe } from "@/components/sections/newsletter-subscribe";
import { PostCard } from "@/components/insights/post-card";
import { getAllPosts, getAllTags } from "@/lib/content/insights";

export const metadata: Metadata = {
  title: "Creative Waves · Studio notes from NAMI Creative",
  description:
    "Notes, frameworks, and breakdowns from inside the work. Brand, content, automation, and the decisions behind them.",
};

export default async function InsightsPage() {
  const posts = await getAllPosts();
  const tags = await getAllTags();
  const featured = posts.find((p) => p.featured) ?? posts[0];
  const rest = posts.filter((p) => p.slug !== featured?.slug);

  return (
    <>
      <PageHero
        eyebrow="Brands for the future"
        title={
          <>
            Creative <span className="text-gradient">Waves</span>
          </>
        }
        lead="Notes on brand, content, websites, and the decisions behind good creative work."
      >
        <NewsletterSubscribe
          variant="card"
          stacked
          eyebrow="Subscribe"
          title={
            <>
              Get the next piece,{" "}
              <span className="text-gradient">when it lands</span>
            </>
          }
          lead="One email when there's something worth your inbox. Unsubscribe anytime."
          className="w-full max-w-3xl p-6 md:p-10"
        />
      </PageHero>

      <section className="container-shell py-20 md:py-28">
        {posts.length === 0 ? (
          <p className="text-fg-muted text-lg">
            First essays landing shortly. Subscribe above to get them when
            they land.
          </p>
        ) : (
          <div className="grid gap-12 lg:grid-cols-[1fr_360px] lg:gap-16">
            {/* Main column */}
            <div>
              {/* Featured post Ã¢â‚¬â€ full-width prominent card */}
              {featured && <PostCard post={featured} variant="featured" />}

              {/* Rest of posts Ã¢â‚¬â€ single column when there's only one
                  non-featured post so it sits at full width below the
                  featured hero instead of orphaning in a half-width grid
                  cell. 2-col grid returns automatically with 2+ posts. */}
              {rest.length > 0 && (
                <ul
                  className={`mt-10 grid gap-6 md:gap-8 ${
                    rest.length >= 2 ? "md:grid-cols-2" : "grid-cols-1"
                  }`}
                >
                  {rest.map((post) => (
                    <li key={post.slug}>
                      <PostCard post={post} />
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Sidebar */}
            <InsightsSidebar
              posts={posts}
              tags={tags}
              excludeSlug={featured?.slug}
              className="lg:sticky lg:top-28 lg:self-start"
            />
          </div>
        )}
      </section>
    </>
  );
}
