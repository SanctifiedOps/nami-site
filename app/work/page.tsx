"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { stage, stageFast, fadeUp, cardIn } from "@/lib/motion";

const TEASERS = [
  {
    pillar: "Brand + website",
    title: "Founder-led services brand rebuild",
    summary:
      "Positioning reset, identity system, and conversion-led website. Discovery to launch in seven weeks.",
    status: "In delivery",
  },
  {
    pillar: "Content engine",
    title: "B2B SaaS content pipeline",
    summary:
      "Editorial calendar, format library, and an automated production workflow shipping 3× output with the same team.",
    status: "Ongoing partnership",
  },
  {
    pillar: "Automation + growth",
    title: "Creator brand lead-capture stack",
    summary:
      "Notion ops + Mailchimp Customer Journeys + lifecycle email design. From cold list to nurtured pipeline in 4 weeks.",
    status: "Recently shipped",
  },
];

export default function WorkPage() {
  return (
    <>
      <PageHero
        eyebrow="Selected work"
        title="Case studies launching with our next cohort."
        lead="The full archive is being rebuilt alongside current client launches. Below — the engagements we're closest to right now."
      />

      <section className="container-shell py-24 md:py-32">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={stageFast}
          className="grid gap-6 md:gap-8"
        >
          {TEASERS.map((t, i) => (
            <motion.article
              key={t.title}
              variants={cardIn}
              className="group relative grid gap-6 rounded-3xl border border-line bg-surface-1/60 p-8 backdrop-blur-md transition-colors hover:border-accent/40 md:grid-cols-[1fr_2fr] md:items-center md:gap-12 md:p-12"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-surface-2 md:aspect-square">
                <div
                  className="absolute inset-0"
                  style={{
                    background: `radial-gradient(ellipse 80% 60% at ${30 + i * 15}% ${30 + i * 10}%, rgb(230 50 175 / 0.5) 0%, rgb(100 200 255 / 0.18) 40%, transparent 70%)`,
                    filter: "blur(30px)",
                  }}
                />
                <div className="absolute inset-0 grid place-items-center">
                  <span className="font-mono text-sm text-fg-subtle">
                    0{i + 1}
                  </span>
                </div>
              </div>
              <div>
                <p className="eyebrow text-accent/80">{t.pillar}</p>
                <h2 className="mt-3 text-2xl font-medium tracking-tight md:text-3xl">
                  {t.title}
                </h2>
                <p className="mt-4 text-fg-muted leading-relaxed">
                  {t.summary}
                </p>
                <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-line px-3 py-1 text-xs uppercase tracking-widest text-fg-subtle">
                  <span className="size-1.5 rounded-full bg-accent" />
                  {t.status}
                </p>
              </div>
            </motion.article>
          ))}
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={stage}
          className="mt-20 flex flex-col items-start gap-6 rounded-3xl border border-line bg-surface-1/40 p-10 md:mt-28 md:flex-row md:items-center md:justify-between md:p-16"
        >
          <motion.div variants={fadeUp} className="max-w-xl">
            <p className="eyebrow mb-3">Want to be next?</p>
            <p className="text-2xl font-medium tracking-tight md:text-3xl">
              We take a small number of new engagements{" "}
              <span className="font-serif italic text-gradient">
                each quarter.
              </span>
            </p>
          </motion.div>
          <motion.div variants={fadeUp}>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-4 text-sm font-semibold text-white shadow-[0_4px_20px_rgb(230_50_175/0.3)] transition-all duration-300 hover:bg-accent-soft hover:shadow-[0_8px_40px_rgb(230_50_175/0.5)]"
            >
              Open a conversation
              <ArrowUpRight
                size={16}
                aria-hidden
                className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}
