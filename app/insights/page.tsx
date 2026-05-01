"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { stageFast, cardIn } from "@/lib/motion";

const PLACEHOLDER_POSTS = [
  {
    slug: "rebuilding-brand-momentum-from-the-inside-out",
    title: "Rebuilding brand momentum from the inside out",
    summary:
      "Why most rebrands stall in the second quarter — and the structural choices that keep momentum compounding.",
    pillar: "Brand strategy",
    minutes: 7,
    date: "Coming soon",
  },
  {
    slug: "clarity-first-positioning-for-crowded-markets",
    title: "Clarity-first positioning for crowded markets",
    summary:
      "When everyone's saying the same things slightly differently, what does sharp actually look like.",
    pillar: "Positioning",
    minutes: 9,
    date: "Coming soon",
  },
  {
    slug: "design-systems-that-keep-brands-aligned",
    title: "Design systems that keep brands aligned",
    summary:
      "Tokens, formats, and templates — the operational layer of a brand that holds while teams scale.",
    pillar: "Systems",
    minutes: 6,
    date: "Coming soon",
  },
];

export default function InsightsPage() {
  return (
    <>
      <PageHero
        eyebrow="Insights"
        title="How we think about the work."
        lead="Notes, frameworks, and breakdowns from inside the studio. Three cornerstone pieces shipping with the next site update."
      />

      <section className="container-shell py-24 md:py-32">
        <motion.ul
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={stageFast}
          className="grid gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3"
        >
          {PLACEHOLDER_POSTS.map((post) => (
            <motion.li key={post.slug} variants={cardIn}>
              <Link
                href={`/insights/${post.slug}`}
                className="group block h-full overflow-hidden rounded-2xl border border-line bg-surface-1/60 p-8 backdrop-blur-md transition-colors hover:border-accent/40"
              >
                <div className="flex items-center justify-between">
                  <span className="eyebrow text-accent/80">{post.pillar}</span>
                  <span className="text-xs text-fg-subtle">
                    {post.minutes} min
                  </span>
                </div>
                <h2 className="mt-6 text-xl font-medium leading-snug tracking-tight md:text-2xl">
                  {post.title}
                </h2>
                <p className="mt-4 text-fg-muted leading-relaxed">
                  {post.summary}
                </p>
                <div className="mt-8 flex items-center justify-between text-xs">
                  <span className="text-fg-subtle">{post.date}</span>
                  <ArrowUpRight
                    size={14}
                    aria-hidden
                    className="text-fg-muted transition-all group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </div>
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      </section>
    </>
  );
}
