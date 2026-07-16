import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { HomeHero } from "@/components/hero/home-hero";
import { SectionIntro } from "@/components/sections/section-intro";
import { ServicesGrid } from "@/components/sections/services-grid";
import { ProcessScroll } from "@/components/sections/process-scroll";
import { FAQAccordion } from "@/components/sections/faq-accordion";
import { PositioningBand } from "@/components/sections/positioning-band";
import { PressurePaths } from "@/components/sections/pressure-paths";
import { WorkGrid } from "@/components/sections/work-grid";
import { Testimonials } from "@/components/sections/testimonials";
import { RecentInsights } from "@/components/sections/recent-insights";
import { getAllPosts } from "@/lib/content/insights";
import { faq } from "@/lib/content/faq";
import { JsonLd, buildFaqPageSchema } from "@/components/seo/json-ld";

export default async function Home() {
  const posts = await getAllPosts();
  const recent = posts.slice(0, 3);

  return (
    <>
      <JsonLd schema={buildFaqPageSchema(faq)} />
      <HomeHero />

      <PositioningBand />
      <PressurePaths />

      {/* SERVICES — stacked-left intro, plain surface */}
      <section className="container-shell py-28 md:py-40">
        <SectionIntro
          index="01 / What we build"
          title={
            <>
              One person for the marketing jobs{" "}
              <span className="text-gradient sm:block">
                you keep carrying yourself
              </span>
            </>
          }
          lead="Your brand, website, content, and automation should feel like the same business. I help get those parts sorted, then leave you with a setup you can use."
        />
        <div className="mt-16 md:mt-20">
          <ServicesGrid />
        </div>
      </section>

      {/* PROCESS — pinned scroll storytelling, tinted surface */}
      <section className="border-t border-line bg-surface-1/30 py-28 md:py-40">
        <div className="container-shell">
          <ProcessScroll />
        </div>
      </section>

      {/* SELECTED WORK — centred intro */}
      <section className="container-shell border-t border-line py-28 md:py-40">
        <SectionIntro
          align="center"
          index="03 / Selected work"
          title={
            <>
              Work where the brand, website, and content{" "}
              <span className="text-gradient sm:block">were built together</span>
            </>
          }
          lead="Five projects across on-chain intelligence, members clubs, community brands, conversion funnels, and a national trade body. Different sectors, same job: make the public face and the working parts line up."
          className="mb-16 md:mb-20"
        />

        <WorkGrid />

        <div className="mt-16 flex items-center justify-center md:mt-20">
          <Link
            href="/work"
            className="group inline-flex items-center gap-2 rounded-full border border-line-strong px-7 py-4 text-sm font-semibold text-fg transition-colors duration-300 hover:border-accent hover:bg-white/5"
          >
            See every case study
            <ArrowUpRight
              size={14}
              aria-hidden
              className="transition-transform duration-500 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <Testimonials />

      {/* CREATIVE WAVES — recent insights */}
      <RecentInsights posts={recent} />

      {/* FAQ — sticky-left, accordion right */}
      <section className="container-shell border-t border-line py-28 md:py-40">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionIntro
              title={
                <>
                  Before we talk{" "}
                  <span className="text-gradient sm:block">
                    properly
                  </span>
                </>
              }
              lead="Straight answers to the usual questions. Anything else, send me a note."
            />
          </div>
          <FAQAccordion />
        </div>
      </section>
    </>
  );
}
