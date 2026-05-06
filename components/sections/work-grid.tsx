"use client";

import { motion } from "motion/react";
import { work, type CaseStudy } from "@/lib/content/work";
import { stageFast } from "@/lib/motion";
import { WorkCard } from "./work-card";

type Props = {
  items?: CaseStudy[];
  columns?: 2 | 3;
};

export function WorkGrid({ items = work, columns = 2 }: Props) {
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
      {items.map((study) => (
        <WorkCard key={study.slug} study={study} />
      ))}
    </motion.div>
  );
}
