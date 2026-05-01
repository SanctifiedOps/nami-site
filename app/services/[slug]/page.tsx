import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Check } from "lucide-react";
import { services, getService } from "@/lib/content/services";
import { PageHero } from "@/components/sections/page-hero";
import { FAQAccordion } from "@/components/sections/faq-accordion";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return { title: "Not found" };
  return {
    title: service.title,
    description: service.tagline,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();
  const Icon = service.icon;

  // Find sibling for "next service" link
  const idx = services.findIndex((s) => s.slug === slug);
  const next = services[(idx + 1) % services.length];

  return (
    <>
      <PageHero
        eyebrow={`${service.index} — ${service.pillar}`}
        title={service.title}
        lead={service.tagline}
      />

      {/* Description + Icon panel */}
      <section className="container-shell py-20 md:py-28">
        <div className="grid gap-10 md:grid-cols-[1fr_2fr] md:gap-20">
          <div>
            <div className="inline-grid size-16 place-items-center rounded-2xl border border-line bg-surface-1/60 backdrop-blur-md">
              <Icon size={28} className="text-accent" aria-hidden />
            </div>
          </div>
          <div className="space-y-6 max-w-2xl">
            <p className="text-2xl font-medium leading-snug tracking-tight md:text-3xl">
              {service.description}
            </p>
            <p className="text-fg-muted md:text-lg leading-relaxed">
              <span className="font-serif italic text-gradient">
                Outcome —{" "}
              </span>
              {service.outcome}
            </p>
          </div>
        </div>
      </section>

      {/* Deliverables */}
      <section className="border-t border-line bg-surface-1/40 py-20 md:py-28">
        <div className="container-shell">
          <div className="mb-12 grid gap-8 md:grid-cols-[1fr_2fr] md:gap-20">
            <div>
              <p className="eyebrow mb-4">What's included</p>
              <h2 className="text-[clamp(2rem,4vw,3rem)] font-medium leading-[1.05] tracking-tight">
                Deliverables that{" "}
                <span className="font-serif italic text-gradient">
                  hold up daily.
                </span>
              </h2>
            </div>
            <ul className="grid gap-4 md:grid-cols-2 md:gap-6">
              {service.deliverables.map((d) => (
                <li
                  key={d}
                  className="flex items-start gap-3 rounded-xl border border-line bg-surface-1/60 p-5 backdrop-blur-md"
                >
                  <Check
                    size={18}
                    aria-hidden
                    className="mt-0.5 shrink-0 text-accent"
                  />
                  <span className="text-fg-muted leading-relaxed">{d}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Pillar context */}
      <section className="container-shell py-20 md:py-28 border-t border-line">
        <div className="grid gap-10 md:grid-cols-[1fr_2fr] md:gap-20">
          <p className="eyebrow">Where it fits</p>
          <div className="space-y-6 max-w-2xl">
            <p className="text-xl font-medium leading-snug tracking-tight md:text-2xl">
              This is one of five pillars. The others sit alongside —
              when they ship together, the brand stops feeling assembled
              and starts feeling{" "}
              <span className="font-serif italic text-gradient">
                considered.
              </span>
            </p>
            <Link
              href="/services"
              className="group inline-flex items-center gap-2 text-sm font-medium text-fg hover:text-accent transition-colors"
            >
              See the full system
              <ArrowUpRight
                size={14}
                aria-hidden
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-shell py-20 md:py-28 border-t border-line">
        <div className="mb-12 max-w-3xl">
          <p className="eyebrow mb-4">Common questions</p>
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-medium leading-[1.05] tracking-tight">
            Before we{" "}
            <span className="font-serif italic text-gradient">
              get started.
            </span>
          </h2>
        </div>
        <FAQAccordion />
      </section>

      {/* Next service */}
      <section className="container-shell py-20 md:py-28 border-t border-line">
        <Link
          href={`/services/${next.slug}`}
          className="group block rounded-3xl border border-line bg-surface-1/60 p-10 backdrop-blur-md transition-colors hover:border-accent/50 md:p-16"
        >
          <p className="eyebrow mb-4">Next service · {next.index}</p>
          <p className="text-3xl font-medium leading-tight tracking-tight md:text-5xl">
            {next.title}
          </p>
          <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-accent">
            Continue
            <ArrowUpRight
              size={14}
              aria-hidden
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </span>
        </Link>
      </section>
    </>
  );
}
