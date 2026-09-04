import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  CalendarDays,
  Mail,
  Handshake,
  Heart,
  MapPin,
  Sparkles,
  CheckCircle2,
  Users,
} from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { NetworkForm } from "./network-form";

export const metadata: Metadata = {
  title: "NAMI Creative Network | North East Creatives",
  description:
    "Join NAMI Creative Network, a growing home for North East creatives, Newcastle artists, freelancers, local businesses, and independent brands.",
  openGraph: {
    images: [
      {
        url: "/nami-og%20%281%29.png",
        width: 2800,
        height: 1750,
        alt: "NAMI Creative Network for North East creatives",
      },
    ],
    title: "NAMI Creative Network | North East Creatives",
    description:
      "A growing network for North East creatives, Newcastle artists, freelancers, local businesses, and independent brands.",
    url: "https://namicreative.co.uk/network",
  },
  alternates: {
    canonical: "/network",
  },
};

const audience = [
  "Creatives",
  "Artists",
  "Musicians",
  "Photographers",
  "Designers",
  "Local businesses",
  "Makers",
  "Independent brands",
];

const reasons = [
  {
    icon: Heart,
    title: "More eyes on the work",
    body: "NAMI spotlights people building something with care. Features, reposts, stories, and recommendations all start with knowing who is out there.",
  },
  {
    icon: Users,
    title: "A stronger circle around you",
    body: "The network brings together people who understand the graft behind creative work and want to see more North East people win.",
  },
  {
    icon: Handshake,
    title: "More ways to be put forward",
    body: "As the network grows, NAMI can point partner businesses, collaborators, and local opportunities towards the right people.",
  },
];


const joinSteps = [
  "You will be added to the NAMI Creative Network",
  "I will keep an eye on your work and where you are based",
  "You will receive Creative Network roundups with people, events, and opportunities",
  "You will get the community links after joining",
  "I will use the network to feature, recommend, and connect people when there is a good fit",
];
const futureAccess = [
  {
    icon: Sparkles,
    title: "Showcase opportunities",
    body: "Regular chances to get your work seen through NAMI posts, roundups, stories, and future creative features.",
  },
  {
    icon: Mail,
    title: "Weekly roundups",
    body: "A regular email with featured creators, spotlights, local creative news, events, and useful opportunities from across the North East.",
  },
  {
    icon: CalendarDays,
    title: "Events and meetups",
    body: "A route into future gatherings for people making, building, selling, and creating across the region.",
  },
  {
    icon: MapPin,
    title: "Local referrals",
    body: "A cleaner way for NAMI to remember who does what, where you are based, and when to recommend you.",
  },
];

function FormAnchor({ children = "Join the network" }: { children?: string }) {
  return (
    <Link
      href="#join-network"
      className="group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-4 text-sm font-semibold text-white shadow-[0_4px_20px_rgb(255_0_188/0.3)] transition-all duration-300 hover:bg-accent-soft hover:shadow-[0_8px_40px_rgb(255_0_188/0.5)]"
    >
      {children}
      <ArrowDown
        size={16}
        aria-hidden
        className="transition-transform duration-300 group-hover:translate-y-0.5"
      />
    </Link>
  );
}

export default function NetworkPage() {
  return (
    <>
      <div data-network-section="hero">
        <PageHero
        eyebrow="NAMI Creative Network"
        title={
          <>
            Join the North East&apos;s growing{" "}
            <span className="text-gradient sm:block">creative network</span>
          </>
        }
        lead="A place for creators, artists, freelancers, local businesses, and independent brands doing proper work across the region. Put your name in the network so NAMI can keep you in mind for features, showcases, referrals, and future opportunities."
      >
        <div className="flex flex-wrap items-center justify-center gap-3">
          <FormAnchor>Join the network</FormAnchor>
          <Link
            href="/network/directory"
            className="group inline-flex items-center gap-2 rounded-full border border-line-strong px-7 py-4 text-sm font-semibold text-fg transition-colors duration-300 hover:border-accent hover:bg-white/5"
          >
            Explore the directory
            <ArrowUpRight
              size={14}
              aria-hidden
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>
      </PageHero>
      </div>

      <section data-network-section="why_this_exists" className="container-shell py-20 md:py-28">
        <div className="grid gap-12 md:grid-cols-[0.9fr_1.1fr] md:gap-20">
          <p className="mono-label md:mt-2">01 / Why this exists</p>
          <div className="max-w-2xl space-y-6">
            <p className="text-2xl font-medium leading-[0.98] tracking-tight md:text-3xl md:leading-[0.96]">
              The North East is full of people making good things, but too much
              of it sits in separate corners
            </p>
            <p className="leading-relaxed text-fg-muted md:text-lg">
              NAMI started as NAMI Up North because I wanted to give local
              creativity more attention. Artists, musicians, photographers,
              makers, designers, freelancers, small businesses, and brands were
              doing work that deserved more credit.
            </p>
            <p className="leading-relaxed text-fg-muted md:text-lg">
              NAMI Creative Network is the next step. I am building a proper
              list of people across the region so there is one place to find
              the work, share opportunities, make introductions, and back the
              people who are putting themselves out there.
            </p>
            <div className="pt-2">
              <FormAnchor>Put your name in</FormAnchor>
            </div>
          </div>
        </div>
      </section>

      <section data-network-section="why_join" className="border-y border-line bg-surface-1/35 py-20 md:py-28">
        <div className="container-shell">
          <div className="mx-auto mb-12 max-w-4xl text-center">
            <p className="mono-label mb-5">02 / Why join</p>
            <h2 className="text-4xl font-semibold leading-[0.98] tracking-tight md:text-6xl md:leading-[0.96]">
              Be easier to find when the right people are looking
            </h2>
            <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-fg-muted md:text-lg">
              NAMI can use this network to spotlight, recommend, connect, and
              bring more attention to the people shaping the creative side of
              the North East.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {reasons.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className="glass-refractive rounded-2xl p-7 md:p-8"
                >
                  <Icon size={22} className="text-accent" aria-hidden />
                  <h3 className="mt-6 text-2xl font-medium tracking-tight">
                    {card.title}
                  </h3>
                  <p className="mt-4 leading-relaxed text-fg-muted">
                    {card.body}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-10 text-center">
            <FormAnchor>Join NAMI Creative Network</FormAnchor>
          </div>
        </div>
      </section>

      <section data-network-section="who_belongs" className="container-shell py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
          <div>
            <p className="mono-label mb-5">03 / Who belongs here</p>
            <h2 className="text-4xl font-semibold leading-[0.98] tracking-tight md:text-5xl md:leading-[0.96]">
              If your work adds something to the region, NAMI should know
              about it
            </h2>
            <p className="mt-6 max-w-xl leading-relaxed text-fg-muted md:text-lg">
              You do not need a huge following. You do not need everything
              polished. If you are making, building, selling, designing,
              filming, playing, painting, running a place, or growing a brand
              up here, put it forward.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
            {audience.map((item) => (
              <div
                key={item}
                className="rounded-xl border border-line bg-surface-1/45 px-5 py-4 text-sm font-medium text-fg"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section data-network-section="opportunities" className="border-y border-line py-20 md:py-28">
        <div className="container-shell">
          <div className="mx-auto max-w-4xl text-center">
            <p className="mono-label mb-5">04 / What it can open up</p>
            <h2 className="text-4xl font-semibold leading-[0.98] tracking-tight md:text-6xl md:leading-[0.96]">
              A network built for visibility, support, and proper opportunity
            </h2>
            <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-fg-muted md:text-lg">
              The first job is simple: learn who is doing what across the North
              East. From there, NAMI can build better spotlights, better
              introductions, better events, and better reasons for people to
              work with local talent.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {futureAccess.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className="rounded-2xl border border-line bg-surface-1/45 p-7 md:p-8"
                >
                  <Icon size={22} className="text-accent" aria-hidden />
                  <h3 className="mt-6 text-2xl font-medium tracking-tight">
                    {card.title}
                  </h3>
                  <p className="mt-4 leading-relaxed text-fg-muted">
                    {card.body}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-line bg-surface-1/55 p-6 text-center backdrop-blur-md md:p-10">
            <p className="text-xl font-bold leading-relaxed text-accent md:text-2xl">
              I am building the region&apos;s largest creator network, and this is how I know who to keep in mind.
            </p>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-fg-muted md:text-lg">
              Joining now means NAMI can keep track of your work while the
              network grows around spotlights, weekly roundups, events, showcases, referrals, and community support.
            </p>
            <div className="mt-8">
              <FormAnchor>Join before the next round of features</FormAnchor>
            </div>
          </div>
        </div>
      </section>

      <section
        data-network-section="join_form"
        id="join-network"
        className="border-t border-line bg-surface-1/30 py-20 md:py-28"
      >
        <div className="container-shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <p className="mono-label mb-5">05 / Join the network</p>
            <h2 className="text-4xl font-semibold leading-[0.98] tracking-tight md:text-5xl md:leading-[0.96]">
              Join the network so NAMI knows what you are building
            </h2>
            <p className="mt-6 max-w-xl leading-relaxed text-fg-muted md:text-lg">
              Tell me what you are building so I know who you are, where you
              are based, and when NAMI can put your work forward through
              features, roundups, referrals, events, and local opportunities.
            </p>
            <div className="mt-8 rounded-2xl border border-line bg-surface-0/60 p-6">
              <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                What happens after you join
              </p>
              <ul className="mt-5 space-y-3">
                {joinSteps.map((step) => (
                  <li
                    key={step}
                    className="flex gap-3 text-sm leading-relaxed text-fg-muted"
                  >
                    <CheckCircle2
                      size={16}
                      className="mt-0.5 shrink-0 text-accent"
                      aria-hidden
                    />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm leading-relaxed text-fg-subtle">
                There is no cost to join. The form just gives me enough context
                to remember what you do and point people towards your work in a
                useful way.
              </p>
            </div>
          </div>

          <NetworkForm />
        </div>
      </section>

      <section data-network-section="business_cta" className="container-shell py-20 text-center md:py-28">
        <p className="mx-auto max-w-2xl text-xl font-medium leading-relaxed tracking-tight text-fg md:text-2xl">
          I also help businesses get their brand, content, website, and
          automation sorted properly.
        </p>
        <Link
          href="/contact"
          className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-fg transition-colors hover:text-accent"
        >
          Talk about a project
          <ArrowUpRight
            size={14}
            aria-hidden
            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </Link>
      </section>
    </>
  );
}


