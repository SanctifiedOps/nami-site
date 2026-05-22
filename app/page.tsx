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

      {/* SERVICES */}
      <section className="container-shell py-24 md:py-36">
        <div className="mb-16 grid gap-8 md:grid-cols-[2fr_1fr] md:items-end md:gap-16 md:mb-20">
          <SectionHeading
            eyebrow="What we build"
            title={
              <>
                One studio for the five pieces that should{" "}
                <span className="text-gradient sm:block">
                  never have been split.
                </span>
              </>
            }
          />
          <p className="text-fg-muted md:text-lg leading-relaxed">
            Most teams hire a brand designer, a content person, a web developer,
            and an automations freelancer. None of them see the others&apos;
            work. We build all five so nothing falls between them.
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
                A process that gets you out of the{" "}
                <span className="text-gradient sm:block">
                  day-to-day.
                </span>
              </>
            }
          />
          <p className="text-fg-muted md:text-lg leading-relaxed">
            Four phases. We do the strategic thinking, the build, the launch,
            and the system that keeps it running after we leave. Tight enough
            to ship in eight weeks, deep enough to keep working two years on.
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
                Work where brand, content, and systems{" "}
                <span className="text-gradient sm:block">
                  shipped as one.
                </span>
              </>
            }
          />
          <p className="text-fg-muted md:text-lg leading-relaxed">
            Five engagements. On-chain intelligence, members-only experiences,
            community brands, conversion funnels, and a national trade body.
            Different sectors, same principle: integrated at strategy, not
            stitched at handoff.
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
