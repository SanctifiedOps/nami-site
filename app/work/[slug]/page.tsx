import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, ExternalLink, Quote } from "lucide-react";
import { work, getCaseStudy } from "@/lib/content/work";
import { PageHero } from "@/components/sections/page-hero";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import { ApproachSteps } from "@/components/sections/approach-steps";
import { MetricsBand } from "@/components/sections/metrics-band";
import { DeliverablesList } from "@/components/sections/deliverables-list";
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

      {/* Meta — editorial dossier line */}
      <section className="container-shell py-14 md:py-20">
        <div className="flex flex-col gap-12 border-b border-line pb-14 md:flex-row md:items-end md:justify-between md:gap-20">
          <dl className="grid grid-cols-2 gap-x-12 gap-y-10 sm:flex sm:flex-wrap sm:gap-x-20">
            <div>
              <dt className="mono-label">Client</dt>
              <dd className="mt-3 text-lg font-medium tracking-tight text-fg">
                {study.client}
              </dd>
            </div>
            <div>
              <dt className="mono-label">Year</dt>
              <dd className="mt-3 text-lg font-medium tracking-tight text-fg">
                {study.year}
              </dd>
            </div>
            <div>
              <dt className="mono-label">Status</dt>
              <dd className="mt-3 flex items-center gap-2 text-lg font-medium tracking-tight text-fg">
                <span
                  aria-hidden
                  className="size-1.5 rounded-full bg-accent shadow-[0_0_10px_rgb(255_0_188/0.7)]"
                />
                {study.status}
              </dd>
            </div>
            <div>
              <dt className="mono-label">Pillars</dt>
              <dd className="mt-3 text-lg font-medium tracking-tight text-fg">
                {study.pillars.join("  ·  ")}
              </dd>
            </div>
          </dl>

          <a
            href={study.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-line-strong px-6 py-3 text-sm font-semibold text-fg transition-colors duration-300 hover:border-accent hover:bg-white/5"
          >
            Visit live site
            <ExternalLink
              size={14}
              aria-hidden
              className="transition-transform duration-500 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
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

      {/* Approach — connected numbered sequence */}
      <section className="border-t border-line bg-surface-1/40 py-20 md:py-28">
        <div className="container-shell">
          <ApproachSteps steps={study.approach} />
        </div>
      </section>

      {/* Deliverables — numbered readout */}
      <section className="container-shell border-t border-line py-20 md:py-28">
        <div className="mb-12 max-w-2xl md:mb-16">
          <p className="mono-label mb-4">What shipped</p>
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-medium leading-[1.05] tracking-tight">
            Deliverables that{" "}
            <span className="text-gradient">hold up daily.</span>
          </h2>
        </div>
        <DeliverablesList items={study.deliverables} />
      </section>

      {/* Outcomes — bold metrics readout */}
      {study.outcomes && study.outcomes.length > 0 && (
        <section className="relative overflow-hidden border-t border-line bg-surface-1/40 py-20 md:py-28">
          <div aria-hidden className="hairline-grid absolute inset-0 opacity-40" />
          <div className="container-shell relative">
            <div className="mb-12 max-w-2xl md:mb-16">
              <p className="mono-label mb-4">Where it landed</p>
              <h2 className="text-[clamp(2rem,4vw,3rem)] font-medium leading-[1.05] tracking-tight">
                Outcomes,{" "}
                <span className="text-gradient">not vanity.</span>
              </h2>
            </div>
            <MetricsBand items={study.outcomes} />
          </div>
        </section>
      )}

      {/* Testimonial (if present) */}
      {study.testimonial && (
        <section className="container-shell py-20 md:py-28 border-t border-line">
          <div className="glass-refractive relative overflow-hidden rounded-3xl p-10 md:p-16">
            <div
              aria-hidden
              className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgb(255_0_188/0.18),transparent_70%)] blur-2xl"
            />
            <Quote size={40} aria-hidden className="text-accent/60" />
            <figure className="relative mt-6 max-w-3xl">
              <blockquote className="text-2xl font-medium leading-snug tracking-tight md:text-4xl">
                {study.testimonial.quote}
              </blockquote>
              <figcaption className="mt-8 text-sm text-fg-muted">
                <span className="font-medium text-fg">
                  {study.testimonial.author}
                </span>{" "}
                · {study.testimonial.role}
              </figcaption>
            </figure>
          </div>
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
