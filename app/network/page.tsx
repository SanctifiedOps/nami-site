import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  Heart,
  MapPin,
  MessageCircle,
  Sparkles,
  Users,
} from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { NetworkForm } from "./network-form";

export const metadata: Metadata = {
  title: "NAMI Creative Network - North East creatives and businesses",
  description:
    "A community front door for NAMI Creative. Apply to be featured, discover the story behind NAMI Up North, and support North East creatives, artists, businesses, and brands.",
  openGraph: {
    title: "NAMI Creative Network",
    description:
      "A home for North East creatives, artists, businesses, freelancers, and brands doing proper work.",
    url: "https://namicreative.co.uk/network",
  },
};

const facebookUrl = "https://www.facebook.com/groups/1033572522893615";
const whatsappUrl = "https://chat.whatsapp.com/Fq8MpjoXZTo7FFGM9KUiOr";

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

const promiseCards = [
  {
    icon: Heart,
    title: "Spotlights come first",
    body: "The page exists to give good North East work more light. No pay-to-play feature wall, no awkward sales pitch.",
  },
  {
    icon: MapPin,
    title: "Built for the region",
    body: "Newcastle, Sunderland, Durham, Teesside, Northumberland, the coast, the towns, the graft. If it is North East and it has care behind it, it belongs here.",
  },
  {
    icon: Users,
    title: "Quality over noise",
    body: "NAMI looks for people putting proper thought into how they show up: strong work, good stories, clear identity, and a bit of soul.",
  },
];

export default function NetworkPage() {
  return (
    <>
      <PageHero
        eyebrow="NAMI Creative Network"
        title={
          <>
            NAMI Creative{" "}
            <span className="text-gradient sm:block">Network</span>
          </>
        }
        lead="A home for North East creatives making waves. Spotlights, stories, and support for the people, places, and projects putting proper work into the world."
      >
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="#feature-form"
            className="group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-4 text-sm font-semibold text-white shadow-[0_4px_20px_rgb(255_0_188/0.3)] transition-all duration-300 hover:bg-accent-soft hover:shadow-[0_8px_40px_rgb(255_0_188/0.5)]"
          >
            Apply to be featured
            <ArrowDown
              size={16}
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-y-0.5"
            />
          </Link>
        </div>
      </PageHero>

      <section className="container-shell py-20 md:py-28">
        <div className="grid gap-12 md:grid-cols-[0.9fr_1.1fr] md:gap-20">
          <p className="mono-label md:mt-2">01 / The story</p>
          <div className="max-w-2xl space-y-6">
            <p className="text-2xl font-medium leading-[1.06] tracking-tight md:text-3xl md:leading-[1.03]">
              NAMI started as NAMI Up North, built around one simple idea:
              support local creativity and give good work a bit more light
            </p>
            <p className="leading-relaxed text-fg-muted md:text-lg">
              The name has evolved, but the message has not. NAMI still backs
              the North East. Artists, musicians, photographers, designers,
              independent businesses, freelancers, makers, and brands grafting
              away deserve to be seen by more people.
            </p>
            <p className="leading-relaxed text-fg-muted md:text-lg">
              This page is the front door for that. If you are building
              something up here, or you know someone who is, send it in. I will
              keep an eye on the work and feature the projects that feel right
              for the page.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-surface-1/35 py-20 md:py-28">
        <div className="container-shell">
          <div className="mb-12 max-w-3xl">
            <p className="mono-label mb-5">02 / The promise</p>
            <h2 className="text-4xl font-semibold leading-[1.06] tracking-tight md:text-6xl md:leading-[1.03]">
              This is about giving{" "}
              <span className="text-gradient sm:block">good work a platform</span>
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {promiseCards.map((card) => {
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
        </div>
      </section>

      <section className="container-shell py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
          <div>
            <p className="mono-label mb-5">03 / Who it is for</p>
            <h2 className="text-4xl font-semibold leading-[1.06] tracking-tight md:text-5xl md:leading-[1.03]">
              If you are making something in the North East,{" "}
              <span className="text-gradient sm:block">I want to see it</span>
            </h2>
            <p className="mt-6 max-w-xl leading-relaxed text-fg-muted md:text-lg">
              You do not need a huge following. You do not need everything
              polished. If the work has care behind it, send it over.
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


      <section className="border-y border-line py-16 md:py-20">
        <div className="container-shell">
          <div className="mx-auto max-w-4xl rounded-2xl border border-line bg-surface-1/55 p-6 text-center backdrop-blur-md md:p-10">
            <p className="text-xl font-bold leading-relaxed text-accent md:text-2xl">
              I am building the region&apos;s largest community of creatives,
              artists, musicians, and small businesses, so people have one
              central place to discover your work and hire you for what you do.
            </p>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-fg-muted md:text-lg">
              Join the communities below to be part of the journey. Showcase
              your work in the Facebook group, then share experiences, ideas,
              and best practice in the WhatsApp creative community.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href={facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-4 text-sm font-semibold text-white shadow-[0_4px_20px_rgb(255_0_188/0.3)] transition-all duration-300 hover:bg-accent-soft hover:shadow-[0_8px_40px_rgb(255_0_188/0.5)]"
              >
                Join our Facebook group
                <Users size={16} aria-hidden />
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 rounded-full border border-line-strong px-7 py-4 text-sm font-semibold text-fg transition-colors duration-300 hover:border-accent hover:bg-white/5"
              >
                Join the WhatsApp community
                <MessageCircle size={16} aria-hidden />
              </a>
            </div>
          </div>
        </div>
      </section>
      <section
        id="feature-form"
        className="border-t border-line bg-surface-1/30 py-20 md:py-28"
      >
        <div className="container-shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <p className="mono-label mb-5">04 / Apply to be featured</p>
            <h2 className="text-4xl font-semibold leading-[1.06] tracking-tight md:text-5xl md:leading-[1.03]">
              Drop the work in.{" "}
              <span className="text-gradient sm:block">I will take a look</span>
            </h2>
            <p className="mt-6 max-w-xl leading-relaxed text-fg-muted md:text-lg">
              Use this for your own work, a business you love, or someone you
              think more people should know about. There is no cost to feature.
            </p>
            <div className="mt-8 rounded-2xl border border-line bg-surface-0/60 p-6">
              <Sparkles size={20} className="text-accent" aria-hidden />
              <p className="mt-4 text-sm leading-relaxed text-fg-muted">
                Future bits might include a creative map, events,
                collaborations, or opportunities. For now, the focus is simple:
                find good North East work and put more eyes on it.
              </p>
            </div>
          </div>

          <NetworkForm />
        </div>
      </section>

      <section className="container-shell py-20 text-center md:py-28">
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
