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
import { stage, fadeUp, lineMask, ctaPop } from "@/lib/motion";

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
                <span className="font-serif italic text-gradient">
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
                <span className="font-serif italic text-gradient">
                  to launch.
                </span>
              </>
            }
          />
          <p className="text-fg-muted md:text-lg leading-relaxed">
            Four phases — discovery, design, launch, and ongoing partnership.
            Tight enough to ship, deep enough to last.
          </p>
        </div>
        <ProcessList />
      </section>

      {/* WORK TEASER */}
      <section className="container-shell py-24 md:py-36 border-t border-line">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={stage}
          className="grid gap-12 md:grid-cols-[1fr_1.4fr] md:gap-20 md:items-center"
        >
          <motion.div variants={fadeUp}>
            <p className="eyebrow mb-5">Selected work</p>
            <h2 className="text-[clamp(2rem,4.5vw,3.5rem)] font-medium leading-[1.05] tracking-tight">
              Case studies launching{" "}
              <span className="font-serif italic text-gradient">
                with our next cohort.
              </span>
            </h2>
            <p className="mt-6 text-fg-muted leading-relaxed">
              We're rebuilding the work archive in parallel with current client
              launches. Until it's live, the writing in Insights is the closest
              read on how we think.
            </p>
            <Link
              href="/insights"
              className="group mt-8 inline-flex items-center gap-2 text-sm font-medium text-fg hover:text-accent transition-colors"
            >
              Read the thinking
              <ArrowUpRight
                size={14}
                aria-hidden
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-line bg-surface-1"
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 80% 60% at 30% 30%, rgb(230 50 175 / 0.55) 0%, rgb(100 200 255 / 0.2) 40%, transparent 70%)",
                filter: "blur(40px)",
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="font-serif text-2xl italic text-fg/80 md:text-3xl">
                In progress.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* FAQ */}
      <section className="container-shell py-24 md:py-36 border-t border-line">
        <div className="mb-12 grid gap-8 md:grid-cols-[2fr_1fr] md:items-end md:gap-16 md:mb-16">
          <SectionHeading
            eyebrow="Common questions"
            title={
              <>
                Before we get on a{" "}
                <span className="font-serif italic text-gradient">
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
