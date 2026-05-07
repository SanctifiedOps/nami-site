"use client";

import { motion } from "motion/react";
import { Quote } from "lucide-react";
import {
  testimonials as defaultTestimonials,
  type Testimonial,
} from "@/lib/content/testimonials";
import { SectionHeading } from "@/components/sections/section-heading";
import { stageFast, cardIn } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Props = {
  items?: Testimonial[];
  eyebrow?: string;
  title?: React.ReactNode;
  lead?: string;
  className?: string;
};

export function Testimonials({
  items = defaultTestimonials,
  eyebrow = "Words from clients",
  title,
  lead,
  className,
}: Props) {
  return (
    <section
      className={cn(
        "border-t border-line bg-surface-1/40 py-24 md:py-32",
        className,
      )}
    >
      <div className="container-shell">
        <SectionHeading
          align="center"
          eyebrow={eyebrow}
          title={
            title ?? (
              <>
                What people say{" "}
                <span className="text-gradient sm:block">about the work.</span>
              </>
            )
          }
          lead={
            lead ??
            "Honest words from founders, operators, and partners we've shipped alongside."
          }
          className="mb-16 md:mb-20"
        />

        <motion.ul
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={stageFast}
          className="grid gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3"
        >
          {items.map((t) => (
            <motion.li
              key={t.author}
              variants={cardIn}
              className="group relative flex flex-col gap-6 rounded-2xl border border-line bg-surface-1/60 p-8 backdrop-blur-md transition-colors hover:border-accent/40 md:p-10"
            >
              <Quote
                size={28}
                aria-hidden
                className="shrink-0 text-accent"
              />
              <blockquote className="flex-1 text-fg-muted leading-relaxed md:text-lg">
                {t.quote}
              </blockquote>
              <figcaption className="border-t border-line pt-5">
                <p className="font-medium tracking-tight text-fg">
                  {t.author}
                </p>
                <p className="mt-1 text-sm text-fg-subtle">{t.role}</p>
              </figcaption>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
