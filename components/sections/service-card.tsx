"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { Service } from "@/lib/content/services";
import { cardIn } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Props = {
  service: Service;
  className?: string;
};

export function ServiceCard({ service, className }: Props) {
  return (
    <motion.article variants={cardIn} className={cn("group h-full", className)}>
      <Link
        href={`/services/${service.slug}`}
        className="flex min-h-72 h-full flex-col border border-line bg-surface-1 p-7 transition-colors hover:border-accent/55 hover:bg-surface-2 md:min-h-80 md:p-9"
      >
        <p className="text-sm font-medium text-accent">{service.pillar}</p>
        <h3 className="mt-8 max-w-sm text-2xl font-semibold leading-tight tracking-[-0.025em] text-fg md:text-3xl">
          {service.title}
        </h3>
        <p className="mt-4 max-w-sm leading-[1.5] text-fg-muted">{service.tagline}</p>
        <span className="mt-auto inline-flex items-center gap-2 pt-8 text-sm font-semibold text-fg transition-colors group-hover:text-accent">
          Explore this service
          <ArrowUpRight size={14} aria-hidden className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </Link>
    </motion.article>
  );
}
