"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { NewsletterSubscribe } from "@/components/sections/newsletter-subscribe";
import { stage, fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { InsightPost } from "@/lib/content/insights-utils";
import { formatPostDate, slugifyTag } from "@/lib/content/insights-utils";

type Props = {
  /** Posts to surface in the "Latest" widget. Caller can pass filtered list. */
  posts: InsightPost[];
  /** Optional className applied to the wrapping <aside> */
  className?: string;
  /** When rendered next to an article body, the slug to exclude from "Latest" */
  excludeSlug?: string;
  /** Distinct tags across all posts, rendered as clickable Topics chips. */
  tags?: string[];
};

export function InsightsSidebar({
  posts,
  className,
  excludeSlug,
  tags,
}: Props) {
  const recent = posts
    .filter((p) => p.slug !== excludeSlug)
    .slice(0, 4);

  return (
    <motion.aside
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
      variants={stage}
      className={cn("space-y-8", className)}
    >
      {/* Newsletter signup — compact card variant */}
      <motion.div variants={fadeUp}>
        <NewsletterSubscribe
          variant="card"
          compact
          eyebrow="Subscribe"
          title={
            <>
              The next piece,{" "}
              <span className="text-gradient">in your inbox.</span>
            </>
          }
          lead="Occasional. Direct from the studio. Worth your inbox."
          className="p-7 md:p-8"
        />
      </motion.div>

      {/* Latest posts widget */}
      {recent.length > 0 && (
        <motion.div
          variants={fadeUp}
          className="glass-refractive rounded-3xl p-8"
        >
          <p className="eyebrow mb-5">Latest</p>
          <ul className="space-y-5">
            {recent.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/insights/${post.slug}`}
                  className="group block"
                >
                  <p className="text-xs uppercase tracking-widest text-accent/80">
                    {post.pillar}
                  </p>
                  <p className="mt-1.5 text-base font-medium leading-snug tracking-tight text-fg group-hover:text-accent transition-colors">
                    {post.title}
                  </p>
                  <p className="mt-1 text-xs text-fg-subtle">
                    {formatPostDate(post.date)} · {post.minutes} min
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Tags / topics widget — clickable, links to filtered topic page */}
      {tags && tags.length > 0 && (
        <motion.div
          variants={fadeUp}
          className="glass-refractive rounded-3xl p-8"
        >
          <p className="eyebrow mb-5">Topics</p>
          <ul className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <li key={tag}>
                <Link
                  href={`/insights/topic/${slugifyTag(tag)}`}
                  className="inline-flex items-center rounded-full border border-line bg-surface-2/60 px-3 py-1.5 text-xs uppercase tracking-widest text-fg-muted transition-colors hover:border-accent/60 hover:bg-accent/10 hover:text-fg"
                >
                  {tag}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Studio link */}
      <motion.div
        variants={fadeUp}
        className="rounded-3xl border border-line bg-surface-1/40 p-8"
      >
        <p className="eyebrow mb-3">From the studio</p>
        <p className="text-sm text-fg-muted leading-relaxed mb-5">
          Creative Waves: studio notes from NAMI Creative. Brand, content,
          and systems for founders building something deliberate.
        </p>
        <Link
          href="/work"
          className="group inline-flex items-center gap-2 text-sm font-medium text-fg hover:text-accent transition-colors"
        >
          Selected work
          <ArrowUpRight
            size={14}
            aria-hidden
            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </Link>
      </motion.div>
    </motion.aside>
  );
}
