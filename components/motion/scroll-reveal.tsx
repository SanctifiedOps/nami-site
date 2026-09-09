"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  effect?: "fade-up" | "zoom";
  delay?: number;
};

export function ScrollReveal({
  children,
  className,
  effect = "fade-up",
  delay = 0,
}: Props) {
  const reduceMotion = useReducedMotion();
  const initial =
    effect === "zoom"
      ? { opacity: 0, scale: 0.96 }
      : { opacity: 0, y: 36 };

  return (
    <motion.div
      initial={reduceMotion ? false : initial}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{
        duration: 0.75,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
