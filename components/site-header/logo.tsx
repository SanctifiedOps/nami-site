import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="NAMI Creative — home"
      className={cn(
        "group inline-flex items-center gap-2 text-fg transition-colors hover:text-accent",
        className,
      )}
    >
      <span className="font-semibold tracking-tight text-lg">
        NAMI<span className="text-accent">.</span>
      </span>
      <span className="hidden sm:inline text-xs uppercase tracking-[0.32em] text-fg-subtle group-hover:text-fg-muted transition-colors">
        Creative
      </span>
    </Link>
  );
}
