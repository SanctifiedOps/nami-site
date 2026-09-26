"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
  effect?: "fade-up" | "zoom";
  delay?: number;
};

/** Shared on-scroll entrance for Network sections and reusable page blocks. */
export function ScrollReveal({ children, className, effect = "fade-up", delay = 0 }: Props) {
  const reduceMotion = useReducedMotion();
  const initial = effect === "zoom" ? { opacity: 0, scale: 0.96 } : { opacity: 0, y: 24 };

  return (
    <motion.div
      className={cn(className)}
      initial={reduceMotion ? false : initial}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.7, delay, ease: EASE_OUT_EXPO }}
    >
      {children}
    </motion.div>
  );
}
