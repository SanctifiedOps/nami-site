import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Check, MessageCircle, Users } from "lucide-react";
import { HeroLights } from "@/components/hero/hero-lights";
import { VideoBackground } from "@/components/hero/video-background";

const facebookUrl = "https://www.facebook.com/groups/1033572522893615";
const whatsappUrl = "https://chat.whatsapp.com/Fq8MpjoXZTo7FFGM9KUiOr";

export const metadata: Metadata = {
  title: "Submission received - NAMI Creative Network",
  description:
    "Thanks for submitting to NAMI Creative Network. Join the WhatsApp community or explore the main NAMI Creative website.",
  alternates: {
    canonical: "/network/thank-you",
  },
};

export default function NetworkThankYouPage() {
  return (
    <section data-compact-footer="network-thank-you" className="relative overflow-hidden">
      <VideoBackground src="wave-3.mp4" overlay={0.78} />
      <HeroLights />

      <div className="container-shell relative z-10 pt-20 pb-8 md:pt-24 md:pb-10">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto inline-grid size-16 place-items-center rounded-full border border-accent/40 bg-accent/10 backdrop-blur-md">
            <Check size={28} className="text-accent" aria-hidden />
          </div>

          <p className="mono-label mt-8">Submission received</p>
          <h1 className="mt-5 text-[clamp(2.6rem,7vw,6rem)] font-medium leading-[0.94] tracking-tight md:leading-[0.9]">
            Nice one. You put your work forward
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-fg-muted md:text-xl">
            That takes a bit of graft. Whether the work is finished, still
            finding its feet, or just ready for more people to see it, putting
            creative work into the world is something to be proud of.
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-fg-subtle md:text-lg">
            I will take a look and keep an eye on what you are building. NAMI is
            here to support North East creatives, artists, businesses, and
            brands doing proper work.
          </p>

          <div className="mx-auto mt-9 max-w-2xl rounded-2xl border border-line bg-surface-1/55 p-5 text-center backdrop-blur-md md:p-6">
            <p className="text-base font-bold leading-relaxed text-accent md:text-lg">
              I am building the region's largest community of creatives,
              artists, musicians, and small businesses, so people have one
              central place to discover your work and hire you for what you do.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-fg-muted md:text-base">
              Join the communities below to be part of the journey. Showcase
              your work in the Facebook group, then share experiences, ideas,
              and best practice in the WhatsApp creative community.
            </p>
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
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