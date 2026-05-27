"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight, Check } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import { engagements } from "@/lib/content/engagement";
import { stage, stageFast, fadeUp, cardIn } from "@/lib/motion";
import { cn } from "@/lib/utils";

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Investment"
        title={
          <>
            Three ways to{" "}
            <span className="text-gradient sm:block">work together.</span>
          </>
        }
        lead="Engagements are sized to the work, not packaged. Pricing depends on the breadth and depth of the engagement. Here's how we structure the work."
      />

      <section className="container-shell py-24 md:py-32">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={stageFast}
          className="grid gap-6 md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-8"
        >
          {engagements.map((e) => (
            <motion.div key={e.name} variants={cardIn} className="relative h-full">
              <SpotlightCard
                tilt={0}
                glow={e.highlight ? 0.24 : 0.14}
                className={cn(
                  "glass-refractive glass-refractive--hover h-full rounded-2xl",
                  e.highlight && "border-accent/40 shadow-[0_0_60px_rgb(255_0_188/0.15)]",
                )}
              >
                {e.highlight && (
                  <span className="absolute -top-3 left-1/2 z-20 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-xs font-semibold uppercase tracking-widest text-white">
                    Most chosen
                  </span>
                )}
                <div className="relative z-10 flex h-full flex-col p-6 md:p-8 lg:p-10">
                  <span className="font-mono text-sm text-accent">{e.index}</span>
                  <h3 className="mt-4 text-3xl font-medium tracking-tight md:text-4xl">
                    {e.name}
                  </h3>
                  <p className="mt-3 text-sm text-fg-subtle">{e.best}</p>
                  <p className="mt-6 leading-relaxed text-fg-muted">
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

                  <div className="mt-auto grid gap-1 border-t border-line pt-8">
                    <p className="pt-8 text-xs uppercase tracking-widest text-fg-subtle">
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
                        ? "bg-accent text-white shadow-[0_4px_16px_rgb(255_0_188/0.3)] hover:bg-accent-soft"
                        : "border border-line-strong text-fg hover:border-accent hover:bg-white/5",
                    )}
                  >
                    {e.cta.label}
                    <ArrowUpRight
                      size={14}
                      aria-hidden
                      className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </Link>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* How we shape work */}
      <section className="border-t border-line bg-surface-1/40 py-24 md:py-32">
        <div className="container-shell">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={stage}
            className="grid gap-12 md:grid-cols-[1fr_2fr] md:gap-20"
          >
            <motion.p className="mono-label md:mt-2" variants={fadeUp}>
              Honest pricing
            </motion.p>
            <motion.div variants={fadeUp} className="space-y-6 max-w-2xl">
              <p className="text-2xl font-medium leading-snug tracking-tight md:text-3xl">
                How we{" "}
                <span className="text-gradient">shape work.</span>
              </p>
              <p className="text-fg-muted md:text-lg leading-relaxed">
                We talk to every potential client first. Real conversation, not
                a quote-bot. We'll understand what you're trying to build,
                what's working, what's stuck, and what good would look like in
                six months. Then we plan honestly to that.
              </p>
              <p className="text-fg-muted md:text-lg leading-relaxed">
                Some engagements need the whole system. Some need a brand
                refresh and a website. Some are smaller still. We don't
                push more work than is needed, and we don't take on work we're
                not the right shape for. If a different studio fits better,
                we'll point you there.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
