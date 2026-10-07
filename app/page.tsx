import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { HomeHero } from "@/components/hero/home-hero";
import { ParallaxBackdrop } from "@/components/motion/parallax-backdrop";
import { SectionIntro } from "@/components/sections/section-intro";
import { ProcessScroll } from "@/components/sections/process-scroll";
import { FAQAccordion } from "@/components/sections/faq-accordion";
import { PositioningBand } from "@/components/sections/positioning-band";
import { PressurePaths } from "@/components/sections/pressure-paths";
import { WorkGrid } from "@/components/sections/work-grid";
import { Testimonials } from "@/components/sections/testimonials";
import { NetworkMemberMosaic } from "@/components/sections/network-member-mosaic";
import { faq } from "@/lib/content/faq";
import { JsonLd, buildFaqPageSchema } from "@/components/seo/json-ld";
import { getNetworkDirectoryMembers } from "@/lib/content/network-directory-live";
import { isShowcaseReadyMember } from "@/lib/content/network-directory";

export default async function Home() {
  const members = await getNetworkDirectoryMembers();
  const showcaseMembers = members.filter(isShowcaseReadyMember);

  return (
    <>
      <JsonLd schema={buildFaqPageSchema(faq)} />
      <HomeHero
        memberCount={members.length}
        tooltipMembers={showcaseMembers.map((member) => ({
          id: member.id,
          name: member.name,
          designation: member.category,
          image: member.profileImage,
        }))}
      />

      <PositioningBand />
      <PressurePaths />


      {/* PROCESS */}
      <section className="relative isolate overflow-hidden border-b border-line bg-surface-1 py-20 md:py-28">
        <ParallaxBackdrop
          src="/images/north-east/nami-website-image%20(3).png"
          position="center 52%"
          overlay={0.86}
        />
        <div className="container-shell relative z-10">
          <ProcessScroll />
        </div>
      </section>

      {/* SELECTED WORK */}
      <section className="container-shell py-24 md:py-32">
        <SectionIntro
          title={<>What I helped these businesses sort</>}
          lead="Some needed a clearer brand or a better website. Others were losing time to content and admin. Have a look at what was getting in the way, what I changed and how the work turned out."
          className="mb-14 md:mb-16"
        />

        <WorkGrid
          slugs={[
            "whittaker-property-group",
            "the-league",
            "millions",
            "energy-consultants-association",
          ]}
          compact
        />

        <div className="mt-16 flex items-center justify-center md:mt-20">
          <Link
            href="/work"
            className="group inline-flex items-center gap-2 rounded-md border border-line-strong px-6 py-3.5 text-sm font-semibold text-fg transition-colors hover:border-accent hover:text-accent"
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
      <Testimonials backgroundImage="/images/north-east/4.jpg" />

      <NetworkMemberMosaic members={members} memberCount={members.length} />

      {/* FAQ */}
      <section className="container-shell py-24 md:py-32">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionIntro
              title={<>Before you get in touch</>}
              lead="Straight answers to the usual questions. Anything else, send me a note."
            />
          </div>
          <FAQAccordion />
        </div>
      </section>
    </>
  );
}
