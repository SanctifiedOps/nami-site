"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * Hero atmospheric backdrop: large drifting gradient orbs + grain.
 * No vignette (was darkening orbs at corners), explicit z-0 so it sits
 * above the surface bg but below content (z-10).
 */
export function HeroAtmosphere() {
  const reduced = useReducedMotion();

  const drift = (kf: { x: number[]; y: number[]; scale: number[] }) =>
    reduced ? undefined : kf;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {/* Magenta: top-left */}
      <motion.div
        className="absolute"
        style={{
          left: "-10%",
          top: "-10%",
          width: "75vw",
          height: "75vw",
          maxWidth: "1400px",
          maxHeight: "1400px",
          filter: "blur(90px)",
          background:
            "radial-gradient(circle, rgb(230 50 175 / 0.7) 0%, rgb(230 50 175 / 0.3) 25%, transparent 60%)",
        }}
        animate={drift({
          x: [0, 80, -40, 0],
          y: [0, -60, 40, 0],
          scale: [1, 1.1, 0.95, 1],
        })}
        transition={{ duration: 28, ease: "easeInOut", repeat: Infinity }}
      />

      {/* Cyan: right */}
      <motion.div
        className="absolute"
        style={{
          right: "-15%",
          top: "10%",
          width: "70vw",
          height: "70vw",
          maxWidth: "1300px",
          maxHeight: "1300px",
          filter: "blur(90px)",
          background:
            "radial-gradient(circle, rgb(100 200 255 / 0.55) 0%, rgb(100 200 255 / 0.22) 28%, transparent 60%)",
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

      {/* Magenta + cyan blend: bottom centre */}
      <motion.div
        className="absolute"
        style={{
          left: "20%",
          bottom: "-20%",
          width: "60vw",
          height: "60vw",
          maxWidth: "1100px",
          maxHeight: "1100px",
          filter: "blur(100px)",
          background:
            "radial-gradient(circle, rgb(230 50 175 / 0.5) 0%, rgb(100 200 255 / 0.22) 35%, transparent 65%)",
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

      {/* Grain: fine SVG noise */}
      <div
        className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/></filter><rect width='200' height='200' filter='url(%23n)'/></svg>\")",
        }}
      />
    </div>
  );
}
