"use client";

import { motion } from "motion/react";
import { stage, fadeUp } from "@/lib/motion";

const PILLARS = ["Brand", "Content", "Systems"] as const;

export function PositioningBand() {
  return (
    <section className="relative border-y border-line bg-surface-1/40 py-12 md:py-16">
      <motion.div
        className="container-shell"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        variants={stage}
      >
        <motion.p
          className="eyebrow mb-6 text-center"
          variants={fadeUp}
        >
          The structure
        </motion.p>
        <motion.div
          className="flex flex-col items-center justify-center gap-3 text-[clamp(1.75rem,4vw,3rem)] font-medium leading-[1.1] tracking-tight md:flex-row md:gap-6"
          variants={fadeUp}
        >
          {PILLARS.map((pillar, i) => (
            <span key={pillar} className="flex items-center gap-3 md:gap-6">
              <span className="text-fg">{pillar}</span>
              {i < PILLARS.length - 1 && (
                <span className="text-accent" aria-hidden>
                  +
                </span>
              )}
            </span>
          ))}
        </motion.div>
        <motion.p
          className="mx-auto mt-6 max-w-xl text-center text-fg-muted md:text-lg"
          variants={fadeUp}
        >
          Wired into one cohesive structure that supports growth.
        </motion.p>
      </motion.div>
    </section>
  );
}
