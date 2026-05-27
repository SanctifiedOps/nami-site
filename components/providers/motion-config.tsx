"use client";

import { MotionConfig } from "motion/react";
import { type ReactNode } from "react";

/**
 * Site-wide Motion configuration. `reducedMotion="user"` makes every
 * motion/react animation honour the OS "reduce motion" setting automatically,
 * covering the JS-driven reveals (scroll spotlights, metric bands, staggered
 * lists) that the global CSS `prefers-reduced-motion` rule can't reach.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
