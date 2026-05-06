"use client";

import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { ACCENT_GRADIENTS, type CaseStudy } from "@/lib/content/work";
import { cardIn } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Props = {
  study: CaseStudy;
  className?: string;
};

export function WorkCard({ study, className }: Props) {
  const reduced = useReducedMotion();
  const Icon = study.icon;
  const accent = ACCENT_GRADIENTS[study.accent];

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { damping: 18, stiffness: 220 });
  const sry = useSpring(ry, { damping: 18, stiffness: 220 });

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || e.pointerType === "touch") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / rect.width;
    const dy = (e.clientY - cy) / rect.height;
    ry.set(dx * 5);
    rx.set(-dy * 5);
  };

  const handleLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      variants={cardIn}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 1200 }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={cn("group", className)}
    >
      <Link
        href={`/work/${study.slug}`}
        className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface-1/60 backdrop-blur-md transition-colors duration-500 hover:border-accent/40"
      >
        {/* Visual band: case study cover */}
        <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-surface-2">
          <Image
            src={study.cover}
            alt={`${study.client}: ${study.oneLiner}`}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-1000 ease-out-expo group-hover:scale-105"
          />
          {/* Legibility mask: top + bottom gradients so badges and icon stay readable */}
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
                style={{
                  boxShadow: `0 0 12px ${accent.glow}`,
                }}
              />
              {study.status}
            </span>
          </div>
          <div className="absolute bottom-6 left-6 inline-grid size-12 place-items-center rounded-xl border border-line bg-surface-0/70 backdrop-blur-md">
            <Icon size={20} className="text-accent" aria-hidden />
          </div>
        </div>

        {/* Body */}
        <div className="relative flex flex-1 flex-col gap-5 p-8">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs">
            <span className="eyebrow text-accent/80">{study.client}</span>
            <span className="text-fg-subtle">·</span>
            <span className="text-fg-subtle">{study.sector}</span>
          </div>

          <h3 className="text-2xl font-medium leading-snug tracking-tight md:text-[1.6rem]">
            <span className="text-gradient">
              {study.tagline}
            </span>
          </h3>

          <p className="text-fg-muted leading-relaxed">{study.oneLiner}</p>

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
              className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
