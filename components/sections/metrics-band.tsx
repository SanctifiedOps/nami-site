"use client";

import { motion } from "motion/react";
import { stageFast, blurUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Metric = { label: string; value: string };

/** Pick a value size so numeric stats read huge while long string values stay legible. */
function valueSize(value: string): string {
  const len = value.length;
  if (len <= 7) return "text-[clamp(2.5rem,6vw,4.5rem)]";
  if (len <= 16) return "text-[clamp(1.75rem,3.6vw,2.75rem)]";
  return "text-lg md:text-xl leading-snug";
}

/**
 * Instrument-readout metrics showcase. Divided grid, oversized gradient values
 * alternating magenta/cyan (the brand duality finally doing work), mono labels.
 * The proof moment on a case study.
 */
export function MetricsBand({
  items,
  className,
}: {
  items: Metric[];
  className?: string;
}) {
  if (!items?.length) return null;
  const cols =
    items.length >= 4
      ? "md:grid-cols-4"
      : items.length === 3
        ? "md:grid-cols-3"
        : "md:grid-cols-2";

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      variants={stageFast}
      className={cn(
        "grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line",
        cols,
        className,
      )}
    >
      {items.map((m, i) => (
        <motion.div
          key={m.label}
          variants={blurUp}
          className="flex flex-col bg-surface-1/60 p-8 backdrop-blur-md md:p-10"
        >
          <span aria-hidden className="block h-px w-8 bg-accent" />
          <p
            className={cn(
              "mt-6 font-semibold leading-none tracking-tight",
              valueSize(m.value),
              i % 2 === 0 ? "text-gradient" : "text-gradient-cyan",
            )}
          >
            {m.value}
          </p>
          <p className="mono-label mt-auto pt-4">{m.label}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}
