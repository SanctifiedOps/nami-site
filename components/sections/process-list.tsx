"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import { processSteps } from "@/lib/content/process";
import { stageFast, fadeUp } from "@/lib/motion";

export function ProcessList() {
  return (
    <motion.ol
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      variants={stageFast}
      className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line"
    >
      {processSteps.map((step) => (
        <motion.li
          key={step.number}
          variants={fadeUp}
          className="bg-surface-1/60 p-8 backdrop-blur-sm md:p-12 lg:grid lg:grid-cols-[auto_1fr_2fr] lg:gap-10"
        >
          <span className="font-mono text-sm text-accent md:text-base">
            {step.number}
          </span>
          <div className="mt-3 lg:mt-0">
            <h3 className="text-2xl font-medium tracking-tight md:text-3xl">
              {step.title}
            </h3>
            <p className="mt-2 text-sm text-fg-subtle">{step.duration}</p>
          </div>
          <div className="mt-6 lg:mt-0">
            <p className="text-fg-muted leading-relaxed">{step.summary}</p>
            <ul className="mt-6 grid gap-2.5 text-sm text-fg-muted md:grid-cols-2">
              {step.detail.map((line) => (
                <li key={line} className="flex items-start gap-2.5">
                  <Check
                    size={14}
                    aria-hidden
                    className="mt-1 shrink-0 text-accent"
                  />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.li>
      ))}
    </motion.ol>
  );
}
