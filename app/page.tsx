"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { Magnetic } from "@/components/motion/magnetic";
import { HeroAtmosphere } from "@/components/hero/atmosphere";
import { HeroParticles } from "@/components/hero/particles";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export default function Home() {
  const reduced = useReducedMotion();

  const stage: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduced ? 0 : 0.12,
        delayChildren: reduced ? 0 : 0.15,
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
    hidden: { y: reduced ? 0 : "108%" },
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
    <section className="relative flex min-h-[92vh] items-center overflow-hidden">
      <HeroAtmosphere />
      <HeroParticles />

      <motion.div
        className="container-shell relative z-10 py-24 md:py-32"
        initial="hidden"
        animate="show"
        variants={stage}
      >
        <motion.p
          className="eyebrow mb-7 inline-flex items-center gap-3"
          variants={fadeUp}
        >
          <span className="relative inline-flex size-1.5">
            <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
          </span>
          NAMI Creative
        </motion.p>

        <h1 className="max-w-[18ch] text-[clamp(2.5rem,6vw,5.75rem)] font-medium leading-[1.02] tracking-[-0.025em]">
          <span className="block overflow-hidden pb-1">
            <motion.span className="block" variants={lineMask}>
              Creative systems
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-1">
            <motion.span className="block" variants={lineMask}>
              built for
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-2">
            <motion.span
              className="block font-serif italic font-normal text-gradient"
              variants={lineMask}
            >
              real-world momentum.
            </motion.span>
          </span>
        </h1>

        <motion.p
          className="mt-10 max-w-xl text-lg text-fg-muted md:text-xl leading-relaxed"
          variants={fadeUp}
        >
          Brand, content, and systems — wired into one cohesive structure that
          holds while you scale.
        </motion.p>

        <motion.div
          className="mt-12 flex flex-wrap items-center gap-2 md:gap-4"
          variants={ctaPop}
        >
          <Magnetic>
            <Link
              href="/contact"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-accent px-8 py-4 text-sm font-semibold text-white shadow-[0_4px_20px_rgb(230_50_175/0.3)] transition-shadow duration-500 hover:shadow-[0_8px_40px_rgb(230_50_175/0.55)]"
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

        <motion.div
          className="mt-20 grid gap-6 border-t border-line pt-8 md:mt-28 md:grid-cols-[auto_1fr] md:items-end md:gap-12"
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
  );
}
