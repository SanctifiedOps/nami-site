"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * Hero atmospheric backdrop — three large blurred gradient orbs that drift
 * on infinite loops, layered with a vignette and SVG noise grain. Builds
 * the "ethereal and premium" feel of the hero. No-ops drift on reduced motion.
 */
export function HeroAtmosphere() {
  const reduced = useReducedMotion();

  const drift = (
    keyframes: { x: number[]; y: number[]; scale: number[] },
  ) => (reduced ? undefined : keyframes);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {/* Magenta — top-left, large */}
      <motion.div
        className="absolute rounded-full"
        style={{
          left: "-15%",
          top: "-10%",
          width: "70vw",
          height: "70vw",
          maxWidth: "1200px",
          maxHeight: "1200px",
          filter: "blur(110px)",
          background:
            "radial-gradient(circle, rgb(230 50 175 / 0.42), rgb(230 50 175 / 0.12) 40%, transparent 65%)",
        }}
        animate={drift({
          x: [0, 80, -40, 0],
          y: [0, -60, 40, 0],
          scale: [1, 1.1, 0.95, 1],
        })}
        transition={{ duration: 28, ease: "easeInOut", repeat: Infinity }}
      />

      {/* Cyan — right side, mid */}
      <motion.div
        className="absolute rounded-full"
        style={{
          right: "-10%",
          top: "30%",
          width: "60vw",
          height: "60vw",
          maxWidth: "1000px",
          maxHeight: "1000px",
          filter: "blur(110px)",
          background:
            "radial-gradient(circle, rgb(100 200 255 / 0.32), rgb(100 200 255 / 0.08) 40%, transparent 65%)",
        }}
        animate={drift({
          x: [0, -70, 50, 0],
          y: [0, 50, -30, 0],
          scale: [1, 0.92, 1.12, 1],
        })}
        transition={{
          duration: 32,
          ease: "easeInOut",
          repeat: Infinity,
          delay: 2,
        }}
      />

      {/* Magenta — bottom, smaller */}
      <motion.div
        className="absolute rounded-full"
        style={{
          left: "30%",
          bottom: "-20%",
          width: "55vw",
          height: "55vw",
          maxWidth: "900px",
          maxHeight: "900px",
          filter: "blur(120px)",
          background:
            "radial-gradient(circle, rgb(230 50 175 / 0.28), rgb(100 200 255 / 0.1) 40%, transparent 65%)",
        }}
        animate={drift({
          x: [0, -50, 70, 0],
          y: [0, 40, -50, 0],
          scale: [1, 1.05, 0.9, 1],
        })}
        transition={{
          duration: 36,
          ease: "easeInOut",
          repeat: Infinity,
          delay: 4,
        }}
      />

      {/* Vignette — darker at edges to focus content centre */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgb(12 13 15 / 0.4) 70%, rgb(12 13 15 / 0.85) 100%)",
        }}
      />

      {/* Grain — fine SVG noise at low opacity for surface texture */}
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/></filter><rect width='200' height='200' filter='url(%23n)'/></svg>\")",
        }}
      />
    </div>
  );
}
