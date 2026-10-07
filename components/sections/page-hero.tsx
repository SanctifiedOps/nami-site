"use client";

import { motion } from "motion/react";
import { NetworkHeroBackground } from "@/components/hero/network-hero-background";
import { ParallaxBackdrop } from "@/components/motion/parallax-backdrop";
import { cn } from "@/lib/utils";

type Props = {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: string;
  className?: string;
  networkBackground?: boolean;
  backgroundImage?: string;
  backgroundPosition?: string;
  aboveTitle?: React.ReactNode;
  children?: React.ReactNode;
};

export function PageHero({
  eyebrow,
  title,
  lead,
  className,
  networkBackground = false,
  backgroundImage,
  backgroundPosition,
  aboveTitle,
  children,
}: Props) {
  return (
    <section
      className={cn(
        "relative isolate flex min-h-[70svh] items-center overflow-hidden border-b border-line md:min-h-[76svh] md:items-end",
        className,
      )}
    >
      {networkBackground ? (
        <NetworkHeroBackground />
      ) : (
        <ParallaxBackdrop
          src={backgroundImage || "/assets/images/nami-office.webp"}
          position={backgroundPosition || "center"}
          overlay={0.62}
        />
      )}

      <div aria-hidden className="absolute inset-0 bg-linear-to-t from-black via-black/35 to-black/55" />

      <motion.div
        className="container-shell relative z-10 grid gap-10 pb-14 pt-24 md:pb-20 md:pt-32 lg:grid-cols-12 lg:items-end"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="lg:col-span-8">
          {aboveTitle ? <div className="mb-7 flex justify-start">{aboveTitle}</div> : null}
          {eyebrow ? (
            <p className="mb-6 text-sm font-semibold text-white/78">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="max-w-none text-balance text-[clamp(2.7rem,10vw,3.35rem)] font-semibold leading-[1] tracking-[-0.04em] text-white md:max-w-[13ch] md:text-[clamp(3rem,6.8vw,7rem)] md:leading-[0.96] md:tracking-[-0.055em]">
            {title}
          </h1>
        </div>

        <div className="lg:col-span-4 lg:pb-1">
          {lead ? (
            <p className="max-w-xl text-base leading-[1.5] text-white/76 md:text-lg">
              {lead}
            </p>
          ) : null}
          {children ? <div className="mt-7 flex justify-start">{children}</div> : null}
        </div>
      </motion.div>
    </section>
  );
}
