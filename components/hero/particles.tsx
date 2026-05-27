"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

type Particle = {
  id: number;
  size: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
  yDrift: number;
  xDrift: number;
  baseOpacity: number;
  isCyan: boolean;
};


/**
 * Floating particle field for the hero: small magenta and cyan motes
 * with bloom shadows, drifting on long infinite loops. Generated client-side
 * to avoid SSR/hydration mismatch. Disabled under reduced motion.
 */
export function HeroParticles() {
  const reduced = useReducedMotion();
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (reduced) return;
    // No particles on mobile — the bloom shadows are the expensive part. Desktop only.
    if (window.innerWidth < 768) return;
    setParticles(
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        size: Math.random() * 2 + 1, // 1–3px
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 18 + 18, // 18–36s
        delay: Math.random() * 12,
        yDrift: (Math.random() - 0.5) * 80, // -40 to 40
        xDrift: (Math.random() - 0.5) * 60, // -30 to 30
        baseOpacity: Math.random() * 0.5 + 0.25, // 0.25–0.75
        isCyan: i % 4 === 0, // ~25% cyan, 75% magenta
      })),
    );
  }, [reduced]);

  if (reduced || particles.length === 0) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {particles.map((p) => {
        const colour = p.isCyan ? "rgb(100 200 255)" : "rgb(255 0 188)";
        return (
          <motion.span
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              backgroundColor: colour,
              boxShadow: `0 0 ${p.size * 6}px ${colour}, 0 0 ${p.size * 12}px ${colour}`,
            }}
            initial={{ opacity: 0 }}
            animate={{
              y: [0, p.yDrift, 0],
              x: [0, p.xDrift, 0],
              opacity: [0, p.baseOpacity, p.baseOpacity * 0.4, p.baseOpacity, 0],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </div>
  );
}
