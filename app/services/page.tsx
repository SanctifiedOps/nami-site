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
            Five parts of the same{" "}
            <span className="text-gradient sm:block">working system.</span>
          </>
        }
        lead="Brand, content, website, visual direction, and automation all shape each other in the real world. We plan them together so the work does not splinter the moment it leaves the brand deck."
      />

      {/* The five pillars */}
      <section className="container-shell py-24 md:py-32">
        <SectionIntro
          index="01 / The five pillars"
          title={
            <>
              Start where the pressure is.{" "}
              <span className="text-gradient sm:block">
                Build toward the whole system.
              </span>
            </>
          }
          lead="Some clients need the website first. Some need the voice cleaned up before another campaign goes live. The point is to fix the part that is dragging the rest out of shape, then connect it properly."
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
                One brief.{" "}
                <span className="text-gradient sm:block">Fewer handoffs.</span>
              </>
            }
            lead="The costly part is rarely the deliverable itself. It is the translation between people who were never working from the same picture."
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
