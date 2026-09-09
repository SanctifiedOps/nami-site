import Link from "next/link";
import { ArrowUpRight, Handshake, Mail, Users } from "lucide-react";
import { HomeHero } from "@/components/hero/home-hero";
import { SectionIntro } from "@/components/sections/section-intro";
import { ServicesGrid } from "@/components/sections/services-grid";
import { ProcessScroll } from "@/components/sections/process-scroll";
import { FAQAccordion } from "@/components/sections/faq-accordion";
import { PositioningBand } from "@/components/sections/positioning-band";
import { PressurePaths } from "@/components/sections/pressure-paths";
import { WorkGrid } from "@/components/sections/work-grid";
import { Testimonials } from "@/components/sections/testimonials";
import { faq } from "@/lib/content/faq";
import { JsonLd, buildFaqPageSchema } from "@/components/seo/json-ld";
import { ParallaxBackdrop } from "@/components/motion/parallax-backdrop";

export default function Home() {
  return (
    <>
      <JsonLd schema={buildFaqPageSchema(faq)} />
      <HomeHero />

      <PositioningBand />
      <PressurePaths />


      {/* SERVICES */}
      <section className="relative isolate overflow-hidden py-28 md:py-40">
        <ParallaxBackdrop
          src="/images/north-east/6.jpg"
          position="center 52%"
          overlay={0.84}
        />
        <div className="container-shell relative z-10">
          <SectionIntro
            align="center"
            index="01 / What we build"
            title={
              <>
                The jobs you know need sorting{" "}
                <span className="text-gradient sm:block">
                  but never get time to fix
                </span>
              </>
            }
            lead="Bring me one problem or the whole list. I can sort the brand, website, content and repetitive admin, then leave you with something you can actually use."
          />
          <div className="mt-16 md:mt-20">
            <ServicesGrid />
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="border-t border-line bg-surface-1/30 py-28 md:py-40">
        <div className="container-shell">
          <ProcessScroll />
        </div>
      </section>

      {/* SELECTED WORK */}
      <section className="container-shell border-t border-line py-28 md:py-40">
        <SectionIntro
          align="center"
          index="03 / Selected work"
          title={
            <>
              What I helped{" "}
              <span className="text-gradient sm:block">these businesses sort</span>
            </>
          }
          lead="Some needed a clearer brand or a better website. Others were losing time to content and admin. Have a look at what was getting in the way, what I changed and how the work turned out."
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

      <section className="relative isolate overflow-hidden border-y border-line py-24 md:py-32">
        <ParallaxBackdrop src="/images/north-east/1.jpg" position="center 52%" overlay={0.8} />
        <div className="container-shell relative z-10">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20">
            <div>
              <p className="mono-label mb-5">NAMI Creative Network</p>
              <h2 className="type-section-title">
                The marketing work and the creator network have the same aim
              </h2>
              <p className="type-lead mt-6 max-w-2xl">
                Support the North East. I help businesses get their brand,
                website, content, and automation sorted properly. The network
                gives creators, artists, freelancers, local businesses, and
                independent brands more places to be seen, supported, and hired.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/network"
                  className="group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-4 text-sm font-semibold text-white shadow-[0_4px_20px_rgb(255_0_188/0.3)] transition-all duration-300 hover:bg-accent-soft hover:shadow-[0_8px_40px_rgb(255_0_188/0.5)]"
                >
                  Join the network
                  <ArrowUpRight
                    size={14}
                    aria-hidden
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
                <Link
                  href="/about"
                  className="group inline-flex items-center gap-2 rounded-full border border-line-strong px-7 py-4 text-sm font-semibold text-fg transition-colors duration-300 hover:border-accent hover:bg-white/5"
                >
                  Read the story
                  <ArrowUpRight
                    size={14}
                    aria-hidden
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-2xl border border-line bg-surface-1/55 p-6 backdrop-blur-md">
                <Users size={22} className="text-accent" aria-hidden />
                <h3 className="mt-5 text-2xl font-medium tracking-tight">
                  Be easier to find
                </h3>
                <p className="mt-3 leading-relaxed text-fg-muted">
                  NAMI keeps track of local talent so features, referrals, and
                  opportunities can land with the right people.
                </p>
              </div>
              <div className="rounded-2xl border border-line bg-surface-1/55 p-6 backdrop-blur-md">
                <Mail size={22} className="text-accent" aria-hidden />
                <h3 className="mt-5 text-2xl font-medium tracking-tight">
                  Weekly roundups
                </h3>
                <p className="mt-3 leading-relaxed text-fg-muted">
                  Featured creators, local news, events, and useful opportunities
                  from across the North East.
                </p>
              </div>
              <div className="rounded-2xl border border-line bg-surface-1/55 p-6 backdrop-blur-md">
                <Handshake size={22} className="text-accent" aria-hidden />
                <h3 className="mt-5 text-2xl font-medium tracking-tight">
                  Work that backs the region
                </h3>
                <p className="mt-3 leading-relaxed text-fg-muted">
                  The service work and the network feed each other. Both are
                  built to bring more eyes to proper creative work up here.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
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
