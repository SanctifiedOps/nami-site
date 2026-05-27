"use client";

import { motion } from "motion/react";
import { stage, blurUp } from "@/lib/motion";
import { LetterReveal } from "@/components/motion/letter-reveal";

type Props = {
  steps: string[];
  label?: string;
  heading?: React.ReactNode;
};

/**
 * The approach as a connected numbered sequence: sticky heading on the left,
 * steps threaded onto a vertical accent rail on the right. Replaces the flat
 * stack of numbered paragraphs.
 */
export function ApproachSteps({
  steps,
  label = "The approach",
  heading,
}: Props) {
  return (
    <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
      <div className="lg:sticky lg:top-28 lg:self-start">
        <p className="mono-label">{label}</p>
        <h2 className="mt-5 text-[clamp(2rem,4vw,3rem)] font-medium leading-[1.05] tracking-tight">
          <LetterReveal stagger={0.014} duration={0.65}>
            {heading ?? (
              <>
                How we <span className="text-gradient">built it.</span>
              </>
            )}
          </LetterReveal>
        </h2>
      </div>

      <motion.ol
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={stage}
        className="relative space-y-10"
      >
        <span
          aria-hidden
          className="absolute bottom-4 left-4 top-4 w-px bg-line"
        />
        {steps.map((step, i) => (
          <motion.li key={i} variants={blurUp} className="relative pl-14">
            <span
              aria-hidden
              className="glass-refractive absolute left-0 top-0 grid size-8 place-items-center rounded-full font-mono text-xs text-accent"
            >
              0{i + 1}
            </span>
            <p className="leading-relaxed text-fg-muted md:text-lg">{step}</p>
          </motion.li>
        ))}
      </motion.ol>
    </div>
  );
}
