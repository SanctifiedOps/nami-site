"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { LinkedinIcon } from "@/components/icons/socials";
import { PageHero } from "@/components/sections/page-hero";
import { Testimonials } from "@/components/sections/testimonials";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import { values } from "@/lib/content/values";
import { stage, stageFast, fadeUp, cardIn } from "@/lib/motion";

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About · NAMI Creative"
        title={
          <>
            Brand as{" "}
            <span className="text-gradient sm:block">infrastructure.</span>
          </>
        }
        lead="A creative marketing studio building brand identity, content systems, and growth infrastructure for founders who want the work to keep running after they stop being in every room."
      />

      {/* Story */}
      <section className="container-shell py-24 md:py-32">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stage}
          className="grid gap-12 md:grid-cols-[1fr_2fr] md:gap-20"
        >
          <motion.p className="mono-label md:mt-2" variants={fadeUp}>
            01 / The story
          </motion.p>
          <motion.div variants={fadeUp} className="space-y-6 max-w-2xl">
            <p className="text-2xl font-medium leading-snug tracking-tight md:text-3xl">
              NAMI exists to build brands that{" "}
              <span className="text-gradient">
                move with intention
              </span>{" "}
              and hold while the business scales.
            </p>
            <p className="text-fg-muted md:text-lg leading-relaxed">
              Most businesses don't have a brand problem. They have an
              alignment problem. Identity drifts away from messaging,
              messaging drifts from product, content drifts from strategy,
              and growth becomes harder than it should be.
            </p>
            <p className="text-fg-muted md:text-lg leading-relaxed">
              We sit between three roles (brand studio, creative partner,
              systems builder) because that's the shape of the work that
              compounds. Strategy without execution is a
              deck. Execution without systems is exhaustion. We do all
              three so what gets built keeps working after we leave.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Values */}
      <section className="border-t border-line bg-surface-1/40 py-24 md:py-32">
        <div className="container-shell">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={stage}
            className="mb-14 max-w-2xl"
          >
            <motion.span className="mono-label mb-5 block" variants={fadeUp}>
              How we think
            </motion.span>
            <motion.h2
              className="text-[clamp(2rem,4.5vw,3.5rem)] font-medium leading-[1.05] tracking-tight"
              variants={fadeUp}
            >
              Three principles <span className="text-gradient">we hold to.</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={stageFast}
            className="grid gap-6 md:grid-cols-3 md:gap-8"
          >
            {values.map((value, i) => (
              <motion.div key={value.title} variants={cardIn}>
                <SpotlightCard
                  tilt={4}
                  className="glass-refractive glass-refractive--hover h-full rounded-2xl"
                >
                  <div className="relative z-10 p-8 md:p-10">
                    <span className="font-mono text-sm text-accent">
                      0{i + 1}
                    </span>
                    <h3 className="mt-6 text-2xl font-medium tracking-tight md:text-3xl">
                      {value.title}
                    </h3>
                    <p className="mt-4 leading-relaxed text-fg-muted">
                      {value.body}
                    </p>
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* Founder note */}
      <section className="container-shell py-24 md:py-32 border-t border-line">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stage}
          className="grid gap-12 md:grid-cols-[0.85fr_1.15fr] md:items-start md:gap-16 lg:gap-20"
        >
          <motion.div variants={fadeUp}>
            <div className="glass-refractive relative aspect-3/4 overflow-hidden rounded-2xl">
              <Image
                src="/assets/images/bb.jpg"
                alt="Joe Wilson, founder of NAMI Creative"
                fill
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
            <p className="mono-label mt-4">Joe Wilson · Founder, NAMI Creative</p>
          </motion.div>
          <motion.div variants={fadeUp} className="max-w-2xl space-y-6">
            <p className="mono-label">02 / The founder</p>
            <p className="text-2xl font-medium leading-snug tracking-tight md:text-3xl">
              Hi, I'm <span className="text-gradient">Joe Wilson.</span>
            </p>
            <p className="text-fg-muted md:text-lg leading-relaxed">
              I started NAMI Creative to do the kind of work that only happens
              when strategy, design, and systems are built by the same hands.
              Direct client relationships, senior-only output, no middle
              layer.
            </p>
            <p className="text-fg-muted md:text-lg leading-relaxed">
              Twenty years in brand building and design sit behind that. I held
              a head-of-department role at the UK&apos;s leading energy
              consultants&apos; trade body, building a brand with enough weight
              to earn a seat in Westminster, and I&apos;ve been featured on BBC
              Radio for the Nami Up North project.
            </p>
            <p className="text-fg-muted md:text-lg leading-relaxed">
              Today I work with founders, small businesses, and trades who care
              about doing the work properly. Independent operators through to
              growing teams. The common thread is intent.
            </p>

            <dl className="grid gap-8 border-t border-line pt-6 sm:grid-cols-3">
              <div>
                <dt className="mono-label">Experience</dt>
                <dd className="mt-2 text-lg font-medium tracking-tight text-fg">
                  20 years
                </dd>
                <p className="mt-1 text-sm text-fg-muted">
                  Brand building + design
                </p>
              </div>
              <div>
                <dt className="mono-label">Leadership</dt>
                <dd className="mt-2 text-lg font-medium tracking-tight text-fg">
                  Head of Dept.
                </dd>
                <p className="mt-1 text-sm text-fg-muted">
                  UK&apos;s leading energy consultants&apos; trade body
                </p>
              </div>
              <div>
                <dt className="mono-label">Featured</dt>
                <dd className="mt-2 text-lg font-medium tracking-tight text-fg">
                  BBC Radio
                </dd>
                <p className="mt-1 text-sm text-fg-muted">
                  Nami Up North project
                </p>
              </div>
            </dl>

            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 pt-2">
              <a
                href="https://www.linkedin.com/in/brandingbyjoewilson/"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 text-sm font-medium text-fg hover:text-accent transition-colors"
              >
                <LinkedinIcon size={16} aria-hidden />
                Connect on LinkedIn
                <ArrowUpRight
                  size={12}
                  aria-hidden
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 text-sm font-medium text-fg hover:text-accent transition-colors"
              >
                Start a conversation
                <ArrowUpRight
                  size={14}
                  aria-hidden
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}
