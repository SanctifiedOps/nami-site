import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Check, ExternalLink } from "lucide-react";
import { work, getCaseStudy } from "@/lib/content/work";
import { PageHero } from "@/components/sections/page-hero";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import {
  JsonLd,
  buildCaseStudySchema,
  buildBreadcrumbSchema,
} from "@/components/seo/json-ld";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return work.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return { title: "Not found" };
  return {
    title: `${study.client} · ${study.sector} case study`,
    description: `${study.oneLiner} A ${study.status.toLowerCase()} engagement from NAMI Creative spanning ${study.pillars.join(", ").toLowerCase()}.`,
    keywords: [
      ...study.pillars.map((p) => `${p.toLowerCase()} case study`),
      `${study.sector.toLowerCase()} agency`,
      `${study.client} case study`,
    ],
    openGraph: {
      title: `${study.client} · case study`,
      description: study.oneLiner,
      type: "article",
      images: [{ url: study.cover, alt: `${study.client} case study cover` }],
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();
  const Icon = study.icon;

  const idx = work.findIndex((w) => w.slug === slug);
  const next = work[(idx + 1) % work.length];

  return (
    <>
      <JsonLd
        schema={[
          buildCaseStudySchema({
            slug: study.slug,
            client: study.client,
            oneLiner: study.oneLiner,
            sector: study.sector,
            coverUrl: study.cover,
          }),
          buildBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Selected work", url: "/work" },
            { name: study.client, url: `/work/${study.slug}` },
          ]),
        ]}
      />
      <PageHero
        eyebrow={`${study.index} · ${study.client} · ${study.sector}`}
        title={
          <>
            {study.heroTitle.lead}{" "}
            <span className="text-gradient sm:block">
              {study.heroTitle.accent}
            </span>
          </>
        }
        lead={study.oneLiner}
      />

      {/* Meta strip + visit live */}
      <section className="container-shell py-12 md:py-16">
        <div className="glass-refractive grid gap-6 rounded-3xl p-6 md:grid-cols-[auto_1fr_auto] md:items-center md:gap-12 md:p-10">
          <div className="inline-grid size-14 place-items-center rounded-2xl border border-line bg-surface-2/60">
            <Icon size={24} className="text-accent" aria-hidden />
          </div>

          <dl className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm md:grid-cols-4">
            <div>
              <dt className="text-[10px] uppercase tracking-widest text-fg-subtle">
                Client
              </dt>
              <dd className="mt-1 font-medium text-fg">{study.client}</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-widest text-fg-subtle">
                Year
              </dt>
              <dd className="mt-1 font-medium text-fg">{study.year}</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-widest text-fg-subtle">
                Status
              </dt>
              <dd className="mt-1 font-medium text-fg">{study.status}</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-widest text-fg-subtle">
                Pillars
              </dt>
              <dd className="mt-1 flex flex-wrap gap-1.5">
                {study.pillars.map((p) => (
                  <span
                    key={p}
                    className="rounded-full border border-line bg-surface-2/60 px-2.5 py-0.5 text-[10px] uppercase tracking-widest text-fg-subtle"
                  >
                    {p}
                  </span>
                ))}
              </dd>
            </div>
          </dl>

          <a
            href={study.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-[0_4px_20px_rgb(255_0_188/0.25)] transition-all duration-300 hover:bg-accent-soft hover:shadow-[0_8px_40px_rgb(255_0_188/0.4)]"
          >
            Visit live site
            <ExternalLink
              size={14}
              aria-hidden
              className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        </div>
      </section>

      {/* Brief / cover panel */}
      <section className="container-shell py-12 md:py-20">
        <div className="grid gap-10 md:grid-cols-[1fr_2fr] md:gap-20">
          <p className="mono-label md:mt-2">The brief</p>
          <p className="max-w-2xl text-2xl font-medium leading-snug tracking-tight md:text-3xl">
            {study.brief}
          </p>
        </div>

        {/* Cover */}
        <div className="glass-refractive relative mt-16 aspect-[16/9] overflow-hidden rounded-3xl md:mt-20">
          <Image
            src={study.cover}
            alt={`${study.client}: ${study.tagline}`}
            fill
            sizes="(min-width: 1408px) 1408px, 100vw"
            priority
            className="object-cover"
          />
          {/* Bottom legibility mask for the tagline */}
          <div
            aria-hidden
            className="absolute inset-0 bg-linear-to-t from-surface-0/85 via-surface-0/25 to-transparent"
          />
          <div className="absolute inset-0 flex items-end justify-between p-6 md:p-12 lg:p-16">
            <p className="text-xl font-medium tracking-tight text-fg md:text-3xl lg:text-5xl">
              {study.tagline}
            </p>
            <span className="hidden text-xs uppercase tracking-widest text-fg-subtle md:inline">
              {study.client} · {study.year}
            </span>
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="border-t border-line bg-surface-1/40 py-20 md:py-28">
        <div className="container-shell">
          <div className="mb-12 grid gap-8 md:grid-cols-[1fr_2fr] md:gap-20">
            <div>
              <p className="mono-label mb-4">The approach</p>
              <h2 className="text-[clamp(2rem,4vw,3rem)] font-medium leading-[1.05] tracking-tight">
                How we{" "}
                <span className="text-gradient">
                  built it.
                </span>
              </h2>
            </div>
            <div className="space-y-6 max-w-2xl">
              {study.approach.map((p, i) => (
                <p
                  key={i}
                  className="text-fg-muted md:text-lg leading-relaxed"
                >
                  <span className="mr-3 font-mono text-xs text-accent">
                    0{i + 1}
                  </span>
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Deliverables */}
      <section className="container-shell py-20 md:py-28 border-t border-line">
        <div className="mb-12 grid gap-8 md:grid-cols-[1fr_2fr] md:gap-20">
          <div>
            <p className="mono-label mb-4">What shipped</p>
            <h2 className="text-[clamp(2rem,4vw,3rem)] font-medium leading-[1.05] tracking-tight">
              Deliverables that{" "}
              <span className="text-gradient">
                hold up daily.
              </span>
            </h2>
          </div>
          <ul className="grid gap-4 md:grid-cols-2 md:gap-6">
            {study.deliverables.map((d) => (
              <li
                key={d}
                className="glass-refractive flex items-start gap-3 rounded-xl p-5"
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
      </section>

      {/* Outcomes */}
      {study.outcomes && study.outcomes.length > 0 && (
        <section className="border-t border-line bg-surface-1/40 py-20 md:py-28">
          <div className="container-shell">
            <div className="mb-12 grid gap-8 md:grid-cols-[1fr_2fr] md:gap-20">
              <div>
                <p className="mono-label mb-4">Where it landed</p>
                <h2 className="text-[clamp(2rem,4vw,3rem)] font-medium leading-[1.05] tracking-tight">
                  Outcomes,{" "}
                  <span className="text-gradient">
                    not vanity.
                  </span>
                </h2>
              </div>
              <dl className="grid gap-4 md:grid-cols-2 md:gap-6">
                {study.outcomes.map((o) => (
                  <div
                    key={o.label}
                    className="glass-refractive rounded-2xl p-6 md:p-8"
                  >
                    <dt className="text-xs uppercase tracking-widest text-fg-subtle">
                      {o.label}
                    </dt>
                    <dd className="mt-3 text-2xl font-medium tracking-tight text-fg md:text-3xl">
                      <span className="text-gradient">{o.value}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>
      )}

      {/* Testimonial (if present) */}
      {study.testimonial && (
        <section className="container-shell py-20 md:py-28 border-t border-line">
          <figure className="mx-auto max-w-3xl text-center">
            <blockquote className="text-2xl font-medium leading-snug tracking-tight md:text-4xl">
              <span className="text-gradient">
                &ldquo;
              </span>
              {study.testimonial.quote}
              <span className="text-gradient">&rdquo;</span>
            </blockquote>
            <figcaption className="mt-8 text-sm text-fg-muted">
              <span className="font-medium text-fg">
                {study.testimonial.author}
              </span>{" "}
              · {study.testimonial.role}
            </figcaption>
          </figure>
        </section>
      )}

      {/* Next case study */}
      <section className="container-shell py-20 md:py-28 border-t border-line">
        <SpotlightCard
          tilt={2}
          glow={0.2}
          className="glass-refractive glass-refractive--hover rounded-3xl"
        >
          <Link
            href={`/work/${next.slug}`}
            className="group relative z-10 block rounded-3xl p-10 md:p-16"
          >
            <p className="mono-label mb-4">
              Next case study · {next.index} · {next.client}
            </p>
            <p className="text-3xl font-medium leading-tight tracking-tight md:text-5xl">
              <span className="text-gradient">{next.tagline}</span>
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
        </SpotlightCard>
      </section>
    </>
  );
}
