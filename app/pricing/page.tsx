"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { engagements } from "@/lib/content/engagement";
import { stage, stageFast, fadeUp, cardIn } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { ParallaxBackdrop } from "@/components/motion/parallax-backdrop";

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Investment"
        title={
          <>
            Choose the right amount{" "}
            <span className="text-gradient sm:block">of help for the job</span>
          </>
        }
        lead="Some jobs need a focused fix. Others need regular support. We will agree what you need, what it costs and how long it should take before I begin."
      />

      {/* How I price the work */}
      <section className="relative isolate overflow-hidden border-b border-line py-20 md:py-24">
        <ParallaxBackdrop src="/images/north-east/2.jpg" position="center 56%" overlay={0.84} />
        <div className="container-shell relative z-10">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={stage}
            className="mx-auto max-w-3xl text-center"
          >
            <motion.div variants={fadeUp} className="space-y-6">
              <h2 className="type-section-title">
                A clear price for <span className="text-gradient">the job you need</span>
              </h2>
              <p className="mx-auto max-w-2xl text-fg-muted md:text-lg leading-relaxed">
                We talk first because a request such as "I need a new website"
                can mean very different things. You might need clearer wording,
                a few better pages or a complete rebuild. I quote once we know
                what will actually solve the problem.
              </p>
              <p className="mx-auto max-w-2xl text-fg-muted md:text-lg leading-relaxed">
                You will see exactly what is included, what it will cost and the
                expected timescale. If I am not the right person for the job, I
                will tell you before you spend anything.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="container-shell py-20 md:py-28">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={stageFast}
          className="border-t border-line"
        >
          {engagements.map((e) => (
            <motion.article
              key={e.name}
              variants={cardIn}
              whileHover={{ y: -4, scale: 1.004 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "group relative grid gap-8 border-b border-line px-5 py-10 transition-[background-color,border-color,box-shadow] duration-700 ease-[var(--ease-out-expo)] md:px-8 md:py-12 lg:grid-cols-12 lg:gap-10",
                e.highlight
                  ? "border-x border-x-accent/25 bg-accent/[0.045] shadow-[inset_3px_0_0_rgb(255_0_188/0.75)] hover:bg-accent/[0.07]"
                  : "hover:border-b-accent/30 hover:bg-white/[0.025]",
              )}
            >
              <div className="lg:col-span-3">
                {e.highlight && (
                  <p className="mb-3 text-sm font-medium text-accent">
                    A good fit for ongoing work
                  </p>
                )}
                <h2 className="type-subsection-title">{e.name}</h2>
                <p className="mt-3 max-w-xs leading-relaxed text-fg-muted">
                  {e.best}
                </p>
              </div>

              <div className="lg:col-span-5">
                <p className="max-w-xl leading-relaxed text-fg-muted">
                  {e.description}
                </p>
                <ul className="mt-6 grid gap-x-8 gap-y-2 border-t border-line pt-6 sm:grid-cols-2">
                  {e.scope.map((s) => (
                    <li key={s} className="text-sm leading-relaxed text-fg-muted">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col border-t border-line pt-6 lg:col-span-4 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
                  <div>
                    <dt className="text-sm text-fg-subtle">Typical timescale</dt>
                    <dd className="mt-1 text-sm font-medium text-fg">{e.timeline}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-fg-subtle">How it is priced</dt>
                    <dd className="mt-1 text-sm font-medium text-fg">{e.starting}</dd>
                  </div>
                </dl>

                <Link
                  href={e.cta.href}
                  className={cn(
                    "group/link mt-8 inline-flex w-fit items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-all duration-500",
                    e.highlight
                      ? "bg-accent text-white shadow-[0_4px_18px_rgb(255_0_188/0.25)] hover:bg-accent-soft hover:shadow-[0_8px_28px_rgb(255_0_188/0.32)]"
                      : "border border-line-strong text-fg hover:border-accent hover:bg-white/5",
                  )}
                >
                  {e.cta.label}
                  <ArrowUpRight
                    size={14}
                    aria-hidden
                    className="transition-transform duration-500 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                  />
                </Link>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </section>

    </>
  );
}
