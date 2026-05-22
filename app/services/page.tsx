import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { ServicesGrid } from "@/components/sections/services-grid";
import { FAQAccordion } from "@/components/sections/faq-accordion";
import { SectionHeading } from "@/components/sections/section-heading";
import { faq } from "@/lib/content/faq";
import { JsonLd, buildFaqPageSchema } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Brand strategy, content systems, website + funnel design, visual direction, and growth automation. Five pillars built as one studio, designed against each other from day one.",
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

      <section className="container-shell py-24 md:py-32">
        <ServicesGrid />
      </section>

      <section className="border-t border-line bg-surface-1/40 py-24 md:py-32">
        <div className="container-shell">
          <div className="mb-12 max-w-3xl md:mb-16">
            <SectionHeading
              eyebrow="The model"
              title={
                <>
                  Integrated,{" "}
                  <span className="text-gradient sm:block">
                    not bundled.
                  </span>
                </>
              }
              lead="Most agencies sell each pillar separately and stitch them together at handoff. We design across all five from day one. Same team, same brief, same brain."
            />
          </div>
          <FAQAccordion />
        </div>
      </section>
    </>
  );
}
