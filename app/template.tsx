"use client";

import { motion, useReducedMotion } from "motion/react";
import { type ReactNode } from "react";

/**
 * Per-route enter animation. `template.tsx` remounts on every navigation, so
 * each page arrives with a short cinematic rise + fade instead of a hard cut.
 * Transform/opacity only (GPU-cheap), kept under 0.6s so navigation still
 * feels instant. Disabled entirely under reduced motion.
 */
export default function Template({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();

  if (reduced) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
