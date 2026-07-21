import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Check, Home, MessageCircle, Users } from "lucide-react";
import { InstagramIcon } from "@/components/icons/socials";
import { HeroLights } from "@/components/hero/hero-lights";
import { VideoBackground } from "@/components/hero/video-background";

const instagramUrl = "https://www.instagram.com/namicreativeuk/";
const facebookUrl = "https://www.facebook.com/groups/1033572522893615";
const whatsappUrl = "https://chat.whatsapp.com/Fq8MpjoXZTo7FFGM9KUiOr";

export const metadata: Metadata = {
  title: "Thanks - NAMI Creative",
  description:
    "Thanks for getting in touch with NAMI Creative. Joe will review your enquiry and come back to you shortly.",
  alternates: {
    canonical: "/thank-you",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function ThankYouPage() {
  return (
    <section data-compact-footer="compact-thank-you" className="relative overflow-hidden">
      <VideoBackground src="wave-3.mp4" overlay={0.78} />
      <HeroLights />

      <div className="container-shell relative z-10 py-20 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto inline-grid size-16 place-items-center rounded-full border border-accent/40 bg-accent/10 backdrop-blur-md">
            <Check size={28} className="text-accent" aria-hidden />
          </div>

          <p className="mono-label mt-8">Enquiry received</p>
          <h1 className="mt-5 text-[clamp(1.8rem,3.7vw,3.15rem)] font-semibold leading-[1.03] tracking-tight md:leading-[1]">
            Thanks. I&apos;ll take a proper look
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-fg-muted md:text-xl">
            Your message has landed. I usually respond within one working day.
            If I can help, I&apos;ll suggest a clear next step. If it is not the
            right fit, I&apos;ll be straight with you.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-6xl gap-5">
          <div className="rounded-2xl border border-line bg-surface-1/55 p-6 text-center backdrop-blur-md md:p-8">
            <p className="text-lg font-bold leading-relaxed text-accent md:text-xl">
              Interested in North East creativity?
            </p>
            <p className="mx-auto mt-3 max-w-3xl leading-relaxed text-fg-muted">
              I&apos;m building the region&apos;s biggest creative community, giving
              artists, freelancers, musicians, makers, and small businesses a
              central place to be seen, discovered, and backed.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3 lg:flex-nowrap">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex min-w-[12.5rem] items-center justify-center gap-2 rounded-full border border-line-strong px-5 py-3 text-sm font-semibold text-fg transition-colors duration-300 hover:border-accent hover:bg-white/5"
              >
                Follow Instagram
                <InstagramIcon size={15} aria-hidden />
              </a>
              <a
                href={facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex min-w-[12.5rem] items-center justify-center gap-2 rounded-full border border-line-strong px-5 py-3 text-sm font-semibold text-fg transition-colors duration-300 hover:border-accent hover:bg-white/5"
              >
                Facebook group
                <Users size={15} aria-hidden />
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex min-w-[12.5rem] items-center justify-center gap-2 rounded-full border border-line-strong px-5 py-3 text-sm font-semibold text-fg transition-colors duration-300 hover:border-accent hover:bg-white/5"
              >
                WhatsApp
                <MessageCircle size={15} aria-hidden />
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-surface-1/55 p-6 text-center backdrop-blur-md md:p-8">
            <p className="text-lg font-semibold leading-relaxed text-fg md:text-xl">
              While you wait, have a look at the work behind the words.
            </p>
            <p className="mx-auto mt-3 max-w-3xl leading-relaxed text-fg-muted">
              The main site shows how I help founders and small teams make the
              brand, content, website, and buyer journey feel clearer, calmer,
              and easier to act on.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/work"
                className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-white shadow-[0_4px_20px_rgb(255_0_188/0.3)] transition-all duration-300 hover:bg-accent-soft hover:shadow-[0_8px_40px_rgb(255_0_188/0.5)]"
              >
                See selected work
                <ArrowUpRight
                  size={14}
                  aria-hidden
                  className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
              <Link
                href="/"
                className="group inline-flex items-center gap-2 rounded-full border border-line-strong px-6 py-3.5 text-sm font-semibold text-fg transition-colors duration-300 hover:border-accent hover:bg-white/5"
              >
                Main website
                <Home size={15} aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


