import Link from "next/link";
import { ArrowDown, ArrowUpRight, Check } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { SectionHeading } from "@/components/sections/section-heading";
import { FAQAccordion } from "@/components/sections/faq-accordion";
import { creatorWaveWorkshop } from "@/lib/content/creator-wave-workshop";
import { CreatorWaveForm } from "./creator-wave-form";

const offer = creatorWaveWorkshop;

const selectedTestimonials = [
  {
    quote:
      "Joe has really helped us massively step up our digital and marketing presence. His understanding of brand, marketing, and the technology behind it is second to none.",
    author: "Ollie Whittaker",
    role: "Founder - Whittaker Property Group",
  },
  {
    quote:
      "I relied on Joe's experience to build the site while I focused on the work. He understood the project at an emotional level and listened to my vision.",
    author: "Michael Tansey",
    role: "Head of Sales - Procure Smart",
  },
  {
    quote:
      "Being someone who is not particularly tech-savvy, Joe's work has been a tremendous help, allowing me to focus more on my family and growing the business.",
    author: "Orange John",
    role: "Founder - Three Peaks Mountain Guide",
  },
];

const reviewAreas = [
  {
    title: "Your first impression",
    body:
      "I look at your Instagram, bio, pinned posts, website, shop, or portfolio and ask the simple question: would a buyer understand what to do next?",
  },
  {
    title: "Your buyer path",
    body:
      "The route from seeing the work to making an enquiry, booking a slot, buying something, asking for a quote, or commissioning you.",
  },
  {
    title: "Your lost opportunities",
    body:
      "The places where people hesitate, get distracted, ask the same questions, or quietly leave because the next step is not clear enough.",
  },
];

function PrimaryCta({ children = "Ask Joe to take a look" }: { children?: string }) {
  return (
    <Link
      href="#workshop-form"
      className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-accent px-7 py-4 text-sm font-semibold text-white shadow-[0_4px_20px_rgb(255_0_188/0.3)] transition-shadow duration-500 hover:shadow-[0_8px_40px_rgb(255_0_188/0.55)]"
    >
      <span className="absolute inset-0 -z-10 translate-y-full bg-accent-soft transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-y-0" />
      {children}
      <ArrowDown
        size={16}
        aria-hidden
        className="transition-transform duration-300 group-hover:translate-y-0.5"
      />
    </Link>
  );
}

function TextCta({ children = "Go to the form" }: { children?: string }) {
  return (
    <Link
      href="#workshop-form"
      className="group inline-flex items-center gap-2 text-sm font-semibold text-fg transition-colors hover:text-accent"
    >
      {children}
      <ArrowUpRight
        size={14}
        aria-hidden
        className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    </Link>
  );
}

function TickItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3 text-pretty leading-relaxed text-fg-muted">
      <Check size={17} className="mt-1 shrink-0 text-accent" aria-hidden />
      <span>{children}</span>
    </li>
  );
}

export default function CreatorWaveWorkshopPage() {
  return (
    <>
      <PageHero
        title={
          <>
            {offer.hero.titleLead}{" "}
            <span className="text-gradient sm:block">
              {offer.hero.titleAccent}
            </span>
          </>
        }
        lead={offer.hero.subhead}
      >
        <div className="flex flex-col items-center gap-7">
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
            <PrimaryCta>Ask Joe to take a look</PrimaryCta>
            <Link
              href="#offer"
              className="group inline-flex items-center gap-2 rounded-full border border-line-strong px-7 py-4 text-sm font-semibold text-fg transition-colors duration-300 hover:border-accent hover:bg-white/5"
            >
              See the prices
              <ArrowDown
                size={16}
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-y-0.5"
              />
            </Link>
          </div>
          <p className="max-w-xl text-balance text-sm leading-relaxed text-fg-subtle">
            Built for people inside the Creative Network. Simple, practical,
            and priced so you can get the route sorted without making a huge
            agency thing out of it.
          </p>
        </div>
      </PageHero>

      <section className="border-b border-line py-16 md:py-24">
        <div className="container-shell mx-auto max-w-3xl">
          <div className="space-y-6">
            <p className="text-2xl font-medium leading-[1.03] tracking-tight md:text-4xl md:leading-[1]">
              You can be doing good work and still make it hard for people to
              hire you
            </p>
            <p className="leading-relaxed text-fg-muted md:text-lg">
              That is usually where the money leaks. People see the post, like
              the work, maybe even save it, then get stuck when they try to work
              out what you sell, what it costs, how to enquire, or whether you
              are the right fit.
            </p>
            <p className="leading-relaxed text-fg-muted md:text-lg">
              This is a small, practical offer to sort that path out. No big
              strategy theatre. Just a clear look at what is happening now, what
              is getting in the way, and what needs doing next.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-surface-1/35 py-20 md:py-28">
        <div className="container-shell">
          <SectionHeading
            title={
              <>
                Attention is good. {" "}
                <span className="text-gradient sm:block">
                  Paid work is better
                </span>
              </>
            }
            lead="This is about the buyer journey after someone notices you: the point where they decide whether to trust you, buy from you, book you, or commission you."
            align="center"
            className="mx-auto"
          />

          <ul className="mx-auto mt-12 grid max-w-4xl gap-5 text-left md:mt-14 md:grid-cols-2">
            {offer.symptoms.map((symptom) => (
              <li key={symptom} className="flex gap-4">
                <Check size={18} className="mt-1 shrink-0 text-accent" aria-hidden />
                <p className="text-pretty text-fg-muted md:text-lg">
                  {symptom}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-shell py-20 md:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-semibold leading-[1] tracking-tight md:text-6xl md:leading-[0.98]">
            The work, the offer, and {" "}
            <span className="text-gradient">the route between them</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-fg-muted md:text-lg">
            The aim is to make it easier for the right person to understand you,
            trust you, and take the next step without needing you to explain
            everything from scratch.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {reviewAreas.map((area) => (
            <div
              key={area.title}
              className="glass-refractive rounded-2xl p-7 md:p-8"
            >
              <Check size={22} className="text-accent" aria-hidden />
              <h3 className="mt-6 text-2xl font-medium tracking-tight">
                {area.title}
              </h3>
              <p className="mt-4 leading-relaxed text-fg-muted">
                {area.body}
              </p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-12 flex max-w-3xl flex-col items-center gap-5 rounded-3xl border border-line bg-surface-1/45 p-7 text-center md:p-10">
          <p className="text-2xl font-semibold leading-tight tracking-tight md:text-4xl">
            Want a quick outside view before you decide what to do?
          </p>
          <p className="max-w-2xl leading-relaxed text-fg-muted md:text-lg">
            Book a free call with Joe. We will look at where people are finding you, where they might be dropping off, and whether the report or build makes sense.
          </p>
          <PrimaryCta>Book a call with Joe</PrimaryCta>
        </div>
      </section>

      <section className="border-y border-line bg-surface-1/35 py-20 md:py-28">
        <div className="container-shell">
          <SectionHeading
            title={
              <>
                People have trusted me {" "}
                <span className="text-gradient sm:block">
                  with the important bits
                </span>
              </>
            }
            lead="Short notes from clients where the work was about understanding the business, improving the presence, and making the route easier to act on."
            align="center"
            className="mx-auto"
          />

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {selectedTestimonials.map((item) => (
              <figure
                key={item.author}
                className="rounded-3xl border border-line bg-surface-1/60 p-7 md:p-8"
              >
                <blockquote className="text-pretty text-base font-medium leading-relaxed text-fg">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 border-t border-line pt-5 text-sm leading-relaxed">
                  <span className="block font-semibold text-fg">{item.author}</span>
                  <span className="text-fg-subtle">{item.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section
        id="offer"
        className="scroll-mt-24 border-b border-line py-20 md:py-28"
      >
        <div className="container-shell">
          <SectionHeading
            title={
              <>
                Three ways to get {" "}
                <span className="text-gradient sm:block">
                  the buyer path sorted
                </span>
              </>
            }
            lead="Start small if you need a quick read. Go deeper if you want the report. Hand it over if you want the page and the follow-up sorted for you."
            align="center"
            className="mx-auto"
          />

          <div className="mt-14 grid gap-5 lg:grid-cols-3">
            {offer.offerSteps.map((step, i) => {
              const isFeatured = i === 0;
              return (
                <article
                  key={step.title}
                  className={`rounded-3xl border p-7 md:p-8 ${
                    isFeatured
                      ? "border-accent/45 bg-surface-1 shadow-[0_0_80px_rgb(255_0_188/0.12)]"
                      : "border-line bg-surface-1/55"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        isFeatured
                          ? "bg-accent text-white"
                          : "border border-line text-fg-muted"
                      }`}
                    >
                      {step.label}
                    </span>
                    <Check size={22} className="text-accent" aria-hidden />
                  </div>
                  <h3 className="mt-8 text-2xl font-semibold leading-tight tracking-tight md:text-3xl">
                    {step.title}
                  </h3>
                  <p className="mt-5 leading-relaxed text-fg-muted">
                    {step.body}
                  </p>
                  <p className="mt-6 border-t border-line pt-5 text-sm leading-relaxed text-fg-subtle">
                    {step.note}
                  </p>
                </article>
              );
            })}
          </div>

          <div className="mx-auto mt-12 flex max-w-3xl flex-col items-center gap-5 rounded-3xl border border-line bg-surface-0/70 p-7 text-center md:p-10">
            <p className="text-2xl font-semibold leading-tight tracking-tight md:text-4xl">
              Best starting point for most people: {" "}
              <span className="text-gradient">the free check-in</span>
            </p>
            <p className="max-w-2xl leading-relaxed text-fg-muted md:text-lg">
              Start with a quick call. I can look at the links, ask the right questions, and help you decide whether you need a simple fix, the &pound;99 report, or the &pound;499 build.
            </p>
            <PrimaryCta>Book the free check-in</PrimaryCta>
          </div>
        </div>
      </section>

      <section className="container-shell py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <h2 className="text-4xl font-semibold leading-[1] tracking-tight md:text-5xl md:leading-[0.98]">
              A practical report you can actually use
            </h2>
            <p className="mt-6 max-w-xl leading-relaxed text-fg-muted md:text-lg">
              This is not a brand deck. It is a clear set of observations and
              fixes around the path people take before they enquire, book, buy,
              or commission you.
            </p>
            <div className="mt-8">
              <TextCta>Jump to the form</TextCta>
            </div>
          </div>

          <ul className="grid gap-3 sm:grid-cols-2">
            {offer.deliverables.map((item) => (
              <TickItem key={item}>{item}</TickItem>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-y border-line bg-surface-1/35 py-20 md:py-28">
        <div className="container-shell">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-4xl font-semibold leading-[1] tracking-tight md:text-6xl md:leading-[0.98]">
              The &pound;499 option is for when you want {" "}
              <span className="text-gradient">the page and path sorted</span>
            </h2>
            <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-fg-muted md:text-lg">
              Simple site, clear offer route, contact or shop path, and basic
              follow-up. Enough to help people trust the work and take action,
              without turning it into a massive build.
            </p>
          </div>

          <ul className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2">
            {offer.buildIncludes.map((item) => (
              <TickItem key={item}>{item}</TickItem>
            ))}
          </ul>

          <p className="mx-auto mt-8 max-w-3xl rounded-2xl border border-line bg-surface-0/70 p-5 text-sm leading-relaxed text-fg-subtle">
            * {offer.buildCaveat}
          </p>

          <div className="mt-10 text-center">
            <PrimaryCta>Talk about the &pound;499 build</PrimaryCta>
          </div>
        </div>
      </section>

      <section
        id="workshop-form"
        className="scroll-mt-24 border-b border-line py-20 md:py-28"
      >
        <div className="container-shell grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div>
            <h2 className="text-4xl font-semibold leading-[1] tracking-tight md:text-5xl md:leading-[0.98]">
              Send me the links and I will tell you where to start
            </h2>
            <p className="mt-6 max-w-xl leading-relaxed text-fg-muted md:text-lg">
              You do not need to have it all polished. If the work is good but
              the route feels messy, send it over and I will help you find the
              cleanest next move.
            </p>
            <ul className="mt-8 space-y-4">
              <TickItem>Use the free call if you need a quick steer.</TickItem>
              <TickItem>Use the &pound;99 report if you want the fixes written down.</TickItem>
              <TickItem>Use the &pound;499 build if you want me to sort the route for you.</TickItem>
            </ul>
          </div>

          <CreatorWaveForm />
        </div>
      </section>

      <section className="container-shell py-20 md:py-28">
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            title={
              <>
                Before you ask, {" "}
                <span className="text-gradient sm:block">
                  a few honest answers
                </span>
              </>
            }
            align="center"
            className="mx-auto"
          />
          <div className="mt-12">
            <FAQAccordion items={offer.faq} />
          </div>
        </div>
      </section>
    </>
  );
}