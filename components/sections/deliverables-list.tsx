"use client";

import { motion } from "motion/react";
import { stageFast, fadeUp } from "@/lib/motion";

/**
 * A compact list of what the client received.
 */
export function DeliverablesList({ items }: { items: string[] }) {
  const finalRowStartsWithThree = items.length % 2 === 1 && items.length > 1;
  const threeItemRowStart = finalRowStartsWithThree ? items.length - 3 : -1;

  return (
    <motion.ul
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      variants={stageFast}
      className="grid gap-3 md:grid-cols-12"
    >
      {items.map((item, itemIndex) => {
        const isFinalThree = itemIndex >= threeItemRowStart && threeItemRowStart >= 0;
        const pairIndex = Math.floor(itemIndex / 2);
        const isWide = pairIndex % 2 === 0 ? itemIndex % 2 === 0 : itemIndex % 2 !== 0;

        return (
          <motion.li
            key={item}
            variants={fadeUp}
            className={`group relative overflow-hidden border border-line px-5 py-5 leading-relaxed text-fg-muted transition-[transform,border-color,background-color,box-shadow] duration-700 ease-[var(--ease-out-expo)] hover:-translate-y-1.5 hover:border-accent/35 hover:text-fg hover:shadow-[0_16px_42px_rgb(0_0_0/0.22)] motion-reduce:transform-none md:px-6 md:py-6 ${
              isFinalThree ? "md:col-span-4" : isWide ? "md:col-span-7" : "md:col-span-5"
            } ${
              itemIndex % 3 === 0
                ? "bg-[linear-gradient(135deg,rgb(255_0_188/0.08),rgb(17_18_21/0.5)_58%)]"
                : "bg-surface-1/45"
            }`}
          >
            <span className="relative z-10">{item}</span>
            <span
              aria-hidden
              className="absolute -bottom-12 -right-10 size-28 rounded-full bg-accent/0 blur-3xl transition-colors duration-700 group-hover:bg-accent/10"
            />
          </motion.li>
        );
      })}
    </motion.ul>
  );
}
