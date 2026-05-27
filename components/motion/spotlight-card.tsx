"use client";

import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useSpring,
  useReducedMotion,
} from "motion/react";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
  /** Max tilt in degrees. 0 disables the 3D parallax. */
  tilt?: number;
  /** Spotlight glow alpha (0–1). */
  glow?: number;
  /** Glow colour as an "r g b" triplet. Defaults to brand magenta. */
  glowColor?: string;
  /** Spotlight radius in px. */
  radius?: number;
};

/**
 * The bespoke hover surface. A pointer-tracked radial spotlight follows the
 * cursor across the card, paired with a subtle spring 3D tilt. One shared
 * interaction vocabulary for every elevated surface on the site. No-ops on
 * touch and reduced-motion. Consumers render their own bordered surface as a
 * child (kept on a higher stacking layer); the spotlight sits above it.
 */
export function SpotlightCard({
  children,
  className,
  tilt = 5,
  glow = 0.18,
  glowColor = "255 0 188",
  radius = 440,
}: Props) {
  const reduced = useReducedMotion();

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { damping: 18, stiffness: 220 });
  const sry = useSpring(ry, { damping: 18, stiffness: 220 });

  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const background = useMotionTemplate`radial-gradient(${radius}px circle at ${mx}% ${my}%, rgb(${glowColor} / ${glow}), transparent 62%)`;

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || e.pointerType === "touch") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    mx.set(px * 100);
    my.set(py * 100);
    if (tilt) {
      ry.set((px - 0.5) * 2 * tilt);
      rx.set(-(py - 0.5) * 2 * tilt);
    }
  };

  const handleLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      style={
        tilt
          ? { rotateX: srx, rotateY: sry, transformPerspective: 1200 }
          : undefined
      }
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={cn("group relative", className)}
    >
      <motion.div
        aria-hidden
        style={{ background }}
        className="pointer-events-none absolute inset-0 z-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
      {children}
    </motion.div>
  );
}
