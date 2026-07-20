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
      className="relative flex min-h-[calc(100svh-5rem)] items-center overflow-hidden"
    >
      <VideoBackground src="wave-3.mp4" overlay={0.72} />

      {/* Reactive liquid light: magenta and cyan fields over the wave */}
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
        className="container-shell relative z-10 pt-28 pb-20 text-center md:pt-32 md:pb-24"
      >
        <motion.div initial="hidden" animate="show" variants={stageHero}>
          <h1 className="mx-auto max-w-4xl text-balance text-[clamp(1.8rem,3.7vw,3.15rem)] font-semibold leading-[1.03] tracking-tight md:leading-[1]">
            <LetterReveal stagger={0.018} duration={0.8}>
              Helping North East businesses, brands and creatives{" "}
              <span className="text-gradient">
                make waves of creative impact
              </span>
            </LetterReveal>
          </h1>

          <motion.p
            className="mx-auto mt-7 max-w-2xl text-base leading-[1.35] text-fg-muted md:mt-8 md:text-lg"
            variants={fadeUp}
          >
            I sort the brand, website, content, and automation for local
            businesses, while NAMI Creative Network helps creatives get seen,
            supported, and hired.
          </motion.p>

          <motion.div
            className="mt-9 flex flex-wrap items-center justify-center gap-2 md:gap-4"
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
                href="/network"
                className="group inline-flex items-center gap-2 rounded-full border border-line-strong px-8 py-4 text-sm font-semibold text-fg backdrop-blur-sm transition-colors duration-300 hover:border-accent hover:bg-white/5"
              >
                Join the network
                <ArrowRight
                  size={16}
                  aria-hidden
                  className="transition-transform duration-500 ease-out-expo group-hover:translate-x-1"
                />
              </Link>
            </Magnetic>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
