"use client";

import { motion } from "motion/react";
import { type ReactNode } from "react";
import { fadeUp, blurUp, clipUp, cardIn } from "@/lib/motion";
import { cn } from "@/lib/utils";

const VARIANTS = {
  fade: fadeUp,
  blur: blurUp,
  clip: clipUp,
  rise: cardIn,
} as const;

type Props = {
  children: ReactNode;
  /** Entrance flavour. Default `blur` (cinematic de-blur rise). */
  variant?: keyof typeof VARIANTS;
  className?: string;
  /** Extra delay (s) layered on top of the variant's own timing. */
  delay?: number;
  /** Fraction of the element that must be in view to trigger. */
  amount?: number;
  /** Re-animate every time it enters (default false: once). */
  repeat?: boolean;
};

/**
 * Single-block scroll reveal with a choice of entrance so the page stops
 * reading as one monotone fade-up. Wraps the shared variants in lib/motion;
 * reduced-motion is handled there (variants resolve to no-op transforms when
 * the OS requests it via Motion's reduced-motion handling).
 */
export function Reveal({
  children,
  variant = "blur",
  className,
  delay = 0,
  amount = 0.3,
  repeat = false,
}: Props) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: !repeat, amount }}
      variants={VARIANTS[variant]}
      transition={{ delay }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
