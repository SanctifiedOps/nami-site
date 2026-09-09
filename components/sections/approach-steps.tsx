"use client";

import { motion } from "motion/react";
import { stage, blurUp } from "@/lib/motion";
import { LetterReveal } from "@/components/motion/letter-reveal";

type Props = {
  steps: { title: string; body: string }[];
  label?: string;
  heading?: React.ReactNode;
};

/**
 * A compact, readable account of how the work was approached.
 */
export function ApproachSteps({
  steps,
  label = "The approach",
  heading,
}: Props) {
  return (
    <div>
      <div className="mx-auto max-w-3xl text-center">
        <p className="mono-label">{label}</p>
        <h2 className="mt-5 type-section-title">
          <LetterReveal stagger={0.014} duration={0.65}>
            {heading ?? (
              <>
                How we <span className="text-gradient">built it</span>
              </>
            )}
          </LetterReveal>
        </h2>
      </div>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={stage}
        className="mt-12 grid gap-4 md:mt-16 md:grid-cols-3"
      >
        {steps.map((step, i) => (
          <motion.article
            key={step.title}
            variants={blurUp}
            className={`border border-line bg-surface-1/55 p-6 transition-[transform,border-color,background-color,box-shadow] duration-700 ease-[var(--ease-out-expo)] hover:-translate-y-1.5 hover:border-accent/35 hover:shadow-[0_18px_48px_rgb(0_0_0/0.24)] motion-reduce:transform-none md:p-8 ${
              i === 1
                ? "bg-[linear-gradient(145deg,rgb(255_0_188/0.08),rgb(19_20_24/0.7)_58%)] md:-translate-y-3"
                : ""
            }`}
          >
            <h3 className="type-card-title">{step.title}</h3>
            <p className="mt-4 leading-relaxed text-fg-muted">{step.body}</p>
          </motion.article>
        ))}
      </motion.div>
    </div>
  );
}
