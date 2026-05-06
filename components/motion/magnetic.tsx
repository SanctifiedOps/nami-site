"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type MagneticProps = {
  children: ReactNode;
  /** how strongly the wrapped element follows the cursor (0 to 1) */
  strength?: number;
  /** how far outside the element the magnetic field reaches, in px */
  field?: number;
  className?: string;
};

/**
 * Wraps a CTA in a magnetic field. Element subtly leans toward the cursor
 * when the pointer enters its bounding box (extended by `field` px).
 * No-ops on touch and reduced-motion.
 */
export function Magnetic({
  children,
  strength = 0.35,
  field = 28,
  className,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { damping: 18, stiffness: 220, mass: 0.4 });
  const sy = useSpring(y, { damping: 18, stiffness: 220, mass: 0.4 });
  const reduced = useReducedMotion();

  const handleMove = (e: React.PointerEvent) => {
    if (reduced || !ref.current || e.pointerType === "touch") return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * strength);
    y.set((e.clientY - cy) * strength);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy, padding: field, margin: -field }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={cn("inline-block", className)}
    >
      {children}
    </motion.div>
  );
}
