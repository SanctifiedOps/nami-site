import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  AtSign,
  Mail,
  MessageCircle,
  Share2,
  Users,
  Search,
} from "lucide-react";
import { HeroLights } from "@/components/hero/hero-lights";
import { NetworkHeroBackground } from "@/components/hero/network-hero-background";

const facebookUrl = "https://www.facebook.com/groups/1033572522893615";
const whatsappUrl = "https://chat.whatsapp.com/Fq8MpjoXZTo7FFGM9KUiOr";
const instagramUrl = "https://www.instagram.com/namicreativeuk/";

export const metadata: Metadata = {
  title: "You are in - NAMI Creative Network",
  description:
    "Thanks for joining NAMI Creative Network. Share your work, join the community spaces, and tag NAMI in your latest projects.",
  alternates: {
    canonical: "/network/thank-you",
  },
  robots: {
    index: false,
    follow: false,
  },
};

const nextSteps = [
  {
    icon: Users,
    title: "Show the group what you are making",
    body: "Use the Facebook group to post new projects, recent work, launches, offers, events, and anything you want more local people to see.",
  },
  {
    icon: MessageCircle,
    title: "Get into the conversation",
    body: "Use the WhatsApp community for ideas, questions, support, useful links, and the day-to-day chat around building creative work up here.",
  },
  {
    icon: Share2,
    title: "Tag NAMI in your latest posts",
    body: "When you post new work on Instagram, tag @namicreativeuk so I can keep up with it and share the right things with the wider audience.",
  },
];

export default function NetworkThankYouPage() {
  return (
    <section data-compact-footer="network-thank-you" className="relative overflow-hidden">
      <NetworkHeroBackground />
      <div aria-hidden className="absolute inset-0 bg-surface-0/55" />
      <div aria-hidden className="absolute inset-0 bg-linear-to-b from-surface-0/35 via-surface-0/50 to-surface-0" />
      <HeroLights />

      <div className="container-shell relative z-10 pt-20 pb-8 md:pt-24 md:pb-10">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto inline-grid size-16 place-items-center rounded-full border border-accent/40 bg-accent/10 backdrop-blur-md">
            <Check size={28} className="text-accent" aria-hidden />
          </div>

          <p className="mono-label mt-8 text-accent">You are in the Network</p>
          <h1 className="mt-5 text-[clamp(1.8rem,3.7vw,3.15rem)] font-semibold leading-[1.03] tracking-tight md:leading-[1]">
            Your welcome email is on its way
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-fg md:text-xl">
            Check your inbox for a message from NAMI Creative. If it is not
            there, have a look in your spam or junk folder and move it to your
            inbox. Add <strong className="font-semibold text-accent">hello@namicreative.co.uk</strong> to
            your contacts so you do not miss future updates from me.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-5xl rounded-3xl border border-accent/35 bg-surface-1/95 p-7 text-center shadow-[0_20px_70px_rgb(0_0_0/0.28)] md:p-10">
          <p className="mono-label text-accent">Your place in the Network</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">Your directory profile is next</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-fg-muted md:text-lg">
            I will add your profile to the Creative Directory shortly. It is
            where people across the North East can find your work, follow what
            you are making and get in touch. Have a look around while I get
            yours ready.
          </p>
          <Link href="/network/directory" className="group mt-7 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-4 text-sm font-semibold text-white shadow-[0_4px_20px_rgb(255_0_188/0.3)] transition-all duration-300 hover:bg-accent-soft hover:shadow-[0_8px_40px_rgb(255_0_188/0.5)]">
            Explore the Creative Directory
            <Search size={16} aria-hidden />
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href={facebookUrl}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 rounded-full border border-line-strong px-7 py-4 text-sm font-semibold text-fg transition-colors duration-300 hover:border-accent hover:bg-white/5"
          >
            Join the Facebook group
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
          <a
            href={instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 rounded-full border border-line-strong px-7 py-4 text-sm font-semibold text-fg transition-colors duration-300 hover:border-accent hover:bg-white/5"
          >
            Follow and tag NAMI
            <AtSign size={16} aria-hidden />
          </a>
        </div>

        <div className="mx-auto mt-10 grid max-w-6xl gap-5 md:grid-cols-3">
          {nextSteps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="rounded-2xl border border-line bg-surface-1/90 p-6 backdrop-blur-md md:p-7"
              >
                <Icon size={22} className="text-accent" aria-hidden />
                <h2 className="mt-5 text-xl font-semibold tracking-tight text-fg">
                  {step.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-fg-muted md:text-base">
                  {step.body}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mx-auto mt-10 max-w-3xl text-center">
          <Mail size={22} className="mx-auto text-accent" aria-hidden />
          <p className="mt-4 text-lg font-bold leading-relaxed text-accent md:text-xl">
            NAMI will send a weekly Creative Network roundup.
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-fg-muted md:text-base">
            Expect featured creators, spotlights, local creative news, events,
            opportunities, and useful bits from across the North East. It gives
            NAMI another way to keep your work moving through the network.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-3xl rounded-2xl bg-accent p-6 text-center text-white shadow-[0_16px_60px_rgb(255_0_188/0.24)] md:p-8">
          <p className="text-xl font-semibold leading-tight md:text-2xl">
            Want your work to turn into more paid enquiries?
          </p>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-white/88">
            If people like what you do but still need too much explaining, your
            content, website, shop, booking page, or follow-up might be making
            the buyer journey harder than it needs to be. Creator Wave Workshop
            is a simple check of that path, so more of the right people know
            what to do next.
          </p>
          <Link
            href="/offers/creator-wave-workshop"
            className="group mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-black transition-transform duration-300 hover:scale-[1.02]"
          >
            View Creator Wave Workshop
            <ArrowUpRight
              size={14}
              aria-hidden
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
