import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { ServicesGrid } from "@/components/sections/services-grid";
import { FAQAccordion } from "@/components/sections/faq-accordion";
import { SectionHeading } from "@/components/sections/section-heading";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Brand strategy, content systems, website + funnel design, visual direction, and growth automation. Five pillars built into one cohesive structure.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title={
          <>
            Five pillars, <span className="text-gradient">one structure.</span>
          </>
        }
        lead="Brand, content, websites, visual direction, and growth systems, built integrated, not as separate engagements. The work compounds because the parts are designed to fit together."
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
                  Integrated, not{" "}
                  <span className="text-gradient">
                    bundled.
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
