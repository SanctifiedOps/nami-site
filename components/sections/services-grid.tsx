"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/lib/content/services";
import { cardIn, stageFast } from "@/lib/motion";
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
      <Link
        href="/contact"
        className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-accent/30 bg-surface-1/60 p-8 backdrop-blur-md transition-colors duration-500 hover:border-accent/60 md:p-10"
      >
        {/* Ambient accent glow: stronger than the service cards' hover glow, always on */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-60 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(450px circle at 70% 100%, rgb(230 50 175 / 0.22), transparent 70%)",
          }}
        />

        <div className="relative flex flex-1 flex-col gap-6">
          <div className="flex items-start justify-between">
            <span className="font-mono text-xs text-fg-subtle">06</span>
            <ArrowUpRight
              size={28}
              aria-hidden
              className="text-accent transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </div>

          <div className="space-y-3">
            <p className="eyebrow text-accent/80">Start a project</p>
            <h3 className="text-2xl font-medium tracking-tight text-fg md:text-3xl">
              Bring us{" "}
              <span className="text-gradient">
                your brief.
              </span>
            </h3>
            <p className="text-fg-muted leading-relaxed">
              We take a small number of new engagements each quarter. Brand,
              content, systems, or all of it together.
            </p>
          </div>

          <div className="mt-auto inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white shadow-[0_4px_16px_rgb(230_50_175/0.25)] transition-shadow duration-500 group-hover:shadow-[0_8px_32px_rgb(230_50_175/0.5)] w-fit">
            Open a conversation
            <ArrowUpRight
              size={14}
              aria-hidden
              className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
