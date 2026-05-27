"use client";

import { motion } from "motion/react";
import { stage, fadeUp } from "@/lib/motion";
import { LetterReveal } from "@/components/motion/letter-reveal";
import { VideoBackground } from "@/components/hero/video-background";
import { HeroLights } from "@/components/hero/hero-lights";
import { cn } from "@/lib/utils";

type Props = {
  eyebrow: string;
  title: React.ReactNode;
  lead?: string;
  className?: string;
  /** Optional content rendered below the lead, inside the hero stack */
  children?: React.ReactNode;
};

/** Inner-page hero: video background + letter-reveal title */
export function PageHero({ eyebrow, title, lead, className, children }: Props) {
  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-line",
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
        className="container-shell relative z-10 pt-36 pb-16 md:pt-48 md:pb-24 text-center"
        initial="hidden"
        animate="show"
        variants={stage}
      >
        <motion.p className="eyebrow mb-6" variants={fadeUp}>
          {eyebrow}
        </motion.p>
        <h1 className="mx-auto max-w-[20ch] text-4xl font-semibold leading-[1.1] tracking-tight md:text-6xl">
          <LetterReveal>{title}</LetterReveal>
        </h1>
        {lead && (
          <motion.p
            className="mx-auto mt-8 max-w-2xl text-lg text-fg-muted md:text-xl leading-relaxed"
            variants={fadeUp}
          >
            {lead}
          </motion.p>
        )}
        {children && (
          <motion.div className="mt-10 flex justify-center" variants={fadeUp}>
            {children}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
