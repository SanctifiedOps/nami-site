"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { Magnetic } from "@/components/motion/magnetic";
import { ctaNav } from "@/lib/nav";
import { stage, fadeUp } from "@/lib/motion";

/**
 * Cinematic closing moment. Instrument grid + an accent light bloom behind a
 * centred statement and a magnetic CTA — the last thing a visitor sees before
 * the sitemap.
 */
export function FooterCta() {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div aria-hidden className="hairline-grid absolute inset-0 opacity-40" />
      <div
        aria-hidden
        className="absolute -bottom-40 left-1/2 h-80 w-[72rem] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgb(255_0_188/0.16),transparent_70%)] blur-3xl"
      />
      <motion.div
        className="container-shell relative py-24 text-center md:py-36"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={stage}
      >
        <motion.p className="mono-label" variants={fadeUp}>
          Build with us
        </motion.p>
        <motion.h2
          className="mx-auto mt-6 max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl lg:text-7xl"
          variants={fadeUp}
        >
          Ready to build something{" "}
          <span className="text-gradient sm:block">that lasts?</span>
        </motion.h2>
        <motion.p
          className="mx-auto mt-8 max-w-xl leading-relaxed text-fg-muted md:text-lg"
          variants={fadeUp}
        >
          Self-sustaining creative ecosystems for founders. One creative partner
          across brand, content, and growth systems, so your business stops
          depending on you being in every room.
        </motion.p>
        <motion.div className="mt-12 flex justify-center" variants={fadeUp}>
          <Magnetic>
            <Link
              href={ctaNav.href}
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-accent px-9 py-4 text-sm font-semibold text-white shadow-[0_4px_20px_rgb(255_0_188/0.3)] transition-shadow duration-500 hover:shadow-[0_8px_40px_rgb(255_0_188/0.55)]"
            >
              <span className="absolute inset-0 -z-10 translate-y-full bg-accent-soft transition-transform duration-500 ease-out-expo group-hover:translate-y-0" />
              Start a project
              <ArrowUpRight
                size={16}
                aria-hidden
                className="transition-transform duration-500 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </Magnetic>
        </motion.div>
      </motion.div>
    </section>
  );
}
