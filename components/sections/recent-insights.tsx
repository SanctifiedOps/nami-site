import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/sections/section-heading";
import { PostCard } from "@/components/insights/post-card";
import type { InsightPost } from "@/lib/content/insights-utils";

type Props = {
  posts: InsightPost[];
};

export function RecentInsights({ posts }: Props) {
  if (posts.length === 0) return null;

  return (
    <section className="container-shell py-24 md:py-36 border-t border-line">
      <div className="mb-16 grid gap-8 md:grid-cols-[2fr_1fr] md:items-end md:gap-16 md:mb-20">
        <SectionHeading
          eyebrow="Creative Waves"
          title={
            <>
              Notes on where this{" "}
              <span className="text-gradient sm:block">
                industry is heading.
              </span>
            </>
          }
        />
        <p className="text-fg-muted md:text-lg leading-relaxed">
          Branding, automation, and the work behind the work. Fresh pieces
          from inside the studio.
        </p>
      </div>

      <ul className="grid gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        {posts.map((post) => (
          <li key={post.slug}>
            <PostCard post={post} />
          </li>
        ))}
      </ul>

      <div className="mt-16 flex items-center justify-center md:mt-20">
        <Link
          href="/insights"
          className="group inline-flex items-center gap-2 rounded-full border border-line-strong px-7 py-4 text-sm font-semibold text-fg transition-colors duration-300 hover:bg-white/5 hover:border-accent"
        >
          Read every Creative Waves piece
          <ArrowUpRight
            size={14}
            aria-hidden
            className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </Link>
      </div>
    </section>
  );
}
