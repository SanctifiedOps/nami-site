"use client";

import { motion } from "motion/react";
import { stage, fadeUp } from "@/lib/motion";
import { LetterReveal } from "@/components/motion/letter-reveal";
import { cn } from "@/lib/utils";

type Props = {
  /** Mono instrument index, e.g. "01 / What we build". */
  index?: string;
  title: React.ReactNode;
  lead?: string;
  align?: "left" | "center";
  className?: string;
};

/**
 * Homepage section header. Uses a mono coordinate index instead of an
 * uppercase eyebrow — the numbered system is the deliberate rhythm, replacing
 * the eyebrow-on-every-section AI tell.
 */
export function SectionIntro({
  index,
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
      {index && (
        <motion.p className="mono-label mb-5" variants={fadeUp}>
          {index}
        </motion.p>
      )}
      <motion.h2
        className="text-4xl font-semibold leading-[1.1] tracking-tight md:text-6xl"
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
