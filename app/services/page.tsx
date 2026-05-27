import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { ServicesGrid } from "@/components/sections/services-grid";
import { FAQAccordion } from "@/components/sections/faq-accordion";
import { SectionIntro } from "@/components/sections/section-intro";
import { IntegratedSystem } from "@/components/sections/integrated-system";
import { faq } from "@/lib/content/faq";
import { JsonLd, buildFaqPageSchema } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Services · Brand strategy, content, websites, visual direction, automation",
  description:
    "Five integrated pillars for founders and growing brands: brand strategy and identity, content systems, conversion websites, visual direction, and growth automation. Designed against each other from day one, not stitched at handoff.",
  keywords: [
    "brand strategy studio UK",
    "content systems agency",
    "conversion website agency",
    "creative direction studio",
    "marketing automation agency UK",
    "creative studio services",
  ],
};

export default function ServicesPage() {
  return (
    <>
      <JsonLd schema={buildFaqPageSchema(faq)} />
      <PageHero
        eyebrow="Services"
        title={
          <>
            Five pillars.{" "}
            <span className="text-gradient sm:block">Built as one studio.</span>
          </>
        }
        lead="Most agencies sell each of these separately and stitch them at handoff. One creative partner designs all five against each other from day one, so the work reads as one voice and nothing falls between vendors."
      />

      {/* The five pillars */}
      <section className="container-shell py-24 md:py-32">
        <SectionIntro
          index="01 / The five pillars"
          title={
            <>
              Buy one pillar.{" "}
              <span className="text-gradient sm:block">
                Or the whole system.
              </span>
            </>
          }
          lead="Each pillar stands on its own. Built together they compound: the brand informs the content, the content feeds the funnel, and the systems carry all of it."
          className="mb-16 md:mb-20"
        />
        <ServicesGrid />
      </section>

      {/* The model — integrated vs fragmented */}
      <section className="relative overflow-hidden border-t border-line bg-surface-1/40 py-24 md:py-32">
        <div aria-hidden className="hairline-grid absolute inset-0 opacity-40" />
        <div className="container-shell relative">
          <SectionIntro
            align="center"
            index="02 / The model"
            title={
              <>
                Integrated,{" "}
                <span className="text-gradient sm:block">not bundled.</span>
              </>
            }
            lead="Most agencies sell each pillar separately and stitch them together at handoff. We design across all five from day one. Same brief, same hands, same brain."
            className="mb-14 md:mb-16"
          />
          <IntegratedSystem />
        </div>
      </section>

      {/* FAQ — sticky two-column */}
      <section className="container-shell border-t border-line py-24 md:py-32">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionIntro
              title={
                <>
                  Questions,{" "}
                  <span className="text-gradient sm:block">answered.</span>
                </>
              }
              lead="The things founders ask before we start. Anything else, drop us a line."
            />
          </div>
          <FAQAccordion />
        </div>
      </section>
    </>
  );
}
