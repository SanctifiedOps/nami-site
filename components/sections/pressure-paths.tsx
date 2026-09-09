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
      What is getting{" "}
      <span className="text-gradient sm:block">in the way?</span>
    </>
  ),
  lead = "You probably already know which part is causing trouble. Pick the one that sounds familiar and we can sort it from there.",
  className = "",
}: Props) {
  return (
    <section className={`border-y border-line bg-surface-1/35 py-24 md:py-32 ${className}`}>
      <div className="container-shell">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="type-section-title mx-auto max-w-3xl">
            {title}
          </h2>
          <p className="type-lead mx-auto mt-6 max-w-2xl">
            {lead}
          </p>

          <div className="mx-auto mt-14 grid max-w-4xl gap-10 md:grid-cols-2 md:gap-x-12 md:gap-y-14">
            {pressurePaths.map((path) => (
              <Link
                key={path.problem}
                href={path.href}
                className="group block text-center"
              >
                <h3 className="text-xl font-medium leading-tight tracking-tight text-fg transition-colors group-hover:text-accent">
                  {path.problem}
                </h3>
                <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-fg-muted">
                  {path.detail}
                </p>
                <span className="mt-6 inline-flex items-center justify-center gap-2 text-sm font-medium text-fg transition-colors group-hover:text-accent">
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
