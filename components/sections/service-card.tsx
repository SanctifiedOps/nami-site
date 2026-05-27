"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { Service } from "@/lib/content/services";
import { cardIn } from "@/lib/motion";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import { cn } from "@/lib/utils";

type Props = {
  service: Service;
  className?: string;
};

export function ServiceCard({ service, className }: Props) {
  const Icon = service.icon;

  return (
    <motion.div variants={cardIn} className={cn(className)}>
      <SpotlightCard
        tilt={5}
        className="glass-refractive glass-refractive--hover h-full rounded-2xl"
      >
        <Link
          href={`/services/${service.slug}`}
          className="relative z-10 flex h-full flex-col gap-6 rounded-2xl p-8 md:p-10"
        >
          <div className="flex items-start justify-between">
            <span className="mono-label">{service.index}</span>
            <Icon
              size={28}
              aria-hidden
              className="text-accent transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:scale-110"
            />
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent/80">
              {service.pillar}
            </p>
            <h3 className="text-2xl font-medium tracking-tight text-fg md:text-3xl">
              {service.title}
            </h3>
            <p className="leading-relaxed text-fg-muted">{service.tagline}</p>
          </div>

          <div className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-fg/80 transition-colors group-hover:text-accent">
            Read more
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
