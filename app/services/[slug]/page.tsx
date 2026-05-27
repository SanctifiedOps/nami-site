import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { services, getService } from "@/lib/content/services";
import { getServiceFaq } from "@/lib/content/faq";
import { PageHero } from "@/components/sections/page-hero";
import { FAQAccordion } from "@/components/sections/faq-accordion";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import { SectionIntro } from "@/components/sections/section-intro";
import { PillarMap } from "@/components/sections/pillar-map";
import { DeliverablesList } from "@/components/sections/deliverables-list";
import {
  JsonLd,
  buildServiceSchema,
  buildFaqPageSchema,
  buildBreadcrumbSchema,
} from "@/components/seo/json-ld";

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
    title: `${service.title} · ${service.pillar} studio`,
    description: `${service.tagline} ${service.description}`,
    keywords: [
      `${service.title.toLowerCase()} studio`,
      `${service.pillar.toLowerCase()} agency UK`,
      `${service.pillar.toLowerCase()} for founders`,
      `${service.title.toLowerCase()} Newcastle`,
    ],
    openGraph: {
      title: `${service.title} · NAMI Creative`,
      description: service.tagline,
    },
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

  // Split the service title on " + " so the second half drops to a new line
  // in the brand gradient (matches the rest of the site's hero treatment).
  // Top line keeps an "&"; the accent line is sentence-cased.
  const [titleLead, ...titleRest] = service.title.split(" + ");
  const titleAccentRaw = titleRest.join(" + ");
  const titleAccent = titleAccentRaw
    ? titleAccentRaw.charAt(0).toUpperCase() + titleAccentRaw.slice(1)
    : "";

  const serviceFaq = getServiceFaq(slug);

  return (
    <>
      <JsonLd
        schema={[
          buildServiceSchema({
            slug: service.slug,
            name: service.title,
            description: service.description,
            pillar: service.pillar,
          }),
          buildFaqPageSchema(serviceFaq),
          buildBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Services", url: "/services" },
            { name: service.title, url: `/services/${service.slug}` },
          ]),
        ]}
      />
      <PageHero
        eyebrow={`${service.index} · ${service.pillar}`}
        title={
          titleAccent ? (
            <>
              {titleLead} &{" "}
              <span className="text-gradient sm:block">{titleAccent}</span>
            </>
          ) : (
            service.title
          )
        }
        lead={service.tagline}
      />

      {/* Statement + outcome */}
      <section className="container-shell py-20 md:py-28">
        <div className="grid gap-10 lg:grid-cols-[auto_1fr] lg:items-start lg:gap-16">
          <div className="glass-refractive inline-grid size-20 place-items-center rounded-2xl">
            <Icon size={36} className="text-accent" aria-hidden />
          </div>
          <div className="max-w-3xl">
            <p className="text-[clamp(1.6rem,3vw,2.5rem)] font-medium leading-[1.15] tracking-tight">
              {service.description}
            </p>
            <div className="glass-refractive mt-10 rounded-2xl p-6 md:p-8">
              <p className="mono-label text-accent/80">The outcome</p>
              <p className="mt-3 leading-relaxed text-fg-muted md:text-lg">
                {service.outcome}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Deliverables — numbered readout */}
      <section className="border-t border-line bg-surface-1/40 py-20 md:py-28">
        <div className="container-shell">
          <SectionIntro
            index="What's included"
            title={
              <>
                Deliverables that{" "}
                <span className="text-gradient sm:block">hold up daily.</span>
              </>
            }
            className="mb-12 md:mb-16"
          />
          <DeliverablesList items={service.deliverables} />
        </div>
      </section>

      {/* Where it fits — the five-pillar map */}
      <section className="container-shell border-t border-line py-20 md:py-28">
        <div className="mb-12 max-w-2xl">
          <p className="mono-label mb-4">Where it fits</p>
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-medium leading-[1.05] tracking-tight">
            One of five pillars.{" "}
            <span className="text-gradient">Stronger together.</span>
          </h2>
          <p className="mt-5 leading-relaxed text-fg-muted md:text-lg">
            When they ship together, the brand stops feeling assembled and
            starts feeling considered. Here is where this one sits.
          </p>
        </div>
        <PillarMap currentSlug={service.slug} />
      </section>

      {/* FAQ — sticky two-column */}
      <section className="container-shell border-t border-line py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="mono-label mb-4">Common questions</p>
            <h2 className="text-[clamp(2rem,4vw,3rem)] font-medium leading-[1.05] tracking-tight">
              Before we <span className="text-gradient">get started.</span>
            </h2>
          </div>
          <FAQAccordion items={serviceFaq} />
        </div>
      </section>

      {/* Next service */}
      <section className="container-shell py-20 md:py-28 border-t border-line">
        <SpotlightCard
          tilt={2}
          glow={0.2}
          className="glass-refractive glass-refractive--hover rounded-3xl"
        >
          <Link
            href={`/services/${next.slug}`}
            className="group relative z-10 block rounded-3xl p-10 md:p-16"
          >
            <p className="mono-label mb-4">Next service · {next.index}</p>
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
        </SpotlightCard>
      </section>
    </>
  );
}
