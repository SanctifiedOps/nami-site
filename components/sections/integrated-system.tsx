"use client";

import { motion } from "motion/react";
import { X } from "lucide-react";
import { stage, blurUp } from "@/lib/motion";

const FRAGMENTED = [
  "Brand designer",
  "Content person",
  "Web developer",
  "Automations freelancer",
];

const PILLARS = [
  "Brand strategy + identity",
  "Content systems",
  "Website + funnel",
  "Visual direction",
  "Automation + growth",
];

/**
 * The differentiator made visual: the fragmented multi-vendor reality on the
 * left vs. one connected system on the right. This is the services index's
 * argument, shown rather than stated.
 */
export function IntegratedSystem() {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={stage}
      className="grid gap-6 lg:grid-cols-2 lg:gap-8"
    >
      {/* The usual way — fragmented */}
      <motion.div
        variants={blurUp}
        className="rounded-3xl border border-line bg-surface-1/30 p-8 md:p-10"
      >
        <p className="mono-label">The usual way</p>
        <h3 className="mt-4 text-2xl font-medium tracking-tight md:text-3xl">
          Four vendors.{" "}
          <span className="text-fg-subtle">None see each other&apos;s work.</span>
        </h3>
        <ul className="mt-8 space-y-3">
          {FRAGMENTED.map((v) => (
            <li
              key={v}
              className="flex items-center gap-3 rounded-xl border border-dashed border-line px-4 py-3 text-sm text-fg-subtle"
            >
              <X size={14} aria-hidden className="shrink-0 opacity-60" />
              {v}
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm leading-relaxed text-fg-subtle">
          Handoffs, version drift, four invoices, and a brand that reads as
          four different voices.
        </p>
      </motion.div>

      {/* The NAMI way — integrated */}
      <motion.div
        variants={blurUp}
        className="glass-refractive relative overflow-hidden rounded-3xl p-8 md:p-10"
      >
        <div
          aria-hidden
          className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgb(255_0_188/0.2),transparent_70%)] blur-2xl"
        />
        <p className="mono-label text-accent/80">One integrated studio</p>
        <h3 className="mt-4 text-2xl font-medium tracking-tight md:text-3xl">
          Five pillars.{" "}
          <span className="text-gradient">Designed against each other.</span>
        </h3>
        <ol className="relative mt-8 space-y-3 pl-7">
          <span
            aria-hidden
            className="absolute bottom-4 left-[5px] top-4 w-px bg-accent/40"
          />
          {PILLARS.map((p) => (
            <li
              key={p}
              className="relative flex items-center py-1.5 text-sm text-fg"
            >
              <span
                aria-hidden
                className="absolute -left-7 top-1/2 size-2.5 -translate-y-1/2 rounded-full border border-accent bg-accent shadow-[0_0_8px_rgb(255_0_188/0.7)]"
              />
              {p}
            </li>
          ))}
        </ol>
        <p className="mt-6 text-sm leading-relaxed text-fg-muted">
          One brief, one team, one voice. The pieces reinforce each other
          instead of needing translation between vendors.
        </p>
      </motion.div>
    </motion.div>
  );
}
