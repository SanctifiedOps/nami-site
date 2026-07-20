"use client";

import { motion } from "motion/react";
import { stage, fadeUp } from "@/lib/motion";
import { LetterReveal } from "@/components/motion/letter-reveal";
import { cn } from "@/lib/utils";

type Props = {
  /** Retained for existing callers; no longer rendered as a visual eyebrow. */
  index?: string;
  title: React.ReactNode;
  lead?: string;
  align?: "left" | "center";
  className?: string;
};

/** Homepage section header without decorative eyebrow labels. */
export function SectionIntro({
  title,
  lead,
  align = "left",
  className,
}: Props) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      variants={stage}
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      <motion.h2
        className="text-4xl font-semibold leading-[0.98] tracking-tight md:text-6xl md:leading-[0.96]"
        variants={fadeUp}
      >
        <LetterReveal stagger={0.014} duration={0.65}>
          {title}
        </LetterReveal>
      </motion.h2>
      {lead && (
        <motion.p
          className="mt-6 text-lg leading-relaxed text-fg-muted md:text-xl"
          variants={fadeUp}
        >
          {lead}
        </motion.p>
      )}
    </motion.div>
  );
}
