"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { Magnetic } from "@/components/motion/magnetic";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export default function Home() {
  const reduced = useReducedMotion();

  // Choreography — eyebrow → headline line 1 → headline line 2 → subtitle → CTAs
  const stage: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduced ? 0 : 0.12,
        delayChildren: reduced ? 0 : 0.1,
      },
    },
  };

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: reduced ? 0 : 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: EASE_OUT_EXPO },
    },
  };

  const lineMask: Variants = {
    hidden: { y: reduced ? 0 : "110%" },
    show: {
      y: 0,
      transition: { duration: 0.95, ease: EASE_OUT_EXPO },
    },
  };

  const ctaPop: Variants = {
    hidden: { opacity: 0, y: reduced ? 0 : 12, scale: reduced ? 1 : 0.96 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.7, ease: EASE_OUT_EXPO },
    },
  };

  return (
    <>
      <section className="relative overflow-hidden pt-40 pb-32 md:pt-56 md:pb-48 lg:pt-64 lg:pb-56">
        {/* Ambient glow field — slowly drifts forever */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6, ease: EASE_OUT_EXPO }}
        >
          <motion.div
            className="absolute -left-[20%] top-[5%] h-[60vh] w-[60vw] rounded-full blur-[120px]"
            style={{
              background:
                "radial-gradient(circle, rgb(230 50 175 / 0.18), transparent 65%)",
            }}
            animate={
              reduced
                ? undefined
                : {
                    x: [0, 60, -20, 0],
                    y: [0, -40, 30, 0],
                    scale: [1, 1.08, 0.95, 1],
                  }
            }
            transition={{
              duration: 22,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          />
          <motion.div
            className="absolute -right-[10%] top-[40%] h-[55vh] w-[55vw] rounded-full blur-[120px]"
            style={{
              background:
                "radial-gradient(circle, rgb(100 200 255 / 0.12), transparent 65%)",
            }}
            animate={
              reduced
                ? undefined
                : {
                    x: [0, -50, 30, 0],
                    y: [0, 40, -20, 0],
                    scale: [1, 0.95, 1.1, 1],
                  }
            }
            transition={{
              duration: 26,
              ease: "easeInOut",
              repeat: Infinity,
              delay: 2,
            }}
          />
          {/* grain overlay */}
          <div
            className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/></filter><rect width='200' height='200' filter='url(%23n)'/></svg>\")",
            }}
          />
        </motion.div>

        <motion.div
          className="container-shell"
          initial="hidden"
          animate="show"
          variants={stage}
        >
          <motion.p className="eyebrow mb-8" variants={fadeUp}>
            <span className="inline-block size-1.5 rounded-full bg-accent mr-3 align-middle animate-pulse" />
            NAMI Creative
          </motion.p>

          <h1 className="max-w-[15ch] text-[clamp(3.5rem,9vw,9.5rem)] font-medium leading-[0.92] tracking-[-0.035em]">
            <span className="block overflow-hidden pb-2">
              <motion.span className="block" variants={lineMask}>
                Creative systems
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-2">
              <motion.span className="block" variants={lineMask}>
                built for{" "}
                <span className="font-serif italic font-normal text-gradient">
                  real-world
                </span>
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-2">
              <motion.span
                className="block font-serif italic font-normal text-gradient"
                variants={lineMask}
              >
                momentum.
              </motion.span>
            </span>
          </h1>

          <motion.p
            className="mt-10 max-w-xl text-lg text-fg-muted md:text-xl leading-relaxed"
            variants={fadeUp}
          >
            Brand, content, and systems — wired into one cohesive structure
            that holds while you scale.
          </motion.p>

          <motion.div
            className="mt-12 flex flex-wrap items-center gap-2 md:gap-4"
            variants={ctaPop}
          >
            <Magnetic>
              <Link
                href="/contact"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-accent px-8 py-4 text-sm font-semibold text-white shadow-[0_4px_20px_rgb(230_50_175/0.3)] transition-shadow duration-500 hover:shadow-[0_8px_40px_rgb(230_50_175/0.5)]"
              >
                <span className="absolute inset-0 -z-10 translate-y-full bg-accent-soft transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-y-0" />
                Start a project
                <ArrowUpRight
                  size={16}
                  aria-hidden
                  className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </Magnetic>

            <Link
              href="/services"
              className="group inline-flex items-center gap-2 rounded-full border border-line-strong px-8 py-4 text-sm font-semibold text-fg transition-colors duration-300 hover:bg-white/5 hover:border-accent"
            >
              Explore the work
              <ArrowRight
                size={16}
                aria-hidden
                className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1"
              />
            </Link>
          </motion.div>

          {/* hairline + caption row */}
          <motion.div
            className="mt-24 grid gap-6 border-t border-line pt-8 md:grid-cols-[auto_1fr] md:items-end md:gap-12"
            variants={fadeUp}
          >
            <p className="eyebrow">Currently building</p>
            <p className="max-w-md text-sm text-fg-subtle md:text-base">
              Brand systems · content engines · funnel websites · automation
              infrastructure for founders building something deliberate.
            </p>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}
