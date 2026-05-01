"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight, Check } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { engagements } from "@/lib/content/engagement";
import { stage, stageFast, fadeUp, cardIn } from "@/lib/motion";
import { cn } from "@/lib/utils";

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Investment"
        title="Three ways to work together."
        lead="Engagements are scoped, not packaged. Pricing depends on surface area and depth — but here's how we structure the work."
      />

      <section className="container-shell py-24 md:py-32">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={stageFast}
          className="grid gap-6 md:grid-cols-3 md:gap-8"
        >
          {engagements.map((e) => (
            <motion.article
              key={e.name}
              variants={cardIn}
              className={cn(
                "relative flex flex-col rounded-2xl border bg-surface-1/60 p-8 backdrop-blur-md md:p-10",
                e.highlight
                  ? "border-accent/40 shadow-[0_0_60px_rgb(230_50_175/0.15)]"
                  : "border-line",
              )}
            >
              {e.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-xs font-semibold uppercase tracking-widest text-white">
                  Most chosen
                </span>
              )}
              <span className="font-mono text-sm text-accent">{e.index}</span>
              <h3 className="mt-4 text-3xl font-medium tracking-tight md:text-4xl">
                {e.name}
              </h3>
              <p className="mt-3 text-sm text-fg-subtle">{e.best}</p>
              <p className="mt-6 text-fg-muted leading-relaxed">
                {e.description}
              </p>

              <ul className="mt-8 space-y-3 border-t border-line pt-8">
                {e.scope.map((s) => (
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

              <div className="mt-auto pt-8 grid gap-1 border-t border-line">
                <p className="text-xs uppercase tracking-widest text-fg-subtle pt-8">
                  Timeline
                </p>
                <p className="text-sm text-fg">{e.timeline}</p>
                <p className="mt-3 text-xs uppercase tracking-widest text-fg-subtle">
                  Investment
                </p>
                <p className="text-sm text-fg">{e.starting}</p>
              </div>

              <Link
                href={e.cta.href}
                className={cn(
                  "group mt-8 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-all duration-300",
                  e.highlight
                    ? "bg-accent text-white shadow-[0_4px_16px_rgb(230_50_175/0.3)] hover:bg-accent-soft"
                    : "border border-line-strong text-fg hover:bg-white/5 hover:border-accent",
                )}
              >
                {e.cta.label}
                <ArrowUpRight
                  size={14}
                  aria-hidden
                  className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </motion.article>
          ))}
        </motion.div>
      </section>

      {/* What's not included */}
      <section className="border-t border-line bg-surface-1/40 py-24 md:py-32">
        <div className="container-shell">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={stage}
            className="grid gap-12 md:grid-cols-[1fr_2fr] md:gap-20"
          >
            <motion.p className="eyebrow md:mt-2" variants={fadeUp}>
              Honest scope
            </motion.p>
            <motion.div variants={fadeUp} className="space-y-6 max-w-2xl">
              <p className="text-2xl font-medium leading-snug tracking-tight md:text-3xl">
                What we{" "}
                <span className="font-serif italic text-gradient">
                  don't do.
                </span>
              </p>
              <ul className="space-y-3 text-fg-muted md:text-lg leading-relaxed">
                <li>· Logo-only requests or one-off graphic work</li>
                <li>· Performance media buying or paid ad management</li>
                <li>· SEO-focused content farms</li>
                <li>· White-label work for other agencies</li>
              </ul>
              <p className="text-fg-muted md:text-lg leading-relaxed">
                Not a judgement on the work — just not the shape we're built
                for. If that's what you need, we can recommend studios who
                specialise.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
