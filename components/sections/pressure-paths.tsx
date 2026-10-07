import Image from "next/image";
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
    <section className={`border-b border-line bg-surface-0 py-20 md:py-28 ${className}`}>
      <div className="container-shell">
        <header className="grid gap-5 border-b border-line pb-10 md:grid-cols-2 md:items-end md:pb-12">
          <h2 className="type-section-title max-w-xl">{title}</h2>
          <p className="max-w-xl text-base leading-[1.5] text-fg-muted md:justify-self-end md:text-lg">
            {lead}
          </p>
        </header>

        <div className="mt-8 grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-10">
          <figure className="relative min-h-[25rem] overflow-hidden rounded-sm border border-line md:min-h-[34rem]">
            <Image
              src="/assets/images/nami-office.webp"
              alt="Joe Wilson's NAMI Creative workspace"
              fill
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="object-cover object-center"
            />
            <div aria-hidden className="absolute inset-0 bg-linear-to-t from-black/75 via-black/5 to-transparent" />
            <figcaption className="absolute inset-x-0 bottom-0 p-6 text-sm font-medium text-white/90 md:p-8">
              NAMI Creative studio, Newcastle upon Tyne
            </figcaption>
          </figure>

          <div className="grid gap-px overflow-hidden rounded-sm border border-line bg-line-strong sm:grid-cols-2">
            {pressurePaths.map((path) => (
              <Link
                key={path.problem}
                href={path.href}
                className="group flex flex-col bg-surface-1 p-5 transition-colors hover:bg-surface-2 sm:min-h-56 sm:p-6 md:min-h-64 md:p-8"
              >
                <h3 className="max-w-xs text-xl font-semibold leading-tight tracking-[-0.02em] text-fg md:text-2xl">
                  {path.problem}
                </h3>
                <p className="mt-4 max-w-sm text-sm leading-[1.55] text-fg-muted md:text-base">
                  {path.detail}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent sm:mt-auto sm:pt-6">
                  {path.cta}
                  <ArrowUpRight size={15} aria-hidden className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
