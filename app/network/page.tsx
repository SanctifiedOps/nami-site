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
import { AnimatedMemberTooltip } from "@/components/ui/animated-member-tooltip";
import { RotatingMemberCards } from "@/components/ui/rotating-member-cards";
import { ParallaxBackdrop } from "@/components/motion/parallax-backdrop";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { Testimonials } from "@/components/sections/testimonials";
import type { Testimonial } from "@/lib/content/testimonials";
import { getNetworkDirectoryMembers } from "@/lib/content/network-directory-live";
import { isShowcaseReadyMember } from "@/lib/content/network-directory";
import { NetworkForm } from "./network-form";

export const metadata: Metadata = {
  title: "NAMI Creative Network | North East Creatives",
  description:
    "Join NAMI Creative Network. Get your work seen, find other North East creatives and make a NAMI network profile people can find.",
  openGraph: {
    images: [
      {
        url: "/assets/images/nami-og.png",
        width: 1080,
        height: 540,
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
  "Send the form so I can review your details and add you to the Network",
  "Once approved, you'll receive an email with a secure link to claim your profile",
  "Create your login, then edit your profile picture, information and links whenever you need to",
  "Upload portfolio work with links to the full projects behind it",
  "Submit your own events for approval and inclusion in the Network calendar",
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

const networkReviews: Testimonial[] = [
  {
    quote:
      "Joe has really reinvigorated the creative community in the North East with his passion for promoting and supporting local creatives. Being part of the network has led to feeling more secure and inspired in what I do.",
    author: "cgicentralncl",
    role: "Google review",
    href: "https://maps.app.goo.gl/qtpGjDZMwHVxmwpo6",
  },
  {
    quote:
      "Joe is putting together a REALLY supportive network and even though I'm slightly further afield than the North East, I've still been welcomed warmly and Joe's enthusiasm is honestly second to none! Keep going my man!",
    author: "Sam Aylard",
    role: "Google review",
    href: "https://maps.app.goo.gl/3XssNZ7LZYfVfpK49",
  },
  {
    quote:
      "Amazing collective of networked creatives. Joe has done an amazing job of bringing us all together into a vibrant community. Prior to this, I really had no idea how much talent there was in the region. The one-stop resource for anyone looking for a North-East based creative.",
    author: "neil johnson",
    role: "Google review",
    href: "https://maps.app.goo.gl/TRuYhj6YKE4M8GPV6",
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

export default async function NetworkPage() {
  const members = await getNetworkDirectoryMembers();
  const showcaseMembers = members.filter(isShowcaseReadyMember);

  return (
    <>
      <div data-network-section="hero">
        <PageHero
        networkBackground
        eyebrow="NAMI Creative Network"
        title={
          <>
            Find your people and{" "}
            <span className="sm:block">get your work seen</span>
          </>
        }
        lead="Meet North East creatives. Give people a way to discover your work, hire you, buy from you or get in touch."
        aboveTitle={
          <AnimatedMemberTooltip
            memberCount={members.length}
            context="join"
            items={showcaseMembers.map((member) => ({
              id: member.id,
              name: member.name,
              designation: member.category,
              image: member.profileImage,
            }))}
          />
        }
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
                  className="glass-refractive rounded-2xl p-7 text-center md:p-8 md:text-left"
                >
                  <Icon size={22} className="mx-auto text-accent md:mx-0" aria-hidden />
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
            <div className="text-center lg:text-left">
            <p className="mono-label mb-5">03 / Who belongs here</p>
            <h2 className="type-section-title">
              If you&apos;re making something up here, you belong here
            </h2>
            <p className="mx-auto mt-6 max-w-xl leading-relaxed text-fg-muted md:text-lg lg:mx-0">
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
                  } text-center md:text-left`}
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
                  className="rounded-2xl border border-line bg-surface-1/45 p-7 text-center md:p-8 md:text-left"
                >
                  <Icon size={22} className="mx-auto text-accent md:mx-0" aria-hidden />
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

          <div className="mt-12">
            <RotatingMemberCards members={showcaseMembers} />
            <div className="mt-8 text-center">
              <FormAnchor>Join the network</FormAnchor>
            </div>
          </div>
        </div>
      </section>

      <Testimonials
        items={networkReviews}
        eyebrow="From the Network"
        title="What our members think"
        lead="Three members on what it feels like to be part of the NAMI Creative Network."
        backgroundImage="/images/north-east/3.jpg"
        uniform
        className="bg-surface-0"
      />

      <section
        data-network-section="join_form"
        id="join-network"
        className="border-t border-line bg-surface-1/30 py-20 md:py-28"
      >
        <div className="container-shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div className="text-center lg:text-left">
            <p className="mono-label mb-5">05 / Join the network</p>
            <h2 className="type-section-title">
              Join the NAMI Creative Network today
            </h2>
            <p className="mx-auto mt-6 max-w-xl leading-relaxed text-fg-muted md:text-lg lg:mx-0">
              Tell me what you do, where you&apos;re based and how you want to appear in the directory. Once your application is approved, you can claim your profile, log in and keep it up to date yourself.
            </p>
            <div className="mt-8 rounded-2xl border border-line bg-surface-0/60 p-6 text-left">
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
                It&apos;s free to join. I review each application before the profile goes live.
              </p>
            </div>
          </div>

          <NetworkForm />
        </div>
      </section>

    </>
  );
}


