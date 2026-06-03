"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight, Check, Plus } from "lucide-react";
import { Magnetic } from "@/components/motion/magnetic";
import { SectionHeading } from "@/components/sections/section-heading";
import type { Offer } from "@/lib/content/offers";
import { stage, stageFast, fadeUp, cardIn, ctaPop } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Props = {
  offer: Offer;
};

/**
 * The pricing block for a performance-priced offer. Renders five sub-blocks
 * inside a single section: the formula strip, a 3-card worked example, a
 * qualified-lead criteria glass panel, a 4-row comparison anchor, and the
 * final CTA. All driven by `offer.pricing` + `offer.performanceTerms`.
 */
export function PerformancePricing({ offer }: Props) {
  const { pricing, finalCta: _finalCta } = offer;
  void _finalCta;

  return (
    <section
      id="pricing"
      className="relative scroll-mt-24 border-t border-line bg-surface-1/40 py-24 md:py-32"
    >
      <div className="container-shell">
        <SectionHeading
          eyebrow={pricing.eyebrow}
          title={
            <span className="text-balance">
              {pricing.headline.lead}{" "}
              <span className="text-gradient sm:block">
                {pricing.headline.accent}
              </span>
            </span>
          }
          align="center"
          className="mx-auto"
        />

        <div className="mx-auto mt-16 max-w-5xl space-y-10 md:mt-20 md:space-y-12">
          {/* FORMULA STRIP :the page's anchor moment */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={cardIn}
            className="glass-refractive overflow-hidden rounded-3xl border border-accent/30 shadow-[0_0_80px_rgb(255_0_188/0.12)]"
          >
            <div className="grid divide-y divide-line md:grid-cols-[1fr_auto_1fr_auto_1fr] md:divide-y-0 md:divide-x">
              {/* Build fee */}
              <div className="p-7 text-center md:p-10">
                <p className="font-mono text-xs uppercase tracking-widest text-fg-subtle">
                  {pricing.formula.buildLabel.note}
                </p>
                <p className="mt-5 text-5xl font-semibold tracking-tight text-fg md:text-6xl">
                  {pricing.formula.buildLabel.amount}
                </p>
                <p className="mt-3 text-sm text-fg-muted md:text-base">
                  {pricing.formula.buildLabel.unit}
                </p>
              </div>

              {/* + */}
              <div
                aria-hidden
                className="grid place-items-center bg-surface-2/40 px-6 py-3 text-fg-subtle md:px-4 md:py-0"
              >
                <Plus size={20} aria-hidden className="text-accent" />
              </div>

              {/* Per-lead fee */}
              <div className="p-7 text-center md:p-10">
                <p className="font-mono text-xs uppercase tracking-widest text-fg-subtle">
                  {pricing.formula.perLeadLabel.note}
                </p>
                <p className="mt-5 text-5xl font-semibold tracking-tight text-fg md:text-6xl">
                  {pricing.formula.perLeadLabel.amount}
                </p>
                <p className="mt-3 text-sm text-fg-muted md:text-base">
                  {pricing.formula.perLeadLabel.unit}
                </p>
              </div>

              {/* capped */}
              <div
                aria-hidden
                className="grid place-items-center bg-surface-2/40 px-6 py-3 text-fg-subtle md:px-4 md:py-0"
              >
                <span className="font-mono text-[10px] uppercase tracking-widest text-accent md:rotate-0">
                  capped
                </span>
              </div>

              {/* Monthly cap */}
              <div className="p-7 text-center md:p-10">
                <p className="font-mono text-xs uppercase tracking-widest text-fg-subtle">
                  {pricing.formula.capLabel.note}
                </p>
                <p className="mt-5 text-5xl font-semibold tracking-tight text-fg md:text-6xl">
                  {pricing.formula.capLabel.amount}
                </p>
                <p className="mt-3 text-sm text-fg-muted md:text-base">
                  {pricing.formula.capLabel.unit}
                </p>
              </div>
            </div>

            <ul className="flex flex-wrap items-center justify-center gap-2 border-t border-line bg-surface-1/40 px-6 py-5 text-xs font-medium tracking-wide text-fg-muted md:gap-4 md:px-10 md:py-6 md:text-sm">
              {pricing.formula.chips.map((chip) => (
                <li
                  key={chip}
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-2/60 px-4 py-1.5"
                >
                  <Check size={12} aria-hidden className="text-accent" />
                  {chip}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* WORKED EXAMPLE :pre-empts the "what does this cost me" math */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={stage}
          >
            <motion.p
              className="eyebrow mb-6 text-center"
              variants={fadeUp}
            >
              The math, three months in
            </motion.p>
            <motion.ol
              variants={stageFast}
              className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-3"
            >
              {pricing.workedExample.map((row, i) => (
                <motion.li
                  key={row.month}
                  variants={cardIn}
                  className="flex flex-col bg-surface-1/60 p-7 backdrop-blur-sm md:p-9"
                >
                  <span className="font-mono text-xs uppercase tracking-widest text-accent">
                    {row.month}
                  </span>
                  <p className="mt-4 text-sm text-fg-muted md:text-base">
                    {row.label}
                  </p>
                  <p
                    className={cn(
                      "mt-3 text-4xl font-semibold tracking-tight text-fg md:text-5xl",
                      i === pricing.workedExample.length - 1 &&
                        "text-gradient",
                    )}
                  >
                    {row.amount}
                  </p>
                  {row.note && (
                    <p className="mt-5 border-t border-line pt-5 text-sm leading-relaxed text-fg-subtle">
                      {row.note}
                    </p>
                  )}
                </motion.li>
              ))}
            </motion.ol>
          </motion.div>

          {/* QUALIFIED LEAD CRITERIA :kills the "by whose definition" objection at point of impact */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={cardIn}
            className="rounded-3xl border border-line bg-surface-1/60 p-7 backdrop-blur-md md:p-10"
          >
            <p className="eyebrow mb-6">
              {pricing.qualifiedLeadCriteria.eyebrow}
            </p>
            <motion.ul
              variants={stageFast}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="grid gap-4 md:grid-cols-2 md:gap-5"
            >
              {pricing.qualifiedLeadCriteria.items.map((item) => (
                <motion.li
                  key={item}
                  variants={fadeUp}
                  className="flex items-start gap-3 text-pretty text-fg-muted leading-relaxed"
                >
                  <Check
                    size={18}
                    aria-hidden
                    className="mt-1 shrink-0 text-accent"
                  />
                  <span>{item}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* COMPARISON ANCHOR :decoy effect via three inferior alternatives */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={stage}
          >
            <motion.p
              className="eyebrow mb-6 text-center"
              variants={fadeUp}
            >
              {pricing.comparison.eyebrow}
            </motion.p>
            <motion.ul
              variants={stageFast}
              className="grid gap-3 md:gap-2"
            >
              {pricing.comparison.rows.map((row, i) => {
                const isNami = i === pricing.comparison.rows.length - 1;
                return (
                  <motion.li
                    key={row.label}
                    variants={fadeUp}
                    className={cn(
                      "rounded-2xl border bg-surface-1/40 p-5 backdrop-blur-md transition-colors duration-500 md:p-6",
                      isNami
                        ? "border-accent/40 bg-surface-1/70 shadow-[0_0_40px_rgb(255_0_188/0.08)]"
                        : "border-line hover:border-line-strong",
                    )}
                  >
                    <div className="grid items-baseline gap-2 md:grid-cols-[1fr_auto_1.4fr] md:gap-6">
                      <p
                        className={cn(
                          "text-base font-medium tracking-tight md:text-lg",
                          isNami ? "text-fg" : "text-fg",
                        )}
                      >
                        {row.label}
                      </p>
                      <p
                        className={cn(
                          "text-sm font-mono md:text-right md:text-base",
                          isNami ? "text-accent" : "text-fg-subtle",
                        )}
                      >
                        {row.price}
                      </p>
                      <p
                        className={cn(
                          "text-sm leading-relaxed",
                          isNami ? "text-fg-muted" : "text-fg-subtle",
                        )}
                      >
                        {row.weakness}
                      </p>
                    </div>
                  </motion.li>
                );
              })}
            </motion.ul>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            variants={ctaPop}
            className="flex justify-center"
          >
            <Magnetic>
              <Link
                href={pricing.cta.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-accent px-8 py-4 text-sm font-semibold text-white shadow-[0_4px_20px_rgb(255_0_188/0.3)] transition-shadow duration-500 hover:shadow-[0_8px_40px_rgb(255_0_188/0.55)]"
              >
                <span className="absolute inset-0 -z-10 translate-y-full bg-accent-soft transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-y-0" />
                {pricing.cta.label}
                <ArrowUpRight
                  size={16}
                  aria-hidden
                  className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </Magnetic>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
