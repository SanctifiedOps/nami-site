"use client";

import { motion } from "motion/react";
import { stage, fadeUp } from "@/lib/motion";
import { LetterReveal } from "@/components/motion/letter-reveal";
import { VideoBackground } from "@/components/hero/video-background";
import { HeroLights } from "@/components/hero/hero-lights";
import { cn } from "@/lib/utils";

type Props = {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: string;
  className?: string;
  /** Optional content rendered below the lead, inside the hero stack */
  children?: React.ReactNode;
};

/** Inner-page hero: video background + letter-reveal title */
export function PageHero({ title, lead, className, children }: Props) {
  return (
    <section
      className={cn(
        "relative flex min-h-[calc(100svh-5rem)] items-center overflow-hidden border-b border-line",
        className,
      )}
    >
      <VideoBackground src="wave-3.mp4" overlay={0.78} />
      <HeroLights />

      {/* Blend hero into the section below */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-32 bg-linear-to-b from-transparent to-surface-0"
      />

      <motion.div
        className="container-shell relative z-10 pt-28 pb-20 text-center md:pt-32 md:pb-24"
        initial="hidden"
        animate="show"
        variants={stage}
      >
        <h1 className="mx-auto max-w-4xl text-balance text-[clamp(1.8rem,3.7vw,3.15rem)] font-semibold leading-[1.03] tracking-tight md:leading-[1]">
          <LetterReveal>{title}</LetterReveal>
        </h1>
        {lead && (
          <motion.p
            className="mx-auto mt-7 max-w-2xl text-base leading-[1.35] text-fg-muted md:mt-8 md:text-lg"
            variants={fadeUp}
          >
            {lead}
          </motion.p>
        )}
        {children && (
          <motion.div className="mt-9 flex justify-center" variants={fadeUp}>
            {children}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
