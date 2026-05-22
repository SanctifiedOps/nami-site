"use client";

import { motion } from "motion/react";
import { stage, fadeUp } from "@/lib/motion";

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
          What founders actually face
        </motion.p>
        <motion.p
          className="mx-auto max-w-3xl text-center text-[clamp(1.25rem,2.8vw,2rem)] font-medium leading-tight tracking-tight text-fg"
          variants={fadeUp}
        >
          Your brand is stitched together. Your marketing is inconsistent. Your tracking is fragmented. And you&apos;re the one{" "}
          <span className="text-gradient">holding it all together.</span>
        </motion.p>
        <motion.p
          className="mx-auto mt-6 max-w-xl text-center text-fg-muted md:text-lg"
          variants={fadeUp}
        >
          We build self-sustaining creative ecosystems. So your brand, content, and systems run as one, backing you up as you scale.
        </motion.p>
      </motion.div>
    </section>
  );
}
