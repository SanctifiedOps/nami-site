"use client";

import { motion } from "motion/react";
import { Quote } from "lucide-react";
import {
  testimonials as defaultTestimonials,
  type Testimonial,
} from "@/lib/content/testimonials";
import { SectionHeading } from "@/components/sections/section-heading";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import { stageFast, cardIn } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Props = {
  items?: Testimonial[];
  eyebrow?: string;
  title?: React.ReactNode;
  lead?: string;
  className?: string;
};

/** Diagonal vertical offsets per column so the row reads editorial, not grid. */
const OFFSETS = ["lg:mt-0", "lg:mt-12", "lg:mt-24"];

export function Testimonials({
  items = defaultTestimonials,
  eyebrow,
  title,
  lead,
  className,
}: Props) {
  return (
    <section
      className={cn(
        "relative border-t border-line bg-surface-1/40 py-24 md:py-32",
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
          className="grid gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3 lg:items-start"
        >
          {items.map((t, i) => (
            <motion.li
              key={t.author}
              variants={cardIn}
              className={cn(OFFSETS[i % OFFSETS.length])}
            >
              <SpotlightCard
                tilt={0}
                glow={0.14}
                className="glass-refractive glass-refractive--hover h-full rounded-2xl"
              >
                <figure className="relative z-10 flex h-full flex-col gap-6 p-8 md:p-10">
                  <Quote
                    size={32}
                    aria-hidden
                    className="shrink-0 text-accent/70"
                  />
                  <blockquote className="flex-1 leading-relaxed text-fg md:text-lg">
                    {t.quote}
                  </blockquote>
                  <figcaption className="border-t border-line pt-5">
                    <p className="font-medium tracking-tight text-fg">
                      {t.author}
                    </p>
                    <p className="mt-1 text-sm text-fg-subtle">{t.role}</p>
                  </figcaption>
                </figure>
              </SpotlightCard>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
