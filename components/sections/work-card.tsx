"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { type CaseStudy } from "@/lib/content/work";
import { cardIn } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Props = {
  study: CaseStudy;
  className?: string;
  compact?: boolean;
};

export function WorkCard({ study, className, compact = false }: Props) {
  return (
    <motion.article variants={cardIn} className={cn("group", className)}>
      <Link href={`/work/${study.slug}`} className="block h-full">
        <div className="relative aspect-[16/10] overflow-hidden border border-line bg-surface-2">
          <Image
            src={study.cover}
            alt={`${study.client}: ${study.oneLiner}`}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-transparent"
          />
        </div>

        <div className="border-b border-line py-6">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs uppercase tracking-[0.14em]">
            <span className="font-semibold text-accent">{study.client}</span>
            <span className="text-fg-subtle">{study.sector}</span>
          </div>
          <h3 className="mt-4 text-2xl font-medium leading-[1.04] tracking-tight md:text-[1.75rem]">
            {study.tagline}
          </h3>
          <p className="mt-4 max-w-xl leading-[1.5] text-fg-muted">
            {study.oneLiner}
          </p>

          {!compact && study.outcomes && study.outcomes.length > 0 ? (
            <dl className="mt-6 grid gap-4 border-t border-line pt-5 sm:grid-cols-2">
              {study.outcomes.slice(0, 2).map((outcome) => (
                <div key={outcome.label}>
                  <dt className="text-[10px] uppercase tracking-[0.14em] text-fg-subtle">
                    {outcome.label}
                  </dt>
                  <dd className="mt-1 text-lg font-medium tracking-tight text-fg">
                    {outcome.value}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}

          <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-fg transition-colors group-hover:text-accent">
            Read case study
            <ArrowUpRight
              size={14}
              aria-hidden
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
