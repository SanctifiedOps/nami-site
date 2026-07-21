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
} from "lucide-react";
import { HeroLights } from "@/components/hero/hero-lights";
import { VideoBackground } from "@/components/hero/video-background";

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
      <VideoBackground src="wave-3.mp4" overlay={0.78} />
      <HeroLights />

      <div className="container-shell relative z-10 pt-20 pb-8 md:pt-24 md:pb-10">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto inline-grid size-16 place-items-center rounded-full border border-accent/40 bg-accent/10 backdrop-blur-md">
            <Check size={28} className="text-accent" aria-hidden />
          </div>

          <p className="mono-label mt-8">You are in</p>
          <h1 className="mt-5 text-[clamp(1.8rem,3.7vw,3.15rem)] font-semibold leading-[1.03] tracking-tight md:leading-[1]">
            Nice one. Welcome to the network
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-fg-muted md:text-xl">
            Putting creative work into the world takes nerve, graft, and a lot
            of care. NAMI exists to help more people across the North East see
            that work and back the people behind it.
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-fg-subtle md:text-lg">
            I will keep an eye on what you are building and use the network for
            future features, roundups, referrals, events, and showcase
            opportunities. Here is what to do next.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-6xl gap-5 md:grid-cols-3">
          {nextSteps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="rounded-2xl border border-line bg-surface-1/55 p-6 backdrop-blur-md md:p-7"
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

        <div className="mx-auto mt-8 max-w-4xl rounded-2xl border border-line bg-surface-1/55 p-6 text-center backdrop-blur-md md:p-8">
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

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href={facebookUrl}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-4 text-sm font-semibold text-white shadow-[0_4px_20px_rgb(255_0_188/0.3)] transition-all duration-300 hover:bg-accent-soft hover:shadow-[0_8px_40px_rgb(255_0_188/0.5)]"
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

        <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-line bg-surface-1/55 p-6 text-center backdrop-blur-md md:p-7">
          <p className="text-lg font-medium leading-relaxed text-fg md:text-xl">
            Want more people to understand what you do and buy from you?
          </p>
          <p className="mx-auto mt-3 max-w-2xl leading-relaxed text-fg-muted">
            If people like what you do but still need too much explaining,
            your content, website, and follow-up are probably making the sale
            harder than it needs to be. I help you give customers a clearer
            path to purchase, so more of the right people know what to do next.
          </p>
          <Link
            href="/contact"
            className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-fg transition-colors hover:text-accent"
          >
            Talk to NAMI about the work
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



