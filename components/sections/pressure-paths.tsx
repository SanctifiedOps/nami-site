import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { pressurePaths } from "@/lib/content/pathways";

type Props = {
  title?: React.ReactNode;
  lead?: string;
  className?: string;
};

export function PressurePaths({
  title = <>What is getting in the way?</>,
  lead = "Start with the part that is causing trouble. I will help you work out what needs attention and what can wait.",
  className = "",
}: Props) {
  return (
    <section className={`border-b border-line bg-surface-0 py-24 md:py-32 ${className}`}>
      <div className="container-shell grid gap-14 lg:grid-cols-12 lg:gap-0">
        <div className="lg:col-span-4 lg:pr-16">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Where we can start
          </p>
          <h2 className="type-section-title max-w-md">{title}</h2>
          <p className="mt-6 max-w-md text-lg leading-[1.5] text-fg-muted">
            {lead}
          </p>
        </div>

        <div className="border-t border-line lg:col-span-8">
          {pressurePaths.map((path, index) => (
            <Link
              key={path.problem}
              href={path.href}
              className="group grid gap-4 border-b border-line py-7 transition-colors hover:border-accent md:grid-cols-[3rem_1fr_1fr_auto] md:items-start md:gap-6"
            >
              <span className="text-xs font-semibold tabular-nums text-fg-subtle">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-xl font-medium leading-tight tracking-tight text-fg group-hover:text-accent">
                {path.problem}
              </h3>
              <p className="text-sm leading-[1.5] text-fg-muted">
                {path.detail}
              </p>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-fg md:justify-self-end">
                {path.cta}
                <ArrowUpRight
                  size={14}
                  aria-hidden
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
