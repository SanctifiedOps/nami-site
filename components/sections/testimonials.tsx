"use client";

import { motion } from "motion/react";
import { ArrowUpRight, Quote } from "lucide-react";
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
  backgroundImage?: string;
  uniform?: boolean;
};

/** Diagonal vertical offsets per column so the row reads editorial, not grid. */
const OFFSETS = ["lg:mt-0", "lg:mt-12", "lg:mt-24"];

export function Testimonials({
  items = defaultTestimonials,
  eyebrow,
  title,
  lead,
  className,
  backgroundImage,
  uniform = false,
}: Props) {
  return (
    <section
      className={cn(
        "relative overflow-hidden border-t border-line bg-surface-1/40 py-24 md:py-32",
        className,
      )}
    >
      {backgroundImage ? (
        <div aria-hidden className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-35"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,10,.82),rgba(8,8,10,.94))]" />
        </div>
      ) : null}

      <div className="container-shell relative z-10">
        <SectionHeading
          align="center"
          eyebrow={eyebrow}
          title={
            title ?? (
              <>
                What people say{" "}
                <span className="text-gradient sm:block">about the work</span>
              </>
            )
          }
          lead={
            lead ??
            "Honest words from founders, operators, and people I have worked alongside."
          }
          className="mb-16 md:mb-20"
        />

        <motion.ul
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={stageFast}
          className={cn(
            "grid gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3",
            uniform ? "lg:items-stretch" : "lg:items-start",
          )}
        >
          {items.map((t, i) => (
            <motion.li
              key={t.author}
              variants={cardIn}
              className={cn(
                uniform && "h-full",
                !uniform && OFFSETS[i % OFFSETS.length],
              )}
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
                    {t.href ? (
                      <a
                        href={t.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-accent transition-colors hover:text-accent-soft"
                        aria-label={`Read ${t.author}'s review on Google`}
                      >
                        Read on Google
                        <ArrowUpRight
                          size={13}
                          aria-hidden
                          className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </a>
                    ) : null}
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
