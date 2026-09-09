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
        className="type-section-title"
        variants={fadeUp}
      >
        <LetterReveal stagger={0.014} duration={0.65}>
          {title}
        </LetterReveal>
      </motion.h2>
      {lead && (
        <motion.p
          className="type-lead mt-6"
          variants={fadeUp}
        >
          {lead}
        </motion.p>
      )}
    </motion.div>
  );
}
