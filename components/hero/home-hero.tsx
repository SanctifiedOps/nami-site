"use client";

import Link from "next/link";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "motion/react";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { Magnetic } from "@/components/motion/magnetic";
import { VideoBackground } from "@/components/hero/video-background";
import { HeroParticles } from "@/components/hero/particles";
import { LetterReveal } from "@/components/motion/letter-reveal";
import { fadeUp, ctaPop } from "@/lib/motion";

export function HomeHero() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  // Scroll parallax: content lifts + fades, the light mesh sinks slower (depth).
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -48]);
  const contentOpacity = useTransform(
    scrollYProgress,
    [0, 0.7],
    [1, reduced ? 1 : 0],
  );
  const meshY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 130]);

  // Cursor parallax: the two light fields lean toward / away from the pointer.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 60, damping: 20, mass: 0.5 });
  const smy = useSpring(my, { stiffness: 60, damping: 20, mass: 0.5 });
  const blobAX = useTransform(smx, [-1, 1], [-34, 34]);
  const blobAY = useTransform(smy, [-1, 1], [-26, 26]);
  const blobBX = useTransform(smx, [-1, 1], [28, -28]);
  const blobBY = useTransform(smy, [-1, 1], [22, -22]);

  const handlePointer = (e: React.PointerEvent<HTMLElement>) => {
    if (reduced) return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 2);
    my.set(((e.clientY - r.top) / r.height - 0.5) * 2);
  };

  const stageHero = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduced ? 0 : 0.12,
        delayChildren: reduced ? 0 : 0.15,
      },
    },
  };

  return (
    <section
      ref={ref}
      onPointerMove={handlePointer}
      className="relative flex min-h-[88vh] items-center overflow-hidden md:min-h-[96vh]"
    >
      <VideoBackground src="wave-3.mp4" overlay={0.72} />

      {/* Reactive liquid light — magenta + cyan fields, additive over the wave */}
      <motion.div
        aria-hidden
        style={{ y: meshY }}
        className="pointer-events-none absolute inset-0 z-0 mix-blend-screen"
      >
        {/* brand magenta field */}
        <motion.div
          style={{ x: blobAX, y: blobAY }}
          className="absolute -left-[12%] top-[0%] h-[58vh] w-[58vh] rounded-full blur-[110px]"
        >
          <div className="h-full w-full rounded-full bg-[radial-gradient(circle,rgb(255_0_188/0.45),transparent_68%)]" />
        </motion.div>
        {/* secondary cyan field */}
        <motion.div
          style={{ x: blobBX, y: blobBY }}
          className="absolute -right-[10%] bottom-[-4%] h-[52vh] w-[52vh] rounded-full blur-[120px]"
        >
          <div className="h-full w-full rounded-full bg-[radial-gradient(circle,rgb(100_200_255/0.34),transparent_68%)]" />
        </motion.div>
      </motion.div>

      <HeroParticles />

      {/* Blend the hero into the section below */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-40 bg-linear-to-b from-transparent to-surface-0"
      />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="container-shell relative z-10 py-24 text-center md:py-32"
      >
        <motion.div initial="hidden" animate="show" variants={stageHero}>
          <motion.p
            className="eyebrow mb-7 inline-flex items-center gap-3"
            variants={fadeUp}
          >
            <span className="relative inline-flex size-1.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
            </span>
            Waves of Creative Impact
          </motion.p>

          <h1 className="mx-auto max-w-[20ch] text-5xl font-semibold leading-[1.1] tracking-tight md:text-7xl">
            <LetterReveal stagger={0.018} duration={0.8}>
              Your business shouldn&rsquo;t depend on you{" "}
              <span className="text-gradient sm:block">
                being in every room.
              </span>
            </LetterReveal>
          </h1>

          <motion.p
            className="mx-auto mt-10 max-w-xl text-lg leading-relaxed text-fg-muted md:text-xl"
            variants={fadeUp}
          >
            Self-sustaining creative ecosystems for founders. One creative
            partner across brand, content, and growth systems.
          </motion.p>

          <motion.div
            className="mt-12 flex flex-wrap items-center justify-center gap-2 md:gap-4"
            variants={ctaPop}
          >
            <Magnetic>
              <Link
                href="/contact"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-accent px-8 py-4 text-sm font-semibold text-white shadow-[0_4px_20px_rgb(255_0_188/0.3)] transition-shadow duration-500 hover:shadow-[0_8px_40px_rgb(255_0_188/0.55)]"
              >
                <span className="absolute inset-0 -z-10 translate-y-full bg-accent-soft transition-transform duration-500 ease-out-expo group-hover:translate-y-0" />
                Start a project
                <ArrowUpRight
                  size={16}
                  aria-hidden
                  className="transition-transform duration-500 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </Magnetic>

            <Magnetic strength={0.25}>
              <Link
                href="/work"
                className="group inline-flex items-center gap-2 rounded-full border border-line-strong px-8 py-4 text-sm font-semibold text-fg backdrop-blur-sm transition-colors duration-300 hover:border-accent hover:bg-white/5"
              >
                See selected work
                <ArrowRight
                  size={16}
                  aria-hidden
                  className="transition-transform duration-500 ease-out-expo group-hover:translate-x-1"
                />
              </Link>
            </Magnetic>
          </motion.div>

          <motion.div
            className="mx-auto mt-20 flex max-w-2xl flex-col items-center gap-4 border-t border-line pt-8 md:mt-28"
            variants={fadeUp}
          >
            <p className="mono-label">Currently building</p>
            <p className="text-sm text-fg-subtle md:text-base">
              Brand systems · content engines · funnel websites · automation
              infrastructure for founders building something deliberate.
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
