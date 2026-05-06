"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { Magnetic } from "@/components/motion/magnetic";
import { HeroAtmosphere } from "@/components/hero/atmosphere";
import { HeroParticles } from "@/components/hero/particles";
import { SectionHeading } from "@/components/sections/section-heading";
import { ServicesGrid } from "@/components/sections/services-grid";
import { ProcessList } from "@/components/sections/process-list";
import { FAQAccordion } from "@/components/sections/faq-accordion";
import { PositioningBand } from "@/components/sections/positioning-band";
import { WorkGrid } from "@/components/sections/work-grid";
import { fadeUp, lineMask, ctaPop } from "@/lib/motion";

export default function Home() {
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
    <>
      {/* HERO */}
      <section className="relative flex min-h-[92vh] items-center overflow-hidden">
        <HeroAtmosphere />
        <HeroParticles />

        <motion.div
          className="container-shell relative z-10 py-24 md:py-32"
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
            NAMI Creative
          </motion.p>

          <h1 className="max-w-[22ch] text-[clamp(2.5rem,6vw,5.75rem)] font-medium leading-[1.05] tracking-[-0.015em] pr-2">
            <span className="block overflow-y-hidden pb-1">
              <motion.span className="block" variants={lineMask}>
                Creative systems
              </motion.span>
            </span>
            <span className="block overflow-y-hidden pb-1">
              <motion.span className="block" variants={lineMask}>
                built for{" "}
                <span className="text-gradient">
                  real-world
                </span>
              </motion.span>
            </span>
            <span className="block overflow-y-hidden pb-2">
              <motion.span
                className="block text-gradient"
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
            Waves of creative impact. Brand, content, and systems built to move
            together and hold while you scale.
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

      <PositioningBand />

      {/* SERVICES */}
      <section className="container-shell py-24 md:py-36">
        <div className="mb-16 grid gap-8 md:grid-cols-[2fr_1fr] md:items-end md:gap-16 md:mb-20">
          <SectionHeading
            eyebrow="What we build"
            title={
              <>
                Five pillars that hold the brand,{" "}
                <span className="text-gradient">
                  end to end.
                </span>
              </>
            }
          />
          <p className="text-fg-muted md:text-lg leading-relaxed">
            Most studios pick one. We integrate all five so the work stops
            fragmenting and starts compounding.
          </p>
        </div>
        <ServicesGrid />
      </section>

      {/* PROCESS */}
      <section className="container-shell py-24 md:py-36 border-t border-line">
        <div className="mb-16 grid gap-8 md:grid-cols-[2fr_1fr] md:items-end md:gap-16 md:mb-20">
          <SectionHeading
            eyebrow="How we work"
            title={
              <>
                A process that gets you{" "}
                <span className="text-gradient">
                  to launch.
                </span>
              </>
            }
          />
          <p className="text-fg-muted md:text-lg leading-relaxed">
            Four phases: discovery, design, launch, and ongoing partnership.
            Tight enough to ship, deep enough to last.
          </p>
        </div>
        <ProcessList />
      </section>

      {/* SELECTED WORK */}
      <section className="container-shell py-24 md:py-36 border-t border-line">
        <div className="mb-16 grid gap-8 md:grid-cols-[2fr_1fr] md:items-end md:gap-16 md:mb-20">
          <SectionHeading
            eyebrow="Selected work"
            title={
              <>
                Brands and systems built{" "}
                <span className="text-gradient">
                  to compound.
                </span>
              </>
            }
          />
          <p className="text-fg-muted md:text-lg leading-relaxed">
            Four engagements where brand, product, and infrastructure shipped
            together. Community at scale, on-chain intelligence, members-only
            experiences, and high-conversion funnels.
          </p>
        </div>

        <WorkGrid />

        <div className="mt-16 flex items-center justify-center md:mt-20">
          <Link
            href="/work"
            className="group inline-flex items-center gap-2 rounded-full border border-line-strong px-7 py-4 text-sm font-semibold text-fg transition-colors duration-300 hover:bg-white/5 hover:border-accent"
          >
            See every case study
            <ArrowUpRight
              size={14}
              aria-hidden
              className="transition-transform duration-500 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-shell py-24 md:py-36 border-t border-line">
        <div className="mb-12 grid gap-8 md:grid-cols-[2fr_1fr] md:items-end md:gap-16 md:mb-16">
          <SectionHeading
            eyebrow="Common questions"
            title={
              <>
                Before we get on a{" "}
                <span className="text-gradient">
                  call together.
                </span>
              </>
            }
          />
          <p className="text-fg-muted md:text-lg leading-relaxed">
            Quick answers to the questions we get most. Anything else, drop us
            a line.
          </p>
        </div>
        <FAQAccordion />
      </section>
    </>
  );
}
