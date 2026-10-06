import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { HomeHero } from "@/components/hero/home-hero";
import { SectionIntro } from "@/components/sections/section-intro";
import { ProcessScroll } from "@/components/sections/process-scroll";
import { FAQAccordion } from "@/components/sections/faq-accordion";
import { PositioningBand } from "@/components/sections/positioning-band";
import { PressurePaths } from "@/components/sections/pressure-paths";
import { WorkGrid } from "@/components/sections/work-grid";
import { Testimonials } from "@/components/sections/testimonials";
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
      <section className="border-b border-line bg-surface-1/40 py-24 md:py-32">
        <div className="container-shell">
          <ProcessScroll />
        </div>
      </section>

      {/* SELECTED WORK */}
      <section className="container-shell py-24 md:py-32">
        <SectionIntro
          eyebrow="Selected work"
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
      <Testimonials />

      <section className="border-b border-line bg-surface-0">
        <div className="container-shell grid lg:grid-cols-12">
          <div className="relative min-h-[32rem] border-x border-line lg:col-span-5 lg:border-l-0">
            <Image
              src="/images/north-east/1.jpg"
              alt="The Tyne Bridge and Newcastle skyline"
              fill
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="object-cover grayscale"
            />
            <div aria-hidden className="absolute inset-0 bg-black/25" />
            <p className="absolute bottom-0 left-0 border-r border-t border-white/15 bg-black/80 px-5 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-white">
              Built in the North East
            </p>
          </div>

          <div className="py-16 lg:col-span-7 lg:py-24 lg:pl-16 xl:pl-24">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              NAMI Creative Network
            </p>
            <h2 className="type-section-title max-w-2xl">
              The client work and the creative network have the same aim
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-[1.5] text-fg-muted">
              I help businesses make their marketing clearer. The Network gives
              artists, makers, freelancers and independent businesses more
              places to be found, supported and hired.
            </p>

            <dl className="mt-10 border-t border-line">
              {[
                ["01", "Be easier to find", "Profiles, features and referrals help the right people discover local work."],
                ["02", "Share what is happening", "Members can publish stories, promote events and keep their work up to date."],
                ["03", "Back the region", "More attention stays with the people making and building things here."],
              ].map(([number, title, copy]) => (
                <div key={number} className="grid gap-3 border-b border-line py-5 sm:grid-cols-[3rem_12rem_1fr] sm:gap-5">
                  <dt className="text-xs font-semibold text-accent">{number}</dt>
                  <dd className="font-medium text-fg">{title}</dd>
                  <dd className="text-sm leading-[1.5] text-fg-muted">{copy}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/network"
                className="group inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-accent-soft"
              >
                Explore the network
                <ArrowUpRight size={14} aria-hidden className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                href="/about"
                className="group inline-flex items-center gap-2 rounded-md border border-line-strong px-6 py-3.5 text-sm font-semibold text-fg transition-colors hover:border-accent hover:text-accent"
              >
                Read the story
                <ArrowUpRight size={14} aria-hidden className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-shell py-24 md:py-32">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionIntro
              eyebrow="Useful to know"
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
