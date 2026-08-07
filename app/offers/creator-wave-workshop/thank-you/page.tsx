import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { InstagramIcon } from "@/components/icons/socials";
import { HeroLights } from "@/components/hero/hero-lights";
import { VideoBackground } from "@/components/hero/video-background";
import { CreatorWaveThankYouTracker } from "./creator-wave-thank-you-tracker";

const instagramUrl = "https://www.instagram.com/namicreativeuk/";

export const metadata: Metadata = {
  title: "Creator Wave enquiry received - NAMI Creative",
  description:
    "Thanks for asking me to look at your buyer journey. Your Creator Wave Workshop enquiry has been received.",
  alternates: {
    canonical: "/offers/creator-wave-workshop/thank-you",
  },
  robots: {
    index: false,
    follow: false,
  },
};


export default function CreatorWaveWorkshopThankYouPage() {
  return (
    <section data-compact-footer="creator-wave-thank-you" className="relative overflow-hidden">
      <CreatorWaveThankYouTracker />
      <VideoBackground src="wave-3.mp4" overlay={0.78} />
      <HeroLights />

      <div className="container-shell relative z-10 pt-20 pb-10 md:pt-24 md:pb-12">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto inline-grid size-16 place-items-center rounded-full border border-accent/40 bg-accent/10 backdrop-blur-md">
            <Check size={28} className="text-accent" aria-hidden />
          </div>

          <h1 className="mt-8 text-[clamp(1.9rem,4vw,3.35rem)] font-semibold leading-[1.03] tracking-tight md:leading-[1]">
            Nice one. I&apos;ll take a proper look
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-fg-muted md:text-xl">
            Your Creator Wave enquiry has landed. I&apos;ll look at what you sent and come back with the most sensible next step, whether that is a free check-in, the written report, or leaving it alone until the timing is right.
          </p>
        </div>

        <div className="mx-auto mt-12 flex max-w-3xl flex-col items-center gap-12 text-center">
          <div className="w-full border-t border-accent/45 pt-8">
            <h2 className="text-2xl font-semibold leading-tight tracking-tight md:text-3xl">
              What happens next
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-pretty leading-relaxed text-accent">
              I will take a look through the links, your content, and the customer journey before the call, so I can give you the clearest read on where people might be getting stuck and what you can do to improve it.
            </p>
            <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-fg-subtle">
              You do not need to have everything polished before we talk. Send what you have, and I will come into the conversation with a proper view of the route people are taking.
            </p>
          </div>

          <div className="w-full border-t border-accent/45 pt-8">
            <p className="text-xl font-semibold leading-tight text-fg md:text-2xl">
              While you wait, have a look around
            </p>
            <p className="mx-auto mt-4 max-w-xl leading-relaxed text-fg-muted">
              The main site shows how I help businesses and creators make their content, website, and buyer journey easier to act on.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/work"
                className="group inline-flex min-w-[12rem] items-center justify-center gap-2 rounded-full border border-line-strong px-6 py-3.5 text-sm font-semibold text-fg transition-colors duration-300 hover:border-accent hover:bg-white/5"
              >
                See selected work
                <ArrowUpRight size={14} aria-hidden className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                href="/insights"
                className="group inline-flex min-w-[12rem] items-center justify-center gap-2 rounded-full border border-line-strong px-6 py-3.5 text-sm font-semibold text-fg transition-colors duration-300 hover:border-accent hover:bg-white/5"
              >
                Insights
                <ArrowUpRight size={14} aria-hidden className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-14 max-w-3xl border-t border-accent/45 pt-10 text-center md:mt-16 md:pt-12">
          <p className="text-lg font-bold leading-relaxed text-accent md:text-xl">
            Interested in North East creativity too?
          </p>
          <p className="mx-auto mt-3 max-w-3xl leading-relaxed text-fg-muted">
            I&apos;m also building the NAMI Creative Network: a place for North East creatives, freelancers, makers, musicians, artists, and small businesses to be seen, backed, and connected.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex min-w-[11.5rem] items-center justify-center gap-2 rounded-full border border-line-strong px-5 py-3 text-sm font-semibold text-fg transition-colors duration-300 hover:border-accent hover:bg-white/5"
            >
              Follow Instagram
              <InstagramIcon size={15} aria-hidden />
            </a>
            <Link
              href="/network"
              className="group inline-flex min-w-[11.5rem] items-center justify-center gap-2 rounded-full border border-line-strong px-5 py-3 text-sm font-semibold text-fg transition-colors duration-300 hover:border-accent hover:bg-white/5"
            >
              Join the network
              <ArrowUpRight size={15} aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
