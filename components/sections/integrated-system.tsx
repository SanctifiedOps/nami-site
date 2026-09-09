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
  "Your brand and wording",
  "Your content",
  "Your website",
  "Your visual materials",
  "Your admin and follow-ups",
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
      {/* The usual way â€” fragmented */}
      <motion.div
        variants={blurUp}
        className="rounded-3xl border border-line bg-surface-1/30 p-8 md:p-10"
      >
        <p className="mono-label">When the work is split up</p>
        <h3 className="mt-4 text-2xl font-medium tracking-tight md:text-3xl">
          You end up{" "}
          <span className="text-fg-subtle">managing everybody else</span>
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
          Each person only sees their part of the job. You have to repeat the
          brief, answer the same questions and make sure the pieces still fit.
        </p>
      </motion.div>

      {/* The NAMI way â€” integrated */}
      <motion.div
        variants={blurUp}
        className="glass-refractive relative overflow-hidden rounded-3xl p-8 md:p-10"
      >
        <div
          aria-hidden
          className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgb(255_0_188/0.2),transparent_70%)] blur-2xl"
        />
        <p className="mono-label text-accent/80">Working with me</p>
        <h3 className="mt-4 text-2xl font-medium tracking-tight md:text-3xl">
          One person from{" "}
          <span className="text-gradient">the first chat to launch</span>
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
          I understand how the whole job fits together. The words match the
          design, the website supports the offer and the follow-ups do not get
          forgotten.
        </p>
      </motion.div>
    </motion.div>
  );
}
