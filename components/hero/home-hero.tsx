"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { Magnetic } from "@/components/motion/magnetic";
import { VideoBackground } from "@/components/hero/video-background";
import { LetterReveal } from "@/components/motion/letter-reveal";
import { fadeUp, ctaPop } from "@/lib/motion";

export function HomeHero() {
  const reduced = useReducedMotion();

  const stageHero = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduced ? 0 : 0.12,
        delayChildren: reduced ? 0 : 0.15,
      },
    },
  };

  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden md:min-h-[92vh]">
      <VideoBackground src="wave-3.mp4" overlay={0.74} />

      <motion.div
        className="container-shell relative z-10 py-24 md:py-32 text-center"
        initial="hidden"
        animate="show"
        variants={stageHero}
      >
        <motion.p
          className="eyebrow mb-7 inline-flex items-center gap-3"
          variants={fadeUp}
        >
          <span className="relative inline-flex size-1.5">
            <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
          </span>
          Waves of Creative Impact
        </motion.p>

        <h1 className="mx-auto max-w-[20ch] text-5xl font-semibold leading-[1.1] tracking-tight md:text-7xl">
          <LetterReveal stagger={0.018} duration={0.8}>
            Your business shouldn&rsquo;t depend on you{" "}
            <span className="text-gradient sm:block">
              being in every room.
            </span>
          </LetterReveal>
        </h1>

        <motion.p
          className="mx-auto mt-10 max-w-xl text-lg text-fg-muted md:text-xl leading-relaxed"
          variants={fadeUp}
        >
          Self-sustaining creative ecosystems for founders. One creative
          partner across brand, content, and growth systems.
        </motion.p>

        <motion.div
          className="mt-12 flex flex-wrap items-center justify-center gap-2 md:gap-4"
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
            href="/work"
            className="group inline-flex items-center gap-2 rounded-full border border-line-strong px-8 py-4 text-sm font-semibold text-fg transition-colors duration-300 hover:bg-white/5 hover:border-accent"
          >
            See selected work
            <ArrowRight
              size={16}
              aria-hidden
              className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1"
            />
          </Link>
        </motion.div>

        <motion.div
          className="mx-auto mt-20 flex max-w-2xl flex-col items-center gap-4 border-t border-line pt-8 md:mt-28"
          variants={fadeUp}
        >
          <p className="eyebrow">Currently building</p>
          <p className="text-sm text-fg-subtle md:text-base">
            Brand systems · content engines · funnel websites · automation
            infrastructure for founders building something deliberate.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
