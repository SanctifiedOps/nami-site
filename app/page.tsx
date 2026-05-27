import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { HomeHero } from "@/components/hero/home-hero";
import { SectionIntro } from "@/components/sections/section-intro";
import { ServicesGrid } from "@/components/sections/services-grid";
import { ProcessScroll } from "@/components/sections/process-scroll";
import { FAQAccordion } from "@/components/sections/faq-accordion";
import { PositioningBand } from "@/components/sections/positioning-band";
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

      {/* SERVICES — stacked-left intro, plain surface */}
      <section className="container-shell py-28 md:py-40">
        <SectionIntro
          index="01 / What we build"
          title={
            <>
              One studio for the five pieces that should{" "}
              <span className="text-gradient sm:block">
                never have been split.
              </span>
            </>
          }
          lead="Most teams hire a brand designer, a content person, a web developer, and an automations freelancer. None of them see the others' work. We build all five so nothing falls between them."
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
              Work where brand, content, and systems{" "}
              <span className="text-gradient sm:block">shipped as one.</span>
            </>
          }
          lead="Five engagements. On-chain intelligence, members-only experiences, community brands, conversion funnels, and a national trade body. Different sectors, same principle: integrated at strategy, not stitched at handoff."
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
                  Before we get on{" "}
                  <span className="text-gradient sm:block">
                    a call together.
                  </span>
                </>
              }
              lead="Quick answers to the questions we get most. Anything else, drop us a line."
            />
          </div>
          <FAQAccordion />
        </div>
      </section>
    </>
  );
}
