"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { services } from "@/lib/content/services";
import { stageFast, cardIn } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * The five-pillar system map. Shows every service as one connected system with
 * the current pillar lit; the others are live links. Makes each service page
 * say "this is one of five, here is where it sits" instead of flat prose.
 */
export function PillarMap({ currentSlug }: { currentSlug: string }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={stageFast}
      className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5"
    >
      {services.map((s) => {
        const active = s.slug === currentSlug;
        const Icon = s.icon;
        const short = s.title.split(" + ")[0];

        const body = (
          <div
            className={cn(
              "flex h-full flex-col gap-5 rounded-2xl p-6 transition-colors duration-500",
              active
                ? "glass-refractive border-accent/50"
                : "border border-line bg-surface-1/40 hover:border-line-strong",
            )}
          >
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  "font-mono text-xs",
                  active ? "text-accent" : "text-fg-subtle",
                )}
              >
                {s.index}
              </span>
              <Icon
                size={18}
                aria-hidden
                className={active ? "text-accent" : "text-fg-subtle"}
              />
            </div>
            <p
              className={cn(
                "text-sm font-medium leading-snug tracking-tight",
                active ? "text-fg" : "text-fg-muted",
              )}
            >
              {short}
            </p>
            <span
              className={cn(
                "mono-label mt-auto",
                active ? "text-accent/80" : "text-fg-subtle/70",
              )}
            >
              {active ? "You are here" : "View"}
            </span>
          </div>
        );

        return (
          <motion.div key={s.slug} variants={cardIn} className="h-full">
            {active ? (
              body
            ) : (
              <Link href={`/services/${s.slug}`} className="block h-full">
                {body}
              </Link>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
