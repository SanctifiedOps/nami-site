"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useMotionValueEvent,
  useReducedMotion,
} from "motion/react";
import { Check } from "lucide-react";
import { processSteps } from "@/lib/content/process";
import { LetterReveal } from "@/components/motion/letter-reveal";
import { cn } from "@/lib/utils";

type Props = {
  index?: string;
  title?: React.ReactNode;
  lead?: string;
};

const DEFAULT_TITLE = (
  <>
    A process that gets you out of the{" "}
    <span className="text-gradient sm:block">day-to-day.</span>
  </>
);

/**
 * Pinned scroll-storytelling. The left column sticks while the phase cards
 * scroll past on the right; a vertical rail fills with scroll progress and the
 * active phase lights up in sync. This is the signature scroll moment, reused
 * on the homepage and the /process page. Falls back to a clean stacked list
 * under reduced motion (the sticky is pure CSS; the rail fill + active-dim are
 * the only motion, and both are informational rather than decorative).
 */
export function ProcessScroll({
  index = "02 / How we work",
  title = DEFAULT_TITLE,
  lead = "Four phases. The strategic thinking, the build, the launch, and the system that keeps running after we leave. Tight enough to ship in eight weeks, deep enough to keep working two years on.",
}: Props = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 55%", "end 75%"],
  });
  const fill = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.min(
      processSteps.length - 1,
      Math.max(0, Math.floor(v * processSteps.length)),
    );
    setActive(idx);
  });

  return (
    <div
      ref={ref}
      className="relative grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20"
    >
      {/* Sticky left: heading + scroll-spy stepper */}
      <div className="lg:sticky lg:top-28 lg:self-start">
        {index && <span className="mono-label">{index}</span>}
        <h2 className="mt-5 text-4xl font-semibold leading-[1.1] tracking-tight md:text-5xl">
          <LetterReveal stagger={0.014} duration={0.65}>
            {title}
          </LetterReveal>
        </h2>
        <p className="mt-6 max-w-md leading-relaxed text-fg-muted md:text-lg">
          {lead}
        </p>

        <ol className="relative mt-10 hidden pl-7 lg:block">
          <span className="absolute bottom-2 left-[5px] top-2 w-px bg-line" />
          <motion.span
            style={{ scaleY: reduced ? 1 : fill }}
            className="absolute bottom-2 left-[5px] top-2 w-px origin-top bg-accent shadow-[0_0_10px_rgb(255_0_188/0.7)]"
          />
          {processSteps.map((step, i) => (
            <li
              key={step.number}
              className="relative py-3 first:pt-0 last:pb-0"
            >
              <span
                aria-hidden
                className={cn(
                  "absolute -left-7 top-1/2 size-2.5 -translate-y-1/2 rounded-full border transition-colors duration-500",
                  i <= active
                    ? "border-accent bg-accent shadow-[0_0_10px_rgb(255_0_188/0.8)]"
                    : "border-line-strong bg-surface-0",
                )}
              />
              <span
                className={cn(
                  "text-lg font-medium tracking-tight transition-colors duration-500",
                  i === active ? "text-fg" : "text-fg-subtle",
                )}
              >
                {step.title}
              </span>
            </li>
          ))}
        </ol>
      </div>

      {/* Scrolling right: phase cards */}
      <div className="space-y-6">
        {processSteps.map((step, i) => {
          const isActive = i === active;
          return (
            <motion.article
              key={step.number}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "glass-refractive rounded-3xl p-8 transition-colors duration-500 md:p-10",
                isActive ? "border-accent/40" : "border-line",
              )}
            >
              <motion.div
                animate={{ opacity: reduced ? 1 : isActive ? 1 : 0.55 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-sm text-accent">
                    {step.number}
                  </span>
                  <div>
                    <h3 className="text-2xl font-medium tracking-tight md:text-3xl">
                      {step.title}
                    </h3>
                    <p className="mono-label mt-1">{step.duration}</p>
                  </div>
                </div>
                <p className="mt-6 leading-relaxed text-fg-muted">
                  {step.summary}
                </p>
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
              </motion.div>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}
