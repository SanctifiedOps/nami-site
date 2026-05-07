import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { InsightPost } from "@/lib/content/insights-utils";
import { formatPostDate } from "@/lib/content/insights-utils";
import { cn } from "@/lib/utils";

type Props = {
  post: InsightPost;
  variant?: "featured" | "grid";
  className?: string;
};

export function PostCard({ post, variant = "grid", className }: Props) {
  const isFeatured = variant === "featured";

  return (
    <Link
      href={`/insights/${post.slug}`}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface-1/60 backdrop-blur-md transition-colors hover:border-accent/40",
        className,
      )}
    >
      {/* Cover image (or gradient fallback) */}
      <div
        className={cn(
          "relative w-full overflow-hidden bg-surface-2",
          isFeatured ? "aspect-[16/9]" : "aspect-[16/10]",
        )}
      >
        {post.cover ? (
          <Image
            src={post.cover}
            alt={post.title}
            fill
            sizes={
              isFeatured
                ? "(min-width: 1024px) 65vw, 100vw"
                : "(min-width: 1024px) 32vw, (min-width: 768px) 45vw, 100vw"
            }
            priority={isFeatured}
            className="object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.03]"
          />
        ) : (
          <CoverFallback pillar={post.pillar} />
        )}
        {/* Subtle gradient mask at the bottom for legibility if needed */}
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-t from-surface-0/30 to-transparent"
        />
      </div>

      {/* Body */}
      <div
        className={cn(
          "flex flex-1 flex-col",
          isFeatured ? "p-7 md:p-12" : "p-6 md:p-8",
        )}
      >
        <div className="flex items-center justify-between text-xs">
          <span className="eyebrow text-accent/80">
            {isFeatured ? `Featured · ${post.pillar}` : post.pillar}
          </span>
          <span className="text-fg-subtle">
            {formatPostDate(post.date)} · {post.minutes} min
          </span>
        </div>

        <h3
          className={cn(
            "font-medium leading-[1.15] tracking-tight",
            isFeatured
              ? "mt-6 text-[clamp(1.5rem,3.5vw,2.75rem)]"
              : "mt-5 text-xl md:text-2xl leading-snug",
          )}
        >
          {post.title}
        </h3>

        {isFeatured && post.subtitle && (
          <p className="mt-3 text-fg-muted leading-relaxed md:text-lg">
            {post.subtitle}
          </p>
        )}

        <p
          className={cn(
            "text-fg-muted leading-relaxed line-clamp-3",
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
            className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </span>
      </div>
    </Link>
  );
}

/** Soft gradient placeholder shown when a post has no cover image set. */
function CoverFallback({ pillar }: { pillar: string }) {
  return (
    <div
      aria-hidden
      className="absolute inset-0 flex items-end justify-end bg-linear-to-br from-accent/25 via-accent/10 to-transparent p-6 md:p-8"
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-fg/60">
        {pillar}
      </span>
    </div>
  );
}
