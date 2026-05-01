"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { values } from "@/lib/content/values";
import { stage, stageFast, fadeUp, cardIn } from "@/lib/motion";

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About — NAMI Creative"
        title="Brand as infrastructure."
        lead="A creative marketing studio building brand identity, content systems, and growth infrastructure for founders who want the work to compound."
      />

      {/* Story */}
      <section className="container-shell py-24 md:py-32">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stage}
          className="grid gap-12 md:grid-cols-[1fr_2fr] md:gap-20"
        >
          <motion.p className="eyebrow md:mt-2" variants={fadeUp}>
            The story
          </motion.p>
          <motion.div variants={fadeUp} className="space-y-6 max-w-2xl">
            <p className="text-2xl font-medium leading-snug tracking-tight md:text-3xl">
              NAMI exists to build brands that{" "}
              <span className="font-serif italic text-gradient">
                stay aligned
              </span>{" "}
              while the business scales.
            </p>
            <p className="text-fg-muted md:text-lg leading-relaxed">
              Most businesses don't have a brand problem. They have an
              alignment problem. Identity drifts away from messaging,
              messaging drifts from product, content drifts from strategy,
              and growth becomes harder than it should be.
            </p>
            <p className="text-fg-muted md:text-lg leading-relaxed">
              We sit between three roles — brand studio, creative partner,
              systems builder — because that's the shape of the work that
              actually moves the needle. Strategy without execution is a
              deck. Execution without systems is exhaustion. We do all
              three so what gets built keeps working after we leave.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Values */}
      <section className="border-t border-line bg-surface-1/40 py-24 md:py-32">
        <div className="container-shell">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={stage}
            className="mb-14 max-w-2xl"
          >
            <motion.p className="eyebrow mb-5" variants={fadeUp}>
              How we think
            </motion.p>
            <motion.h2
              className="text-[clamp(2rem,4.5vw,3.5rem)] font-medium leading-[1.05] tracking-tight"
              variants={fadeUp}
            >
              Three principles{" "}
              <span className="font-serif italic text-gradient">
                we hold to.
              </span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={stageFast}
            className="grid gap-6 md:grid-cols-3 md:gap-8"
          >
            {values.map((value, i) => (
              <motion.article
                key={value.title}
                variants={cardIn}
                className="rounded-2xl border border-line bg-surface-1/60 p-8 backdrop-blur-md md:p-10"
              >
                <span className="font-mono text-sm text-accent">
                  0{i + 1}
                </span>
                <h3 className="mt-6 text-2xl font-medium tracking-tight md:text-3xl">
                  {value.title}
                </h3>
                <p className="mt-4 text-fg-muted leading-relaxed">
                  {value.body}
                </p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Founder note */}
      <section className="container-shell py-24 md:py-32 border-t border-line">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stage}
          className="grid gap-12 md:grid-cols-[1fr_2fr] md:gap-20"
        >
          <motion.p className="eyebrow md:mt-2" variants={fadeUp}>
            The founder
          </motion.p>
          <motion.div variants={fadeUp} className="space-y-6 max-w-2xl">
            <p className="text-2xl font-medium leading-snug tracking-tight md:text-3xl">
              Built by a founder, for founders.
            </p>
            <p className="text-fg-muted md:text-lg leading-relaxed">
              NAMI is a small studio by design. Direct client relationships,
              senior-only output, and deep involvement in every engagement.
              No middle layer, no junior handoffs. The trade-off is fewer
              clients, more thinking per client, sharper work.
            </p>
            <p className="text-fg-muted md:text-lg leading-relaxed">
              Currently working with a handful of founders building
              service businesses, software products, and creator brands —
              all at the point where DIY stops scaling.
            </p>
            <Link
              href="/contact"
              className="group mt-2 inline-flex items-center gap-2 text-sm font-medium text-fg hover:text-accent transition-colors"
            >
              Get in touch
              <ArrowUpRight
                size={14}
                aria-hidden
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}
