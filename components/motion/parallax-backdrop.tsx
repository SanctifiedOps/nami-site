"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

type Props = {
  src: string;
  className?: string;
  imageClassName?: string;
  overlay?: number;
  position?: string;
};

export function ParallaxBackdrop({
  src,
  className,
  imageClassName,
  overlay = 0.78,
  position = "center",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-7%", "7%"]);

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}
    >
      <motion.div
        className="absolute -inset-y-[14%] inset-x-0"
        style={{ y: reduceMotion ? 0 : y }}
      >
        <Image
          src={src}
          alt=""
          fill
          sizes="100vw"
          quality={84}
          className={cn(
            "object-cover grayscale contrast-[1.08] brightness-[0.52]",
            imageClassName,
          )}
          style={{ objectPosition: position }}
        />
      </motion.div>

      <div className="absolute inset-0 bg-surface-0" style={{ opacity: overlay }} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_18%,rgb(255_0_188/0.16),transparent_34%),linear-gradient(90deg,rgb(8_9_11/0.42),transparent_48%,rgb(8_9_11/0.48))]" />
      <div className="absolute inset-x-0 top-0 h-28 bg-linear-to-b from-surface-0 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-surface-0 to-transparent" />
    </div>
  );
}
