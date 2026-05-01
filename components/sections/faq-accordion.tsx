"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus } from "lucide-react";
import { faq as defaultFaq, type FAQ } from "@/lib/content/faq";
import { stageFast, fadeUp, EASE_OUT_EXPO } from "@/lib/motion";

type Props = {
  items?: FAQ[];
};

export function FAQAccordion({ items = defaultFaq }: Props) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <motion.ul
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      variants={stageFast}
      className="divide-y divide-line border-y border-line"
    >
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <motion.li key={item.question} variants={fadeUp}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-6 py-6 text-left transition-colors hover:text-fg md:py-8"
            >
              <span className="text-lg font-medium tracking-tight text-fg md:text-xl">
                {item.question}
              </span>
              <span
                aria-hidden
                className="grid size-9 shrink-0 place-items-center rounded-full border border-line bg-surface-1 text-fg transition-colors group-hover:border-accent"
              >
                <motion.span
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
                  className="inline-flex"
                >
                  <Plus size={16} />
                </motion.span>
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
                  className="overflow-hidden"
                >
                  <p className="max-w-3xl pb-8 pr-12 text-fg-muted leading-relaxed md:text-lg">
                    {item.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.li>
        );
      })}
    </motion.ul>
  );
}
