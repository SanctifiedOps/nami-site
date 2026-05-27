"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { HeroParticles } from "./particles";

type Props = {
  /** Render the drifting particle field. Default true. */
  particles?: boolean;
};

/**
 * Reusable reactive hero atmosphere: magenta + cyan light fields that lean
 * toward the cursor (additive over a dark/video backdrop) plus the drifting
 * particle motes. Self-contained — drop it into any hero section as an
 * absolute layer. No-ops under reduced motion (particles self-disable too).
 */
export function HeroLights({ particles = true }: Props) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 60, damping: 20, mass: 0.5 });
  const smy = useSpring(my, { stiffness: 60, damping: 20, mass: 0.5 });
  const aX = useTransform(smx, [-1, 1], [-28, 28]);
  const aY = useTransform(smy, [-1, 1], [-22, 22]);
  const bX = useTransform(smx, [-1, 1], [24, -24]);
  const bY = useTransform(smy, [-1, 1], [18, -18]);

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      const r = ref.current?.getBoundingClientRect();
      if (!r || r.height === 0) return;
      mx.set(((e.clientX - r.left) / r.width - 0.5) * 2);
      my.set(((e.clientY - r.top) / r.height - 0.5) * 2);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced, mx, my]);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 z-0">
      <div className="absolute inset-0 mix-blend-screen">
        <motion.div
          style={{ x: aX, y: aY }}
          className="absolute -left-[10%] top-[-12%] h-[46vh] w-[46vh] rounded-full blur-[100px]"
        >
          <div className="h-full w-full rounded-full bg-[radial-gradient(circle,rgb(255_0_188/0.4),transparent_68%)]" />
        </motion.div>
        <motion.div
          style={{ x: bX, y: bY }}
          className="absolute -right-[8%] bottom-[-22%] h-[42vh] w-[42vh] rounded-full blur-[110px]"
        >
          <div className="h-full w-full rounded-full bg-[radial-gradient(circle,rgb(100_200_255/0.3),transparent_68%)]" />
        </motion.div>
      </div>
      {particles && <HeroParticles />}
    </div>
  );
}
