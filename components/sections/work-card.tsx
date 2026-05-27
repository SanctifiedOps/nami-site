"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { ACCENT_GRADIENTS, type CaseStudy } from "@/lib/content/work";
import { cardIn } from "@/lib/motion";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import { cn } from "@/lib/utils";

type Props = {
  study: CaseStudy;
  className?: string;
};

export function WorkCard({ study, className }: Props) {
  const Icon = study.icon;
  const accent = ACCENT_GRADIENTS[study.accent];

  return (
    <motion.div variants={cardIn} className={cn(className)}>
      <SpotlightCard
        tilt={5}
        className="glass-refractive glass-refractive--hover h-full rounded-2xl"
      >
        <Link
          href={`/work/${study.slug}`}
          className="relative z-10 flex h-full flex-col overflow-hidden rounded-2xl"
        >
          {/* Visual band: case study cover */}
          <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-surface-2">
            <Image
              src={study.cover}
              alt={`${study.client}: ${study.oneLiner}`}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-1000 ease-out-expo group-hover:scale-[1.06]"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-linear-to-b from-surface-0/55 via-transparent to-surface-0/45"
            />
            <div className="absolute inset-0 flex items-start justify-between p-6">
              <span className="inline-flex items-center rounded-full border border-line bg-surface-0/70 px-3 py-1 font-mono text-[10px] tracking-widest text-fg-muted backdrop-blur-md">
                {study.index}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-0/70 px-3 py-1 text-[10px] uppercase tracking-widest text-fg-muted backdrop-blur-md">
                <span
                  className="size-1.5 rounded-full bg-accent"
                  style={{ boxShadow: `0 0 12px ${accent.glow}` }}
                />
                {study.status}
              </span>
            </div>
            <div className="absolute bottom-6 left-6 inline-grid size-12 place-items-center rounded-xl border border-line bg-surface-0/70 backdrop-blur-md transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5">
              <Icon size={20} className="text-accent" aria-hidden />
            </div>
          </div>

          {/* Body */}
          <div className="relative flex flex-1 flex-col gap-5 p-8">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent/80">
                {study.client}
              </span>
              <span className="text-fg-subtle">·</span>
              <span className="text-fg-subtle">{study.sector}</span>
            </div>

            <h3 className="text-2xl font-medium leading-snug tracking-tight md:text-[1.6rem]">
              <span className="text-gradient">{study.tagline}</span>
            </h3>

            <p className="leading-relaxed text-fg-muted">{study.oneLiner}</p>

            <div className="flex flex-wrap gap-2 pt-2">
              {study.pillars.map((p) => (
                <span
                  key={p}
                  className="rounded-full border border-line bg-surface-2/60 px-3 py-1 text-[10px] uppercase tracking-widest text-fg-subtle"
                >
                  {p}
                </span>
              ))}
            </div>

            <div className="mt-auto inline-flex items-center gap-2 text-sm font-medium text-fg/80 transition-colors group-hover:text-accent">
              Read case study
              <ArrowUpRight
                size={14}
                aria-hidden
                className="transition-transform duration-500 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </div>
          </div>
        </Link>
      </SpotlightCard>
    </motion.div>
  );
}
