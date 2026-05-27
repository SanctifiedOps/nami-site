"use client";

import { motion } from "motion/react";
import { stage, fadeUp, blurUp } from "@/lib/motion";

export function PositioningBand() {
  return (
    <section className="relative overflow-hidden border-y border-line bg-surface-1/40 py-20 md:py-28">
      <div aria-hidden className="hairline-grid absolute inset-0 opacity-50" />
      <div
        aria-hidden
        className="absolute left-1/2 top-0 h-64 w-[60rem] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgb(255_0_188/0.12),transparent_70%)] blur-2xl"
      />
      <motion.div
        className="container-shell relative"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        variants={stage}
      >
        <motion.p
          className="mx-auto max-w-3xl text-center text-[clamp(1.4rem,3vw,2.25rem)] font-medium leading-tight tracking-tight text-fg"
          variants={blurUp}
        >
          Your brand is stitched together. Your marketing is inconsistent. Your
          tracking is fragmented. And you&apos;re the one{" "}
          <span className="text-gradient">holding it all together.</span>
        </motion.p>
        <motion.p
          className="mx-auto mt-6 max-w-xl text-center text-fg-muted md:text-lg"
          variants={fadeUp}
        >
          We build self-sustaining creative ecosystems. So your brand, content,
          and systems run as one, backing you up as you scale.
        </motion.p>
      </motion.div>
    </section>
  );
}
