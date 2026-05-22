"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { Service } from "@/lib/content/services";
import { cardIn } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Props = {
  service: Service;
  className?: string;
};

export function ServiceCard({ service, className }: Props) {
  const reduced = useReducedMotion();
  const Icon = service.icon;

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { damping: 16, stiffness: 220 });
  const sry = useSpring(ry, { damping: 16, stiffness: 220 });

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || e.pointerType === "touch") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / rect.width;
    const dy = (e.clientY - cy) / rect.height;
    ry.set(dx * 6); // max 6 deg
    rx.set(-dy * 6);
  };

  const handleLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      variants={cardIn}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 1200 }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={cn("group", className)}
    >
      <Link
        href={`/services/${service.slug}`}
        className="relative block h-full overflow-hidden rounded-2xl border border-line bg-surface-1/60 p-8 backdrop-blur-md transition-colors duration-500 hover:border-accent/40 md:p-10"
      >
        {/* hover glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(400px circle at 50% 0%, rgb(255 0 188 / 0.18), transparent 70%)",
          }}
        />

        <div className="relative flex flex-col gap-6">
          <div className="flex items-start justify-between">
            <span className="font-mono text-xs text-fg-subtle">
              {service.index}
            </span>
            <Icon
              size={28}
              aria-hidden
              className="text-accent transition-transform duration-500 group-hover:scale-110"
            />
          </div>

          <div className="space-y-3">
            <p className="eyebrow text-accent/80">{service.pillar}</p>
            <h3 className="text-2xl font-medium tracking-tight text-fg md:text-3xl">
              {service.title}
            </h3>
            <p className="text-fg-muted leading-relaxed">{service.tagline}</p>
          </div>

          <div className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-fg/80 transition-colors group-hover:text-accent">
            Read more
            <ArrowUpRight
              size={14}
              aria-hidden
              className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
