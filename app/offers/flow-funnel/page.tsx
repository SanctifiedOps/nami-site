"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight, ArrowRight, Check, X } from "lucide-react";
import { Magnetic } from "@/components/motion/magnetic";
import { PageHero } from "@/components/sections/page-hero";
import { SectionHeading } from "@/components/sections/section-heading";
import { FAQAccordion } from "@/components/sections/faq-accordion";
import { NewsletterSubscribe } from "@/components/sections/newsletter-subscribe";
import { flowFunnel } from "@/lib/content/offers";
import { getCaseStudy } from "@/lib/content/work";
import { stage, stageFast, fadeUp, cardIn, ctaPop } from "@/lib/motion";
import { cn } from "@/lib/utils";

const ANCHOR_PROOF = "proof";

export default function FlowFunnelPage() {
  const offer = flowFunnel;

  return (
    <>
      {/* 1. HERO */}
      <PageHero
        eyebrow={offer.hero.eyebrow}
        title={
          <span className="text-balance">
            {offer.hero.title.lead}{" "}
            <span className="text-gradient sm:block">
              {offer.hero.title.accent}
            </span>
          </span>
        }
        lead={offer.hero.subhead}
      >
        <div className="flex flex-col items-center gap-7">
          <motion.ul
            className="flex flex-wrap items-center justify-center gap-2 text-xs font-medium tracking-wide text-fg-muted md:gap-3 md:text-sm"
            variants={fadeUp}
          >
            {offer.hero.chips.map((chip, i) => (
              <li
                key={chip}
                className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface-1/40 px-4 py-1.5 backdrop-blur-md"
              >
                {i === 0 && (
                  <span
                    aria-hidden
                    className="size-1.5 rounded-full bg-accent"
                  />
                )}
                {chip}
              </li>
            ))}
          </motion.ul>
          <motion.div
            className="flex flex-wrap items-center justify-center gap-3 md:gap-4"
            variants={ctaPop}
          >
            <Magnetic>
              <Link
                href={offer.hero.primaryCta.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-accent px-8 py-4 text-sm font-semibold text-white shadow-[0_4px_20px_rgb(255_0_188/0.3)] transition-shadow duration-500 hover:shadow-[0_8px_40px_rgb(255_0_188/0.55)]"
              >
                <span className="absolute inset-0 -z-10 translate-y-full bg-accent-soft transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-y-0" />
                {offer.hero.primaryCta.label}
                <ArrowUpRight
                  size={16}
                  aria-hidden
                  className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </Magnetic>

            <Link
              href={offer.hero.secondaryCta.href}
              className="group inline-flex items-center gap-2 rounded-full border border-line-strong px-8 py-4 text-sm font-semibold text-fg transition-colors duration-300 hover:bg-white/5 hover:border-accent"
            >
              {offer.hero.secondaryCta.label}
              <ArrowRight
                size={16}
                aria-hidden
                className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1"
              />
            </Link>
          </motion.div>
          <p className="max-w-md text-balance text-sm text-fg-subtle leading-relaxed">
            {offer.hero.trustStrip}
          </p>
        </div>
      </PageHero>

      {/* 1b. DEFINITION SNIPPET (40-60 words, AI-extractable, leads with direct
          definition. Search engines and AI Overviews lift this as the answer
          to "what is a Flow Funnel?". Lives near the top of the rendered HTML
          for early crawl extraction, visually quiet so it doesn't interrupt
          the funnel narrative.) */}
      <section
        aria-label="What is a Flow Funnel"
        className="border-b border-line py-14 md:py-20"
      >
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={stage}
          className="container-shell mx-auto max-w-2xl text-center"
        >
          <motion.p
            className="eyebrow mb-6"
            variants={fadeUp}
          >
            What is a Flow Funnel
          </motion.p>
          <motion.p
            className="text-balance text-fg-muted leading-relaxed md:text-lg"
            variants={fadeUp}
          >
            <strong className="font-medium text-fg">A Flow Funnel is a productised landing page, lead capture form, and private lead dashboard</strong>{" "}
            built by NAMI Creative in seven days for £500. Designed for founders, freelancers, artists, and small businesses to turn audience attention into bookings, sales, and enquiries, without the cost or timeline of a full custom website.
          </motion.p>
        </motion.div>
      </section>

      {/* 2. RECOGNITION STACK */}
      <section className="border-b border-line bg-surface-1/40 py-24 md:py-32">
        <motion.div
          className="container-shell mx-auto max-w-2xl text-center"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={stage}
        >
          <motion.p
            className="eyebrow mb-10"
            variants={fadeUp}
          >
            {offer.recognition.eyebrow}
          </motion.p>
          <div className="space-y-5 text-[clamp(1.125rem,2.2vw,1.5rem)] font-medium leading-snug tracking-tight md:space-y-6">
            {offer.recognition.pains.map((pain) => (
              <motion.p
                key={pain}
                variants={fadeUp}
                className="text-balance text-fg"
              >
                {pain}
              </motion.p>
            ))}
          </div>
          <motion.p
            className="mt-14 text-balance text-[clamp(1.5rem,3vw,2.25rem)] font-semibold leading-tight tracking-tight text-fg md:mt-20"
            variants={fadeUp}
          >
            {offer.recognition.closing.lead}{" "}
            <span className="text-gradient">
              {offer.recognition.closing.accent}
            </span>
          </motion.p>
        </motion.div>
      </section>

      {/* 3. DIAGNOSIS */}
      <section className="container-shell py-24 md:py-32">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stage}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.p className="eyebrow mb-6" variants={fadeUp}>
            {offer.diagnosis.eyebrow}
          </motion.p>
          <motion.h2
            className="text-balance text-3xl font-semibold leading-tight tracking-tight md:text-5xl"
            variants={fadeUp}
          >
            {offer.diagnosis.headline.lead}{" "}
            <span className="text-gradient">
              {offer.diagnosis.headline.accent}
            </span>
          </motion.h2>
          <motion.div
            variants={fadeUp}
            className="mt-10 space-y-6 text-pretty text-center text-fg-muted leading-relaxed md:text-lg"
          >
            {offer.diagnosis.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* 4. POSSIBILITY */}
      <section className="relative overflow-hidden border-y border-line bg-surface-1/40 py-24 md:py-32">
        <motion.div
          className="container-shell mx-auto max-w-2xl text-center"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          variants={stage}
        >
          <motion.p className="eyebrow mb-10" variants={fadeUp}>
            {offer.possibility.eyebrow}
          </motion.p>
          <div className="space-y-6 text-[clamp(1.2rem,2.4vw,1.75rem)] font-medium leading-snug tracking-tight md:space-y-8">
            {offer.possibility.lines.map((line) => (
              <motion.p
                key={line}
                variants={fadeUp}
                className="text-balance text-fg-muted"
              >
                {line}
              </motion.p>
            ))}
          </div>
          <motion.p
            className="mt-14 text-balance text-[clamp(1.5rem,3vw,2.25rem)] font-semibold leading-tight tracking-tight text-fg md:mt-20"
            variants={fadeUp}
          >
            That&apos;s what{" "}
            <span className="text-gradient">the Flow Funnel is.</span>
          </motion.p>
        </motion.div>
      </section>

      {/* 5 + 5b. PROOF (VESSL primary, MILLIONS range) */}
      <section
        id={ANCHOR_PROOF}
        className="container-shell scroll-mt-24 py-24 md:py-32"
      >
        {offer.proof.map((proofRef, idx) => {
          const study = getCaseStudy(proofRef.slug);
          if (!study) return null;
          const isPrimary = proofRef.variant === "primary";
          const Icon = study.icon;

          return (
            <motion.div
              key={proofRef.slug}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              variants={stage}
              className={cn(
                "mx-auto max-w-3xl text-center",
                idx > 0 && "mt-24 border-t border-line pt-24 md:mt-32 md:pt-32",
              )}
            >
              <motion.p className="eyebrow mb-6" variants={fadeUp}>
                {isPrimary
                  ? "We've built this exact thing"
                  : "And when the stakes are higher"}
              </motion.p>
              <motion.h2
                className={cn(
                  "text-balance font-semibold leading-tight tracking-tight",
                  isPrimary
                    ? "text-4xl md:text-6xl"
                    : "text-3xl md:text-5xl",
                )}
                variants={fadeUp}
              >
                {proofRef.headline.lead}{" "}
                <span className="text-gradient sm:block">
                  {proofRef.headline.accent}
                </span>
              </motion.h2>

              <motion.div
                variants={cardIn}
                className="group relative mx-auto mt-12 overflow-hidden rounded-3xl border border-line bg-surface-1/60 transition-all duration-700 ease-[var(--ease-out-expo)] hover:border-accent/40 hover:shadow-[0_0_80px_rgb(255_0_188/0.15)] md:mt-16"
              >
                <div
                  className={cn(
                    "relative",
                    isPrimary ? "aspect-[16/10]" : "aspect-[16/9]",
                  )}
                >
                  <Image
                    src={study.cover}
                    alt={`${study.client} case study by NAMI Creative: ${study.tagline}`}
                    fill
                    sizes="(min-width: 768px) 768px, 100vw"
                    className="object-cover transition-transform duration-1000 ease-[var(--ease-out-expo)] group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-surface-0/80 via-surface-0/10 to-transparent" />
                </div>
                <div className="flex items-center justify-center gap-3 border-t border-line p-5 text-sm">
                  <Icon size={16} className="text-accent" aria-hidden />
                  <span className="text-fg">{study.client}</span>
                  <span className="text-fg-subtle">·</span>
                  <span className="text-fg-subtle">{study.sector}</span>
                </div>
              </motion.div>

              <motion.div
                variants={fadeUp}
                className="mx-auto mt-10 max-w-2xl space-y-6 text-pretty md:mt-12"
              >
                <p className="text-fg-muted leading-relaxed md:text-lg">
                  {proofRef.body}
                </p>
                {proofRef.closing && (
                  <p className="text-balance text-xl font-medium leading-snug tracking-tight text-fg md:text-2xl">
                    {proofRef.closing}
                  </p>
                )}
              </motion.div>

              <motion.div variants={fadeUp} className="mt-10">
                <Link
                  href={`/work/${study.slug}`}
                  className="group inline-flex items-center gap-2 text-sm font-medium text-fg transition-colors hover:text-accent"
                >
                  See the full {study.client} case study
                  <ArrowUpRight
                    size={14}
                    aria-hidden
                    className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
              </motion.div>
            </motion.div>
          );
        })}
      </section>

      {/* 6. TESTIMONIAL */}
      <section className="border-y border-line bg-surface-1/40 py-24 md:py-32">
        <motion.figure
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={stage}
          className="container-shell mx-auto max-w-2xl text-center"
        >
          <motion.span
            className="mx-auto block h-px w-10 bg-accent"
            aria-hidden
            variants={fadeUp}
          />
          <motion.blockquote
            className="mt-8 text-balance text-[clamp(1.35rem,2.8vw,2rem)] font-medium leading-snug tracking-tight text-fg"
            variants={fadeUp}
          >
            &ldquo;{offer.testimonial.quote}&rdquo;
          </motion.blockquote>
          <motion.figcaption
            className="mt-10 flex flex-col items-center gap-1.5 text-sm"
            variants={fadeUp}
          >
            <span className="font-medium text-fg">
              {offer.testimonial.author}
            </span>
            <span className="text-fg-subtle">{offer.testimonial.role}</span>
          </motion.figcaption>
        </motion.figure>
      </section>

      {/* 7. DELIVERABLES */}
      <section className="container-shell py-24 md:py-32">
        <SectionHeading
          eyebrow={offer.deliverables.eyebrow}
          title={
            <span className="text-balance">
              {offer.deliverables.headline.lead}{" "}
              <span className="text-gradient sm:block">
                {offer.deliverables.headline.accent}
              </span>
            </span>
          }
          align="center"
          className="mx-auto"
        />
        <motion.ul
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={stageFast}
          className="mx-auto mt-16 grid max-w-4xl gap-px overflow-hidden rounded-3xl border border-line bg-line md:mt-20 md:grid-cols-2"
        >
          {offer.deliverables.items.map((item) => {
            const Icon = item.icon;
            return (
              <motion.li
                key={item.title}
                variants={fadeUp}
                className="group flex gap-5 bg-surface-1/60 p-8 backdrop-blur-sm transition-colors duration-500 ease-[var(--ease-out-expo)] hover:bg-surface-1/80 md:p-10"
              >
                <div className="inline-grid size-12 shrink-0 place-items-center rounded-2xl border border-line bg-surface-2/60 transition-colors duration-500 group-hover:border-accent/40">
                  <Icon size={20} className="text-accent" aria-hidden />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium tracking-tight text-fg md:text-xl">
                    {item.title}
                  </h3>
                  <p className="text-pretty text-sm text-fg-muted leading-relaxed md:text-base">
                    {item.description}
                  </p>
                </div>
              </motion.li>
            );
          })}
        </motion.ul>
      </section>

      {/* 8. HOW IT WORKS */}
      <section className="border-t border-line bg-surface-1/40 py-24 md:py-32">
        <div className="container-shell">
          <SectionHeading
            eyebrow="How it goes"
            title={
              <span className="text-balance">
                From call to live{" "}
                <span className="text-gradient sm:block">in seven days.</span>
              </span>
            }
            align="center"
            className="mx-auto"
          />
          <motion.ol
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={stageFast}
            className="mx-auto mt-16 grid max-w-3xl gap-px overflow-hidden rounded-3xl border border-line bg-line md:mt-20"
          >
            {FLOW_PHASES.map((phase) => (
              <motion.li
                key={phase.day}
                variants={fadeUp}
                className="flex flex-col items-center bg-surface-1/60 p-8 text-center backdrop-blur-sm transition-colors duration-500 ease-[var(--ease-out-expo)] hover:bg-surface-1/80 md:p-12"
              >
                <span className="font-mono text-sm text-accent">
                  {phase.day}
                </span>
                <h3 className="mt-2 text-balance text-xl font-medium tracking-tight text-fg md:text-2xl">
                  {phase.title}
                </h3>
                <p className="mt-4 max-w-xl text-pretty text-fg-muted leading-relaxed">
                  {phase.body}
                </p>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </section>

      {/* 9. QUALIFICATION */}
      <section className="container-shell py-24 md:py-32">
        <SectionHeading
          eyebrow={offer.qualification.eyebrow}
          title={
            <span className="text-balance">
              For you, or{" "}
              <span className="text-gradient sm:block">not for you.</span>
            </span>
          }
          align="center"
          className="mx-auto"
        />
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stage}
          className="mx-auto mt-16 grid max-w-4xl gap-6 md:mt-20 md:grid-cols-2 md:gap-8"
        >
          <motion.div
            variants={fadeUp}
            className="rounded-2xl border border-accent/40 bg-surface-1/60 p-8 backdrop-blur-md transition-shadow duration-700 hover:shadow-[0_0_60px_rgb(255_0_188/0.12)] md:p-10"
          >
            <h3 className="text-xs font-semibold uppercase tracking-widest text-accent">
              This is for you if
            </h3>
            <ul className="mt-6 space-y-4">
              {offer.qualification.forYou.map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-3 text-pretty text-fg-muted leading-relaxed"
                >
                  <Check
                    size={18}
                    aria-hidden
                    className="mt-1 shrink-0 text-accent"
                  />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            variants={fadeUp}
            className="rounded-2xl border border-line bg-surface-1/40 p-8 backdrop-blur-md md:p-10"
          >
            <h3 className="text-xs font-semibold uppercase tracking-widest text-fg-subtle">
              This isn&apos;t for you if
            </h3>
            <ul className="mt-6 space-y-4">
              {offer.qualification.notForYou.map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-3 text-pretty text-fg-muted leading-relaxed"
                >
                  <X
                    size={18}
                    aria-hidden
                    className="mt-1 shrink-0 text-fg-subtle"
                  />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </section>

      {/* 9b. VOICES STRIP (supporting social proof) */}
      <section className="border-t border-line py-24 md:py-32">
        <div className="container-shell">
          <SectionHeading
            eyebrow={offer.voices.eyebrow}
            title={
              <span className="text-balance">
                {offer.voices.headline.lead}{" "}
                <span className="text-gradient sm:block">
                  {offer.voices.headline.accent}
                </span>
              </span>
            }
            align="center"
            className="mx-auto"
          />
          <motion.ul
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={stageFast}
            className="mx-auto mt-16 grid max-w-5xl gap-6 md:mt-20 md:grid-cols-3 md:gap-8"
          >
            {offer.voices.items.map((voice) => (
              <motion.li
                key={voice.author}
                variants={cardIn}
                className="flex flex-col gap-6 rounded-2xl border border-line bg-surface-1/60 p-7 backdrop-blur-md transition-colors duration-500 ease-[var(--ease-out-expo)] hover:border-line-strong md:p-8"
              >
                <span
                  aria-hidden
                  className="block h-px w-8 bg-accent"
                />
                <blockquote className="text-pretty text-base leading-relaxed text-fg md:text-lg">
                  &ldquo;{voice.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-auto flex flex-col gap-0.5 text-sm">
                  <span className="font-medium text-fg">{voice.author}</span>
                  <span className="text-fg-subtle">{voice.role}</span>
                </figcaption>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </section>

      {/* 10. TIER LADDER */}
      <section className="border-t border-line bg-surface-1/40 py-24 md:py-32">
        <div className="container-shell">
          <SectionHeading
            eyebrow={offer.tiersHeading.eyebrow}
            title={
              <span className="text-balance">
                {offer.tiersHeading.headline.lead}{" "}
                <span className="text-gradient sm:block">
                  {offer.tiersHeading.headline.accent}
                </span>
              </span>
            }
            align="center"
            className="mx-auto"
          />
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={stageFast}
            className="mx-auto mt-16 grid max-w-5xl gap-6 md:mt-20 lg:grid-cols-3 lg:gap-8"
          >
            {offer.tiers.map((tier) => (
              <motion.article
                key={tier.name}
                variants={cardIn}
                className={cn(
                  "relative flex flex-col rounded-2xl border bg-surface-1/60 p-7 backdrop-blur-md transition-all duration-500 ease-[var(--ease-out-expo)] md:p-9",
                  tier.highlight
                    ? "border-accent/40 shadow-[0_0_60px_rgb(255_0_188/0.15)] hover:shadow-[0_0_80px_rgb(255_0_188/0.22)]"
                    : "border-line hover:border-line-strong",
                )}
              >
                {tier.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-xs font-semibold uppercase tracking-widest text-white">
                    Start here
                  </span>
                )}
                <span className="font-mono text-sm text-accent">
                  {tier.index}
                </span>
                <h3 className="mt-4 text-3xl font-medium tracking-tight md:text-4xl">
                  {tier.name}
                </h3>
                <p className="mt-3 text-sm text-fg-subtle">{tier.best}</p>
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="text-3xl font-semibold tracking-tight text-fg md:text-4xl">
                    {tier.price}
                  </span>
                  <span className="text-sm text-fg-subtle">
                    {tier.cadence}
                  </span>
                </div>
                <p className="mt-6 text-pretty text-fg-muted leading-relaxed">
                  {tier.description}
                </p>
                <ul className="mt-8 space-y-3 border-t border-line pt-8">
                  {tier.scope.map((s) => (
                    <li
                      key={s}
                      className="flex items-start gap-3 text-sm text-fg-muted"
                    >
                      <Check
                        size={16}
                        aria-hidden
                        className="mt-0.5 shrink-0 text-accent"
                      />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={tier.cta.href}
                  target={tier.cta.href.startsWith("http") ? "_blank" : undefined}
                  rel={tier.cta.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className={cn(
                    "group mt-8 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-all duration-300",
                    tier.highlight
                      ? "bg-accent text-white shadow-[0_4px_16px_rgb(255_0_188/0.3)] hover:bg-accent-soft"
                      : "border border-line-strong text-fg hover:bg-white/5 hover:border-accent",
                  )}
                >
                  {tier.cta.label}
                  <ArrowUpRight
                    size={14}
                    aria-hidden
                    className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 11. SCARCITY + FINAL CTA */}
      <section className="container-shell py-24 md:py-32">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={stage}
          className="mx-auto flex max-w-2xl flex-col items-center gap-8 rounded-3xl border border-accent/30 bg-surface-1/60 p-10 text-center shadow-[0_0_80px_rgb(255_0_188/0.1)] transition-shadow duration-700 hover:shadow-[0_0_120px_rgb(255_0_188/0.16)] md:p-16"
        >
          <motion.p className="eyebrow" variants={fadeUp}>
            {offer.finalCta.eyebrow}
          </motion.p>
          <motion.h2
            className="text-balance text-3xl font-semibold leading-tight tracking-tight md:text-5xl"
            variants={fadeUp}
          >
            {offer.finalCta.headline.lead}{" "}
            <span className="text-gradient sm:block">
              {offer.finalCta.headline.accent}
            </span>
          </motion.h2>
          <motion.p
            className="max-w-md text-pretty text-fg-muted leading-relaxed md:text-lg"
            variants={fadeUp}
          >
            {offer.finalCta.body}
          </motion.p>
          <motion.div variants={fadeUp}>
            <Magnetic>
              <Link
                href={offer.finalCta.button.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-accent px-8 py-4 text-sm font-semibold text-white shadow-[0_4px_20px_rgb(255_0_188/0.3)] transition-shadow duration-500 hover:shadow-[0_8px_40px_rgb(255_0_188/0.55)]"
              >
                <span className="absolute inset-0 -z-10 translate-y-full bg-accent-soft transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-y-0" />
                {offer.finalCta.button.label}
                <ArrowUpRight
                  size={16}
                  aria-hidden
                  className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </Magnetic>
          </motion.div>
        </motion.div>
      </section>

      {/* 12. FAQ */}
      <section className="border-t border-line py-24 md:py-32">
        <div className="container-shell">
          <SectionHeading
            eyebrow="Common questions"
            title={
              <span className="text-balance">
                Before we get on{" "}
                <span className="text-gradient sm:block">
                  a call together.
                </span>
              </span>
            }
            align="center"
            className="mx-auto"
          />
          <div className="mx-auto mt-16 max-w-3xl md:mt-20">
            <FAQAccordion items={offer.faq} />
          </div>
        </div>
      </section>

      {/* 13. SOFT-YES EMAIL CAPTURE (last-chance for non-callers) */}
      <section className="border-t border-line bg-surface-1/40 py-24 md:py-32">
        <div className="container-shell">
          <div className="mx-auto max-w-2xl">
            <NewsletterSubscribe
              variant="card"
              stacked
              eyebrow="Not ready yet?"
              title={
                <span className="text-balance">
                  Slots open monthly.{" "}
                  <span className="text-gradient">Get notified.</span>
                </span>
              }
              lead="We open four Flow Funnel builds each month. Drop your email and we'll let you know when the next batch opens."
            />
          </div>
        </div>
      </section>
    </>
  );
}

/**
 * Four-phase Flow Funnel build process. Inline rather than in offers.ts
 * because the rendering shape is bespoke to this page and unlikely to
 * be reused elsewhere yet.
 */
const FLOW_PHASES = [
  {
    day: "Day 0",
    title: "15-min fit-call",
    body: "We confirm we're a fit, scope the brief, and answer your questions. No pitch deck, no high-pressure close.",
  },
  {
    day: "Day 1",
    title: "Kickoff and brief",
    body: "Deposit invoice sent. You fill in a 15-minute brief on your audience and your offer. We get started the same day.",
  },
  {
    day: "Days 2 to 6",
    title: "Build",
    body: "Landing page, lead capture form, lead dashboard, email automation. Every layer wired against your brief.",
  },
  {
    day: "Day 7",
    title: "Live and handover",
    body: "Training Loom, DNS guide if needed, and your funnel live. Leads landing in your inbox from the first share.",
  },
] as const;
