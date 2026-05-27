"use client";

import { motion } from "motion/react";
import { stageFast, fadeUp } from "@/lib/motion";

/**
 * Deliverables as a light, balanced two-column spec list. Hairline row
 * dividers, continuous numbering across columns, no heavy bordered box.
 * Replaces the bulky divided-grid that left a lonely full-width last row.
 */
export function DeliverablesList({ items }: { items: string[] }) {
  const mid = Math.ceil(items.length / 2);
  const columns = [items.slice(0, mid), items.slice(mid)];

  return (
    <div className="grid gap-x-12 sm:grid-cols-2 lg:gap-x-20">
      {columns.map((col, ci) => (
        <motion.ul
          key={ci}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stageFast}
          className="border-t border-line"
        >
          {col.map((d, i) => {
            const n = ci === 0 ? i + 1 : mid + i + 1;
            return (
              <motion.li
                key={d}
                variants={fadeUp}
                className="group flex items-baseline gap-5 border-b border-line py-5"
              >
                <span className="font-mono text-xs text-accent">
                  {String(n).padStart(2, "0")}
                </span>
                <span className="leading-relaxed text-fg transition-colors duration-300 group-hover:text-accent">
                  {d}
                </span>
              </motion.li>
            );
          })}
        </motion.ul>
      ))}
    </div>
  );
}
