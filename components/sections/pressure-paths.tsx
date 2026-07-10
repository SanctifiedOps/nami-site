import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { pressurePaths } from "@/lib/content/pathways";

type Props = {
  title?: React.ReactNode;
  lead?: string;
  className?: string;
};

export function PressurePaths({
  title = (
    <>
      Start with the part{" "}
      <span className="text-gradient sm:block">that keeps dragging.</span>
    </>
  ),
  lead = "Buyers rarely arrive thinking in service pillars. They arrive with one part of the business making the rest harder to run.",
  className = "",
}: Props) {
  return (
    <section className={`border-y border-line bg-surface-1/35 py-24 md:py-32 ${className}`}>
      <div className="container-shell">
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
          <div className="max-w-xl">
            <h2 className="text-4xl font-semibold leading-[1.18] tracking-tight md:text-5xl">
              {title}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-fg-muted">
              {lead}
            </p>
          </div>

          <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2">
            {pressurePaths.map((path) => (
              <Link
                key={path.problem}
                href={path.href}
                className="group flex min-h-64 flex-col bg-surface-1 p-7 transition-colors duration-300 hover:bg-surface-2 md:p-8"
              >
                <h3 className="text-xl font-medium leading-tight tracking-tight text-fg">
                  {path.problem}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-fg-muted">
                  {path.detail}
                </p>
                <span className="mt-auto inline-flex items-center gap-2 pt-8 text-sm font-medium text-fg transition-colors group-hover:text-accent">
                  {path.cta}
                  <ArrowUpRight
                    size={14}
                    aria-hidden
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
