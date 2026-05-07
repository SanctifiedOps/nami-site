import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { HomeHero } from "@/components/hero/home-hero";
import { SectionHeading } from "@/components/sections/section-heading";
import { ServicesGrid } from "@/components/sections/services-grid";
import { ProcessList } from "@/components/sections/process-list";
import { FAQAccordion } from "@/components/sections/faq-accordion";
import { PositioningBand } from "@/components/sections/positioning-band";
import { WorkGrid } from "@/components/sections/work-grid";
import { Testimonials } from "@/components/sections/testimonials";
import { RecentInsights } from "@/components/sections/recent-insights";
import { getAllPosts } from "@/lib/content/insights";

export default async function Home() {
  const posts = await getAllPosts();
  const recent = posts.slice(0, 3);

  return (
    <>
      <HomeHero />

      <PositioningBand />

      {/* SERVICES */}
      <section className="container-shell py-24 md:py-36">
        <div className="mb-16 grid gap-8 md:grid-cols-[2fr_1fr] md:items-end md:gap-16 md:mb-20">
          <SectionHeading
            eyebrow="What we build"
            title={
              <>
                Five pillars that hold{" "}
                <span className="text-gradient sm:block">
                  the brand, end to end.
                </span>
              </>
            }
          />
          <p className="text-fg-muted md:text-lg leading-relaxed">
            Most studios pick one. We integrate all five so the work stops
            fragmenting and starts compounding.
          </p>
        </div>
        <ServicesGrid />
      </section>

      {/* PROCESS */}
      <section className="container-shell py-24 md:py-36 border-t border-line">
        <div className="mb-16 grid gap-8 md:grid-cols-[2fr_1fr] md:items-end md:gap-16 md:mb-20">
          <SectionHeading
            eyebrow="How we work"
            title={
              <>
                A process that{" "}
                <span className="text-gradient sm:block">
                  gets you to launch.
                </span>
              </>
            }
          />
          <p className="text-fg-muted md:text-lg leading-relaxed">
            Four phases: discovery, design, launch, and ongoing partnership.
            Tight enough to ship, deep enough to last.
          </p>
        </div>
        <ProcessList />
      </section>

      {/* SELECTED WORK */}
      <section className="container-shell py-24 md:py-36 border-t border-line">
        <div className="mb-16 grid gap-8 md:grid-cols-[2fr_1fr] md:items-end md:gap-16 md:mb-20">
          <SectionHeading
            eyebrow="Selected work"
            title={
              <>
                Brands and systems{" "}
                <span className="text-gradient sm:block">
                  built to compound.
                </span>
              </>
            }
          />
          <p className="text-fg-muted md:text-lg leading-relaxed">
            Four engagements where brand, product, and infrastructure shipped
            together. Community at scale, on-chain intelligence, members-only
            experiences, and high-conversion funnels.
          </p>
        </div>

        <WorkGrid />

        <div className="mt-16 flex items-center justify-center md:mt-20">
          <Link
            href="/work"
            className="group inline-flex items-center gap-2 rounded-full border border-line-strong px-7 py-4 text-sm font-semibold text-fg transition-colors duration-300 hover:bg-white/5 hover:border-accent"
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

      {/* FAQ */}
      <section className="container-shell py-24 md:py-36 border-t border-line">
        <div className="mb-12 grid gap-8 md:grid-cols-[2fr_1fr] md:items-end md:gap-16 md:mb-16">
          <SectionHeading
            eyebrow="Common questions"
            title={
              <>
                Before we get on{" "}
                <span className="text-gradient sm:block">
                  a call together.
                </span>
              </>
            }
          />
          <p className="text-fg-muted md:text-lg leading-relaxed">
            Quick answers to the questions we get most. Anything else, drop us
            a line.
          </p>
        </div>
        <FAQAccordion />
      </section>
    </>
  );
}
