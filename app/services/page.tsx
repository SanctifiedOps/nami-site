import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { ServicesGrid } from "@/components/sections/services-grid";
import { FAQAccordion } from "@/components/sections/faq-accordion";
import { SectionIntro } from "@/components/sections/section-intro";
import { IntegratedSystem } from "@/components/sections/integrated-system";
import { PressurePaths } from "@/components/sections/pressure-paths";
import { CommonStartingPoints } from "@/components/sections/common-starting-points";
import { faq } from "@/lib/content/faq";
import { JsonLd, buildFaqPageSchema } from "@/components/seo/json-ld";
import { ParallaxBackdrop } from "@/components/motion/parallax-backdrop";

export const metadata: Metadata = {
  title: "Marketing Services Newcastle | Brand, Websites & Content",
  description:
    "Branding, websites, content and automation for North East businesses that need their marketing working properly.",
  keywords: [
    "brand strategy UK",
    "content systems agency",
    "conversion website agency",
    "creative direction support",
    "marketing automation agency UK",
    "creative marketing services",
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
            Get the marketing{" "}
            <span className="text-gradient sm:block">working properly</span>
          </>
        }
        lead="I help small businesses sort the brand, website, content and repetitive admin that keep getting pushed down the list. Bring me one problem or ask me to look at the lot."
      />

      <PressurePaths
        title={
          <>
            Tell me what is{" "}
            <span className="text-gradient sm:block">not working</span>
          </>
        }
        lead="Your website might be quiet, your marketing might feel messy, or too much admin might keep falling back on you. Start there and I will help work out what needs fixing."
        className="border-t-0"
      />

      {/* Services */}
      <section className="container-shell py-24 md:py-32">
        <SectionIntro
          align="center"
          title={
            <>
              Help with the parts{" "}
              <span className="text-gradient sm:block">
                customers actually see
              </span>
            </>
          }
          lead="Choose the job that needs attention now. I will make sure it works with everything you already have and is practical to keep using."
          className="mx-auto mb-16 md:mb-20"
        />
        <ServicesGrid />
      </section>

      {/* The model â€” integrated vs fragmented */}
      <CommonStartingPoints />

      <section className="relative isolate overflow-hidden border-t border-line py-24 md:py-32">
        <ParallaxBackdrop src="/images/north-east/4.jpg" position="center 46%" overlay={0.82} />
        <div className="container-shell relative z-10">
          <SectionIntro
            align="center"
            index="02 / The model"
            title={
              <>
                One person who{" "}
                <span className="text-gradient sm:block">understands the whole job</span>
              </>
            }
            lead="You should not have to explain the business again every time the work moves from words to design, the website or the follow-up emails."
            className="mb-14 md:mb-16"
          />
          <IntegratedSystem />
        </div>
      </section>

      {/* FAQ â€” sticky two-column */}
      <section className="container-shell border-t border-line py-24 md:py-32">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionIntro
              title={
                <>
                  A few things{" "}
                  <span className="text-gradient sm:block">you might want to know</span>
                </>
              }
              lead="If your question is not here, send me a message and I will give you a straight answer."
            />
          </div>
          <FAQAccordion />
        </div>
      </section>
    </>
  );
}


