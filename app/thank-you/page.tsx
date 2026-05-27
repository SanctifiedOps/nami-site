import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { NewsletterSubscribe } from "@/components/sections/newsletter-subscribe";
import { VideoBackground } from "@/components/hero/video-background";
import { HeroLights } from "@/components/hero/hero-lights";

export default function ThankYouPage() {
  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden">
      {/* video background */}
      <VideoBackground src="wave-3.mp4" overlay={0.74} />
      <HeroLights />

      <div className="container-shell relative z-10 py-24 md:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto inline-grid size-16 place-items-center rounded-full border border-accent/40 bg-accent/10 backdrop-blur-md">
            <Check size={28} className="text-accent" aria-hidden />
          </div>
          <p className="eyebrow mt-8">Got it</p>
          <h1 className="mt-4 text-[clamp(2.5rem,6vw,5rem)] font-medium leading-[1.05] tracking-[-0.02em]">
            Thanks. We'll be{" "}
            <span className="text-gradient">
              in touch shortly.
            </span>
          </h1>
          <p className="mt-6 text-lg text-fg-muted md:text-xl leading-relaxed">
            Your brief has landed. We respond personally, usually within one
            working day. If it's a fit, we'll suggest a discovery call. If it
            isn't, we'll be honest about it.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/insights"
              className="group inline-flex items-center gap-2 rounded-full border border-line-strong px-7 py-4 text-sm font-semibold text-fg transition-colors duration-300 hover:bg-white/5 hover:border-accent"
            >
              Read while you wait
              <ArrowUpRight
                size={14}
                aria-hidden
                className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
            <Link
              href="/"
              className="text-sm font-medium text-fg-muted hover:text-accent transition-colors"
            >
              Back to home
            </Link>
          </div>
        </div>
      </div>
      <div className="container-shell relative z-10 pb-24 md:pb-32">
        <NewsletterSubscribe
          variant="card"
          eyebrow="While you wait"
          title={
            <>
              Get the studio notes,{" "}
              <span className="text-gradient">delivered.</span>
            </>
          }
          lead="Occasional writing on brand systems, content engines, and the work behind the work. We'll send the next piece your way."
        />
      </div>
    </section>
  );
}
