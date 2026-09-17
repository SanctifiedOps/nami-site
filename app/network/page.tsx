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
import { ParallaxBackdrop } from "@/components/motion/parallax-backdrop";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { NetworkForm } from "./network-form";

export const metadata: Metadata = {
  title: "NAMI Creative Network | North East Creatives",
  description:
    "Join NAMI Creative Network. Get your work seen, find other North East creatives and make a NAMI network profile people can find.",
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
      "Get your work seen, find your people and join the NAMI Creative Network.",
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
    title: "Get your work seen",
    body: "Your NAMI network profile shows what you do, where you're based and where people can find more of your work. It stays there after a post has disappeared down the feed.",
  },
  {
    icon: Users,
    title: "Find your people",
    body: "Have a look around the directory. You might find someone to work with, learn from or simply have a coffee with.",
  },
  {
    icon: Handshake,
    title: "Be easier to recommend",
    body: "When someone asks me for a photographer, designer, maker or local business, your NAMI network profile gives me somewhere useful to send them.",
  },
];


const joinSteps = [
  "What you send becomes your NAMI network profile in the live directory",
  "People can find you in the directory by what you do and where you're based",
  "Your profile can link to your Instagram and website or portfolio",
  "You will get links to the WhatsApp community and Facebook group",
  "I can keep you in mind for features and introductions when there's a good fit",
];
const futureAccess = [
  {
    icon: Sparkles,
    title: "Showcase opportunities",
    body: "I feature and share members' work so it reaches people beyond the same old circle.",
  },
  {
    icon: Mail,
    title: "Network roundups",
    body: "Emails with people to follow, things happening locally and opportunities worth a look.",
  },
  {
    icon: CalendarDays,
    title: "Events and meetups",
    body: "A chance to meet the people behind the work, not just their Instagram handles.",
  },
  {
    icon: MapPin,
    title: "Local referrals",
    body: "A NAMI network profile I can pass on when someone is looking for what you do.",
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
        networkBackground
        eyebrow="NAMI Creative Network"
        title={
          <>
            Find your people.{" "}
            <span className="text-gradient sm:block">Get your work seen.</span>
          </>
        }
        lead="Meet North East creatives. Give people a way to discover your work, hire you, buy from you or get in touch."
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
        <div className="mx-auto max-w-3xl text-center">
          <div className="space-y-6">
            <p className="text-2xl font-medium leading-[0.98] tracking-tight md:text-3xl md:leading-[0.96]">
              There&apos;s so much good work being made up here. Too much of it stays in its own little corner.
            </p>
            <p className="mx-auto max-w-2xl leading-relaxed text-fg-muted md:text-lg">
              I started the NAMI Creative Network to help more people see the artists, musicians, photographers, makers and independent businesses working right on their doorstep.
            </p>
            <p className="mx-auto max-w-2xl leading-relaxed text-fg-muted md:text-lg">
              The directory gives that work a place to be found. The rest is about helping people meet, share opportunities and back each other.
            </p>
            <div className="pt-2">
              <FormAnchor>Join the network</FormAnchor>
            </div>
          </div>
        </div>
      </section>

      <section data-network-section="why_join" className="border-y border-line bg-surface-1/35 py-20 md:py-28">
        <div className="container-shell">
          <div className="mx-auto mb-12 max-w-4xl text-center">
            <p className="mono-label mb-5">02 / Why join</p>
            <h2 className="type-section-title">
              Good work deserves to travel further than your own feed
            </h2>
            <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-fg-muted md:text-lg">
              A post can vanish by lunchtime. Your profile stays in the directory, where someone looking for what you do can find you later.
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
                  <h3 className="type-card-title mt-6">
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
            <FormAnchor>Make your NAMI network profile</FormAnchor>
          </div>
        </div>
      </section>

      <section
        data-network-section="who_belongs"
        className="relative isolate overflow-hidden border-y border-line py-20 md:py-28"
      >
        <ParallaxBackdrop
          src="/images/north-east/7.jpg"
          position="center 52%"
          overlay={0.86}
        />
        <div className="container-shell relative z-10 grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-20">
          <ScrollReveal>
            <div>
            <p className="mono-label mb-5">03 / Who belongs here</p>
            <h2 className="type-section-title">
              If you&apos;re making something up here, you belong here
            </h2>
            <p className="mt-6 max-w-xl leading-relaxed text-fg-muted md:text-lg">
              You don&apos;t need a huge following or a perfectly polished feed. If you&apos;re making, building, filming, playing, painting or running an independent business in the North East, I&apos;d like to know about it.
            </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
            {audience.map((item, index) => (
              <ScrollReveal key={item} delay={(index % 4) * 0.055}>
                <div
                  className={`group relative min-h-20 overflow-hidden border border-line bg-surface-0/70 px-5 py-5 text-sm font-medium text-fg shadow-[0_12px_36px_rgb(0_0_0/0.16)] backdrop-blur-sm transition-[transform,border-color,background-color,box-shadow] duration-700 ease-[var(--ease-out-expo)] hover:-translate-y-1.5 hover:scale-[1.012] hover:border-accent/40 hover:bg-surface-1/90 hover:shadow-[0_20px_48px_rgb(0_0_0/0.3),0_0_28px_rgb(255_0_188/0.08)] motion-reduce:transform-none ${
                    index === 0 || index === 5
                      ? "bg-[linear-gradient(135deg,rgb(255_0_188/0.11),rgb(12_13_16/0.78)_62%)]"
                      : ""
                  }`}
                >
                  <span className="relative z-10">{item}</span>
                  <span
                    aria-hidden
                    className="absolute -bottom-10 -right-8 h-24 w-24 rounded-full bg-accent/0 blur-2xl transition-colors duration-700 group-hover:bg-accent/15"
                  />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section data-network-section="opportunities" className="border-y border-line py-20 md:py-28">
        <div className="container-shell">
          <div className="mx-auto max-w-4xl text-center">
            <p className="mono-label mb-5">04 / What it can open up</p>
            <h2 className="type-section-title">
              Your NAMI network profile is where it starts
            </h2>
            <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-fg-muted md:text-lg">
              Put your work somewhere people can find it. Then I can help with features, introductions, roundups and chances to meet the people behind the names.
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
                  <h3 className="type-card-title mt-6">
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
              The directory is live, and there&apos;s room for your work in it.
            </p>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-fg-muted md:text-lg">
              Make a NAMI network profile people can find. From there, I can keep an eye on what you&apos;re doing and put you forward when the right thing comes up.
            </p>
            <div className="mt-8">
              <FormAnchor>Join the network</FormAnchor>
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
            <h2 className="type-section-title">
              Join the NAMI Creative Network today
            </h2>
            <p className="mt-6 max-w-xl leading-relaxed text-fg-muted md:text-lg">
              Tell me what you do, where you&apos;re based and how you want to appear in the directory. I&apos;ll turn that into a NAMI network profile people can find and share.
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
                It&apos;s free to join. Your NAMI network profile may take a little time to appear after you submit.
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


