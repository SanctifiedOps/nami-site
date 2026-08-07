"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { InsightPost } from "@/lib/content/insights-utils";
import { formatPostDate } from "@/lib/content/insights-utils";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import { cn } from "@/lib/utils";

type Props = {
  post: InsightPost;
  variant?: "featured" | "grid";
  className?: string;
};

export function PostCard({ post, variant = "grid", className }: Props) {
  const isFeatured = variant === "featured";

  return (
    <SpotlightCard
      tilt={isFeatured ? 0 : 4}
      glow={0.16}
      className={cn(
        "glass-refractive glass-refractive--hover rounded-3xl",
        !isFeatured && "h-full",
        className,
      )}
    >
      <Link
        href={`/insights/${post.slug}`}
        className={cn(
          "group/card relative z-10 flex flex-col overflow-hidden rounded-3xl",
          !isFeatured && "h-full",
        )}
      >
        <div
          className={cn(
            "flex flex-1 flex-col",
            isFeatured ? "p-7 md:p-12" : "p-6 md:p-8",
          )}
        >
          <div className="flex items-center justify-between gap-4 text-xs">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent/80">
              {isFeatured ? `Featured / ${post.pillar}` : post.pillar}
            </span>
            <span className="shrink-0 text-fg-subtle">
              {formatPostDate(post.date)} / {post.minutes} min
            </span>
          </div>

          <h3
            className={cn(
              "font-medium leading-[0.98] tracking-tight md:leading-[0.96]",
              isFeatured
                ? "mt-6 text-[clamp(1.5rem,3.5vw,2.75rem)]"
                : "mt-5 text-xl leading-snug md:text-2xl",
            )}
          >
            {post.title}
          </h3>

          {isFeatured && post.subtitle && (
            <p className="mt-3 leading-relaxed text-fg-muted md:text-lg">
              {post.subtitle}
            </p>
          )}

          <p
            className={cn(
              "line-clamp-3 leading-relaxed text-fg-muted",
              isFeatured ? "mt-6" : "mt-4",
            )}
          >
            {post.summary}
          </p>

          <span
            className={cn(
              "mt-auto inline-flex items-center gap-2 text-sm font-medium text-fg/90 transition-colors group-hover:text-accent",
              isFeatured ? "pt-8" : "pt-6",
            )}
          >
            {isFeatured ? "Read the full piece" : "Read"}
            <ArrowUpRight
              size={14}
              aria-hidden
              className="transition-transform duration-500 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </span>
        </div>
      </Link>
    </SpotlightCard>
  );
}
