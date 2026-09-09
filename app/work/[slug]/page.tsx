import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, ExternalLink, Quote } from "lucide-react";
import { work, getCaseStudy } from "@/lib/content/work";
import { PageHero } from "@/components/sections/page-hero";
import { ApproachSteps } from "@/components/sections/approach-steps";
import { DeliverablesList } from "@/components/sections/deliverables-list";
import { JsonLd, buildCaseStudySchema, buildBreadcrumbSchema } from "@/components/seo/json-ld";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return work.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return { title: "Not found" };
  return {
    title: `${study.client} case study | NAMI Creative`,
    description: `${study.oneLiner} See the problem, the work and the result.`,
    keywords: [
      ...study.pillars.map((pillar) => `${pillar.toLowerCase()} case study`),
      `${study.sector.toLowerCase()} marketing case study`,
      "Newcastle marketing case study",
      "North East creative work",
      `${study.client} case study`,
    ],
    openGraph: {
      title: `${study.client} case study | NAMI Creative`,
      description: study.oneLiner,
      type: "article",
      url: `https://namicreative.co.uk/work/${study.slug}`,
      images: [{ url: study.cover ?? "/nami-og%20%281%29.png", width: 2800, height: 1750, alt: `${study.client} case study by NAMI Creative` }],
    },
    alternates: { canonical: `/work/${study.slug}` },
  };
}

export default async function CaseStudyPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();
  const index = work.findIndex((item) => item.slug === slug);
  const next = work[(index + 1) % work.length];

  return (
    <>
      <JsonLd schema={[
        buildCaseStudySchema({ slug: study.slug, client: study.client, oneLiner: study.oneLiner, sector: study.sector, coverUrl: study.cover }),
        buildBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Selected work", url: "/work" },
          { name: study.client, url: `/work/${study.slug}` },
        ]),
      ]} />

      <PageHero
        className="min-h-[72svh] md:min-h-[82svh]"
        title={<>{study.heroTitle.lead}{" "}<span className="text-gradient sm:block">{study.heroTitle.accent}</span></>}
        lead={study.oneLiner}
      />

      <section className="container-shell py-8 md:py-10">
        <div className="flex flex-col gap-8 border-y border-line py-7 md:flex-row md:items-center md:justify-between">
          <dl className="grid grid-cols-2 gap-x-8 gap-y-6 md:flex md:flex-wrap md:gap-x-16">
            <div><dt className="text-sm text-fg-subtle">Client</dt><dd className="mt-1 font-medium tracking-tight text-fg">{study.client}</dd></div>
            <div><dt className="text-sm text-fg-subtle">Year</dt><dd className="mt-1 font-medium tracking-tight text-fg">{study.year}</dd></div>
            <div><dt className="text-sm text-fg-subtle">Status</dt><dd className="mt-1 flex items-center gap-2 font-medium tracking-tight text-fg"><span aria-hidden className="size-1.5 rounded-full bg-accent shadow-[0_0_10px_rgb(255_0_188/0.7)]" />{study.status}</dd></div>
            <div className="col-span-2 md:max-w-md"><dt className="text-sm text-fg-subtle">Work included</dt><dd className="mt-1 font-medium leading-relaxed tracking-tight text-fg">{study.pillars.join(", ")}</dd></div>
          </dl>
          <a href={study.liveUrl} target="_blank" rel="noopener noreferrer" className="group inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-full border border-line-strong px-6 py-3 text-sm font-semibold text-fg transition-colors duration-300 hover:border-accent hover:bg-white/5 sm:w-fit">
            Visit live site <ExternalLink size={14} aria-hidden className="transition-transform duration-500 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </section>

      <section className="container-shell py-14 md:py-24">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-20">
          <div className="glass-refractive relative aspect-[16/10] overflow-hidden rounded-2xl">
            <Image src={study.cover} alt={`${study.client}: ${study.tagline}`} fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
          </div>
          <div className="max-w-xl">
            <p className="text-sm font-medium text-accent">The problem</p>
            <h2 className="type-section-title mt-4">What needed sorting</h2>
            <p className="mt-6 text-lg leading-relaxed text-fg-muted md:text-xl">{study.brief}</p>
          </div>
        </div>
      </section>

      {study.outcomes && study.outcomes.length > 0 && (
        <section className="border-y border-line py-14 md:py-20">
          <div className="container-shell">
            <div className="mx-auto max-w-5xl text-center">
              <h2 className="type-subsection-title">Project at a glance</h2>
            </div>
            <dl
              className={`mx-auto mt-9 grid gap-4 md:mt-12 ${
                study.outcomes.length === 2
                  ? "max-w-4xl sm:grid-cols-2"
                  : study.outcomes.length === 3
                    ? "max-w-5xl sm:grid-cols-3"
                    : "sm:grid-cols-2 lg:grid-cols-4"
              }`}
            >
              {study.outcomes.map((outcome, outcomeIndex) => (
                <div
                  key={outcome.label}
                  className={`group relative overflow-hidden border border-line p-6 transition-[transform,border-color,background-color,box-shadow] duration-700 ease-[var(--ease-out-expo)] hover:-translate-y-1.5 hover:border-accent/40 hover:shadow-[0_18px_48px_rgb(0_0_0/0.24),0_0_30px_rgb(255_0_188/0.07)] motion-reduce:transform-none md:p-8 ${
                    outcomeIndex % 3 === 0
                      ? "bg-[linear-gradient(145deg,rgb(255_0_188/0.09),rgb(17_18_21/0.72)_62%)]"
                      : "bg-surface-1/55"
                  }`}
                >
                  <dt className="text-sm leading-relaxed text-fg-subtle">{outcome.label}</dt>
                  <dd className="mt-3 text-2xl font-medium leading-tight tracking-tight text-fg md:text-3xl">{outcome.value}</dd>
                  <span aria-hidden className="absolute -bottom-10 -right-8 size-24 rounded-full bg-accent/0 blur-2xl transition-colors duration-700 group-hover:bg-accent/12" />
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      <section className="border-b border-line py-16 md:py-24">
        <div className="container-shell">
          <ApproachSteps steps={study.approach} label="The work" heading={<>How I <span className="text-gradient">approached it</span></>} />
        </div>
      </section>

      <section className="container-shell py-16 md:py-24">
        <div className="mb-10 max-w-2xl md:mb-14">
          <h2 className="type-section-title">What I <span className="text-gradient">delivered</span></h2>
        </div>
        <DeliverablesList items={study.deliverables} />
      </section>

      {study.testimonial && (
        <section className="container-shell border-t border-line py-16 md:py-24">
          <div className="glass-refractive relative overflow-hidden rounded-2xl p-7 md:p-14">
            <div aria-hidden className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgb(255_0_188/0.18),transparent_70%)] blur-2xl" />
            <Quote size={32} aria-hidden className="text-accent/60" />
            <figure className="relative mt-6 max-w-3xl">
              <blockquote className="text-xl font-medium leading-snug tracking-tight md:text-3xl">{study.testimonial.quote}</blockquote>
              <figcaption className="mt-7 text-sm text-fg-muted"><span className="font-medium text-fg">{study.testimonial.author}</span>{" "}· {study.testimonial.role}</figcaption>
            </figure>
          </div>
        </section>
      )}

      <section className="border-t border-line bg-surface-1/35 py-16 md:py-20">
        <div className="container-shell flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <h2 className="type-subsection-title">Something similar getting in the way?</h2>
            <p className="mt-3 leading-relaxed text-fg-muted">Tell me what is not working and I will tell you whether I can help.</p>
          </div>
          <Link href="/contact" className="group inline-flex w-fit items-center gap-2 rounded-full bg-accent px-7 py-4 text-sm font-semibold text-white shadow-[0_4px_20px_rgb(255_0_188/0.3)] transition-all duration-500 hover:bg-accent-soft">
            Work with me <ArrowUpRight size={15} aria-hidden className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </section>

      <section className="container-shell py-16 md:py-24">
        <Link href={`/work/${next.slug}`} className="group grid overflow-hidden border border-line bg-surface-1/45 transition-[transform,border-color,box-shadow] duration-700 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:border-accent/35 hover:shadow-[0_20px_55px_rgb(0_0_0/0.28)] motion-reduce:transform-none md:grid-cols-[0.8fr_1.2fr]">
          <div className="relative aspect-[16/9] md:aspect-auto md:min-h-72">
            <Image src={next.cover} alt="" fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover transition-transform duration-1000 ease-out-expo group-hover:scale-[1.04]" />
            <div className="absolute inset-0 bg-surface-0/20" />
          </div>
          <div className="flex flex-col justify-center p-7 md:p-12">
            <p className="text-sm text-fg-subtle">Next case study</p>
            <h2 className="mt-3 text-2xl font-medium tracking-tight md:text-4xl">{next.client}</h2>
            <p className="mt-4 max-w-xl leading-relaxed text-fg-muted">{next.oneLiner}</p>
            <span className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-accent">Read the case study <ArrowUpRight size={14} aria-hidden className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></span>
          </div>
        </Link>
      </section>
    </>
  );
}
