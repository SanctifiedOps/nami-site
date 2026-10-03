"use client";

import { motion } from "motion/react";
import { work, type CaseStudy } from "@/lib/content/work";
import { stageFast } from "@/lib/motion";
import { WorkCard } from "./work-card";

type Props = {
  items?: CaseStudy[];
  slugs?: string[];
  columns?: 2 | 3;
  compact?: boolean;
};

export function WorkGrid({ items, slugs, columns = 2, compact = false }: Props) {
  const visibleItems = items ?? (slugs ? work.filter((study) => slugs.includes(study.slug)) : work);

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
      variants={stageFast}
      className={
        columns === 3
          ? "grid gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3"
          : "grid gap-6 md:grid-cols-2 md:gap-8"
      }
    >
      {visibleItems.map((study) => (
        <WorkCard key={study.slug} study={study} compact={compact} />
      ))}
    </motion.div>
  );
}
