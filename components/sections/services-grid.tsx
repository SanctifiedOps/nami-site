"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/lib/content/services";
import { cardIn, stageFast } from "@/lib/motion";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import { ServiceCard } from "./service-card";

export function ServicesGrid() {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      variants={stageFast}
      className="grid gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3"
    >
      {services.map((service) => (
        <ServiceCard key={service.slug} service={service} />
      ))}
      <ServicesCtaCard />
    </motion.div>
  );
}

/** Sixth-cell CTA: fills the grid without touching the "five pillars" positioning. */
function ServicesCtaCard() {
  return (
    <motion.div variants={cardIn} className="group">
      <SpotlightCard
        tilt={5}
        glow={0.26}
        className="glass-refractive h-full rounded-2xl border-accent/30"
      >
        {/* Always-on ambient glow — this is the conversion cell, so it reads warmer */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 rounded-2xl opacity-70"
          style={{
            background:
              "radial-gradient(460px circle at 70% 100%, rgb(255 0 188 / 0.2), transparent 70%)",
          }}
        />
        <Link
          href="/contact"
          className="relative z-10 flex h-full flex-col gap-6 rounded-2xl p-8 md:p-10"
        >
          <div className="flex items-start justify-between">
            <span className="mono-label">06</span>
            <ArrowUpRight
              size={28}
              aria-hidden
              className="text-accent transition-transform duration-500 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent/80">
              Start a project
            </p>
            <h3 className="text-2xl font-medium tracking-tight text-fg md:text-3xl">
              Bring us <span className="text-gradient">your brief.</span>
            </h3>
            <p className="leading-relaxed text-fg-muted">
              We take a small number of new engagements each quarter. Brand,
              content, systems, or all of it together.
            </p>
          </div>

          <div className="mt-auto inline-flex w-fit items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white shadow-[0_4px_16px_rgb(255_0_188/0.25)] transition-shadow duration-500 group-hover:shadow-[0_8px_32px_rgb(255_0_188/0.5)]">
            Open a conversation
            <ArrowUpRight
              size={14}
              aria-hidden
              className="transition-transform duration-500 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </div>
        </Link>
      </SpotlightCard>
    </motion.div>
  );
}
