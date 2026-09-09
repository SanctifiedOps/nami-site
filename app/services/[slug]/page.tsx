import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { ArrowUpRight, Check } from "lucide-react";
import { services, getService } from "@/lib/content/services";
import { getServiceFaq } from "@/lib/content/faq";
import { PageHero } from "@/components/sections/page-hero";
import { FAQAccordion } from "@/components/sections/faq-accordion";
import { SectionIntro } from "@/components/sections/section-intro";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import {
  JsonLd,
  buildServiceSchema,
  buildFaqPageSchema,
  buildBreadcrumbSchema,
} from "@/components/seo/json-ld";

type Params = { slug: string };

const legacyRoutes: Record<string, string> = {
  "visual-direction": "/services/brand-strategy",
};

const heroLines: Record<string, [string, string]> = {
  "brand-strategy": ["A brand", "people recognise"],
  "content-systems": ["Content you can", "keep up with"],
  "website-funnel": ["A website that", "brings in enquiries"],
  "automation-growth": ["Less admin and", "fewer missed follow-ups"],
};

const heroImages: Record<string, { src: string; position: string }> = {
  "brand-strategy": { src: "/images/north-east/4.jpg", position: "center 48%" },
  "content-systems": { src: "/images/north-east/2.jpg", position: "center 54%" },
  "website-funnel": { src: "/images/north-east/1.jpg", position: "center 52%" },
  "automation-growth": { src: "/images/north-east/3.jpg", position: "center" },
};

export function generateStaticParams(): Params[] {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (legacyRoutes[slug]) return { robots: { index: false, follow: true } };

  const service = getService(slug);
  if (!service) return { title: "Service not found" };

  return {
    title: service.seoTitle,
    description: service.metaDescription,
    keywords: service.searchTerms,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: {
      type: "website",
      url: `/services/${service.slug}`,
      title: service.seoTitle,
      description: service.metaDescription,
      images: [
        {
          url: "/nami-og%20%281%29.png",
          width: 2800,
          height: 1750,
          alt: `${service.title} from NAMI Creative`,
        },
      ],
    },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  if (legacyRoutes[slug]) permanentRedirect(legacyRoutes[slug]);

  const service = getService(slug);
  if (!service) notFound();

  const serviceIndex = services.findIndex((item) => item.slug === slug);
  const serviceFaq = getServiceFaq(slug);
  const [heroLead, heroAccent] = heroLines[slug] ?? [service.title, ""];
  const heroImage = heroImages[slug];
  const related = services.filter((item) => item.slug !== slug);

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
        backgroundImage={heroImage?.src}
        backgroundPosition={heroImage?.position}
        title={
          <>
            {heroLead}{" "}
            {heroAccent && (
              <span className="text-gradient sm:block">{heroAccent}</span>
            )}
          </>
        }
        lead={service.tagline}
      >
        <Link
          href="/contact"
          className="group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-4 text-sm font-semibold text-white shadow-[0_4px_20px_rgb(255_0_188/0.3)] transition-all duration-300 hover:bg-accent-soft"
        >
          Work with me
          <ArrowUpRight
            size={14}
            aria-hidden
            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </Link>
      </PageHero>

      <section className="container-shell py-24 md:py-32">
        <ScrollReveal effect="zoom" className="mx-auto max-w-4xl text-center">
          <h2 className="type-subsection-title">{service.description}</h2>
        </ScrollReveal>
      </section>

      <section className="border-t border-line bg-surface-1/35 py-24 md:py-32">
        <div className="container-shell">
          <SectionIntro
            align="center"
            title={
              <>
                Does any of this{" "}
                <span className="text-gradient sm:block">sound familiar?</span>
              </>
            }
            lead="You do not need to diagnose the marketing problem before getting in touch. These are some of the signs I usually see."
            className="mx-auto mb-14 md:mb-16"
          />
          <ScrollReveal>
          <ul className="mx-auto grid max-w-5xl border-t border-line md:grid-cols-2">
            {service.problems.map((problem) => (
              <li
                key={problem}
                className="group flex gap-4 border-b border-line px-2 py-6 text-lg leading-relaxed text-fg-muted transition-[background-color,color,transform] duration-500 ease-[var(--ease-out-expo)] hover:translate-x-1 hover:bg-white/[0.025] hover:text-fg motion-reduce:transform-none md:px-8 md:py-8 md:odd:border-r"
              >
                <Check size={18} aria-hidden className="mt-1 shrink-0 text-accent" />
                <span>{problem}</span>
              </li>
            ))}
          </ul>
          </ScrollReveal>
        </div>
      </section>

      <section className="container-shell py-24 md:py-32">
        <SectionIntro
          align="center"
          title={
            <>
              What I can help{" "}
              <span className="text-gradient sm:block">you put right</span>
            </>
          }
          lead="The exact job depends on what you already have and what is causing the problem. We will agree that before any work starts."
          className="mx-auto mb-14 md:mb-20"
        />
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-12">
          {service.help.map((item, itemIndex) => {
            const wideFirst = serviceIndex % 2 === 0;
            const isWide = wideFirst ? itemIndex % 3 === 0 : itemIndex % 3 !== 0;
            return (
            <ScrollReveal
              key={item.title}
              delay={(itemIndex % 2) * 0.06}
              className={`${
                isWide ? "md:col-span-7" : "md:col-span-5"
              }`}
            >
            <article
              className={`h-full border border-line bg-surface-1/55 p-7 transition-[transform,border-color,background-color,box-shadow] duration-700 ease-[var(--ease-out-expo)] hover:-translate-y-1.5 hover:scale-[1.008] hover:border-accent/35 hover:shadow-[0_18px_50px_rgb(0_0_0/0.22)] motion-reduce:transform-none md:p-8 ${
                itemIndex === 0 || itemIndex === 3
                  ? "bg-[linear-gradient(135deg,rgb(255_0_188/0.08),transparent_58%)]"
                  : ""
              }`}
            >
              <h3 className="type-card-title">{item.title}</h3>
              <p className="mt-4 max-w-xl leading-relaxed text-fg-muted">
                {item.body}
              </p>
            </article>
            </ScrollReveal>
            );
          })}
        </div>
      </section>

      <section className="border-y border-line bg-surface-1/40 py-20 md:py-28">
        <div className="container-shell text-center">
          <ScrollReveal effect="zoom" className="mx-auto max-w-4xl">
          <p className="text-[clamp(1.8rem,4vw,3.5rem)] font-semibold leading-[1.02] tracking-tight text-fg">
            {service.outcome}
          </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="container-shell py-24 md:py-32">
        <SectionIntro
          align="center"
          title={
            <>
              What the work{" "}
              <span className="text-gradient sm:block">usually includes</span>
            </>
          }
          lead="You may need all of this or only part of it. Your proposal will show exactly what is included in your job."
          className="mx-auto mb-14 md:mb-16"
        />
        <ScrollReveal className="mx-auto grid max-w-6xl gap-4 md:grid-cols-12">
          {service.deliverableGroups.map((group, groupIndex) => (
            <article
              key={group.title}
              className={`${
                groupIndex === 0
                  ? "md:col-span-5"
                  : groupIndex === 1
                    ? "md:col-span-7"
                    : "md:col-span-12 md:grid md:grid-cols-[0.7fr_1.3fr] md:items-center"
              } group border border-line p-7 transition-[transform,border-color,background-color,box-shadow] duration-700 ease-[var(--ease-out-expo)] hover:-translate-y-1.5 hover:scale-[1.008] hover:border-accent/35 hover:shadow-[0_18px_50px_rgb(0_0_0/0.22)] motion-reduce:transform-none md:p-9 ${
                groupIndex === 0 || groupIndex === 2
                  ? "bg-[linear-gradient(135deg,rgb(255_0_188/0.07),transparent_62%)]"
                  : "bg-surface-1/55"
              }`}
            >
              <h3 className="type-card-title max-w-sm">{group.title}</h3>
              <ul
                className={`${
                  groupIndex === 2 ? "mt-6 md:mt-0 md:grid md:grid-cols-2 md:gap-8" : "mt-8"
                } space-y-4 md:space-y-0`}
              >
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="border-t border-line pt-4 leading-relaxed text-fg-muted transition-colors duration-300 group-hover:text-fg md:mt-4"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </ScrollReveal>
      </section>

      <section className="border-t border-line bg-surface-1/35 py-24 md:py-32">
        <div className="container-shell">
          <SectionIntro
            align="center"
            title={
              <>
                How the job{" "}
                <span className="text-gradient sm:block">moves forward</span>
              </>
            }
            lead="A simple process, regular conversations and no disappearing behind a wall of project management."
            className="mx-auto mb-14 md:mb-16"
          />
          <ScrollReveal className="relative mx-auto max-w-6xl">
            <div className="grid items-start gap-5 md:grid-cols-[0.92fr_1.08fr_0.92fr]">
            {service.steps.map((step, stepIndex) => (
              <article
                key={step.title}
                className={`group border border-line p-7 transition-[transform,border-color,background-color,box-shadow] duration-700 ease-[var(--ease-out-expo)] hover:-translate-y-1.5 hover:scale-[1.008] hover:border-accent/35 hover:shadow-[0_18px_50px_rgb(0_0_0/0.22)] motion-reduce:transform-none md:p-8 ${
                  stepIndex === 1
                    ? "bg-[linear-gradient(145deg,rgb(255_0_188/0.09),rgb(24_24_27/0.9)_58%)] md:-translate-y-5 md:hover:-translate-y-6"
                    : stepIndex === 0
                      ? "bg-surface-2"
                      : "bg-surface-1/55"
                }`}
              >
                <h3 className="type-card-title">{step.title}</h3>
                <p className="mt-4 leading-relaxed text-fg-muted transition-colors duration-300 group-hover:text-fg">{step.body}</p>
              </article>
            ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="container-shell border-t border-line py-24 md:py-32">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionIntro
              title={
                <>
                  Questions about{" "}
                  <span className="text-gradient sm:block">this kind of work</span>
                </>
              }
              lead="If your question is not here, send me a message and I will give you a straight answer."
            />
          </div>
          <FAQAccordion items={serviceFaq} />
        </div>
      </section>

      <section className="border-t border-line py-20 md:py-24">
        <div className="container-shell">
          <div className="flex flex-col items-center justify-between gap-8 text-center md:flex-row md:text-left">
            <div>
              <h2 className="type-subsection-title">Need help with this?</h2>
              <p className="mt-3 text-fg-muted">
                Tell me what is not working and I will help you find the right place to start.
              </p>
            </div>
            <Link
              href="/contact"
              className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-accent px-7 py-4 text-sm font-semibold text-white"
            >
              Work with me
              <ArrowUpRight size={14} aria-hidden />
            </Link>
          </div>

          <nav aria-label="Other services" className="mt-16 border-t border-line pt-8">
            <p className="mb-5 text-sm text-fg-subtle">Other ways I can help</p>
            <div className="flex flex-wrap gap-x-8 gap-y-4">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/services/${item.slug}`}
                  className="inline-flex items-center gap-2 font-medium text-fg transition-colors hover:text-accent"
                >
                  {item.title}
                  <ArrowUpRight size={13} aria-hidden />
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </section>
    </>
  );
}
