"use client";

import { motion } from "motion/react";
import { stage, fadeUp, lineMask } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Props = {
  eyebrow: string;
  title: React.ReactNode;
  lead?: string;
  className?: string;
};

/** Inner-page hero: smaller than home, but still atmospheric */
export function PageHero({ eyebrow, title, lead, className }: Props) {
  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-line",
        className,
      )}
    >
      {/* atmospheric backdrop: single drifting magenta orb, lighter than home */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        <motion.div
          className="absolute"
          style={{
            left: "-10%",
            top: "-30%",
            width: "60vw",
            height: "60vw",
            maxWidth: "900px",
            maxHeight: "900px",
            filter: "blur(90px)",
            background:
              "radial-gradient(circle, rgb(230 50 175 / 0.4) 0%, rgb(100 200 255 / 0.15) 30%, transparent 65%)",
          }}
          animate={{
            x: [0, 60, -30, 0],
            y: [0, -40, 30, 0],
            scale: [1, 1.08, 0.95, 1],
          }}
          transition={{ duration: 24, ease: "easeInOut", repeat: Infinity }}
        />
        <div
          className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/></filter><rect width='200' height='200' filter='url(%23n)'/></svg>\")",
          }}
        />
      </div>

      <motion.div
        className="container-shell relative z-10 pt-36 pb-16 md:pt-48 md:pb-24"
        initial="hidden"
        animate="show"
        variants={stage}
      >
        <motion.p className="eyebrow mb-6" variants={fadeUp}>
          {eyebrow}
        </motion.p>
        <h1 className="max-w-[18ch] text-[clamp(2.25rem,5.5vw,5rem)] font-medium leading-[1.1] tracking-[-0.015em] pr-2">
          <span className="block overflow-y-hidden pb-1">
            <motion.span className="block" variants={lineMask}>
              {title}
            </motion.span>
          </span>
        </h1>
        {lead && (
          <motion.p
            className="mt-8 max-w-2xl text-lg text-fg-muted md:text-xl leading-relaxed"
            variants={fadeUp}
          >
            {lead}
          </motion.p>
        )}
      </motion.div>
    </section>
  );
}
