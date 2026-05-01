import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";

export default function ThankYouPage() {
  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden">
      {/* atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        <div
          className="absolute"
          style={{
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: "70vw",
            height: "70vw",
            maxWidth: "1100px",
            maxHeight: "1100px",
            filter: "blur(110px)",
            background:
              "radial-gradient(circle, rgb(230 50 175 / 0.45) 0%, rgb(100 200 255 / 0.18) 35%, transparent 65%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/></filter><rect width='200' height='200' filter='url(%23n)'/></svg>\")",
          }}
        />
      </div>

      <div className="container-shell relative z-10 py-24 md:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto inline-grid size-16 place-items-center rounded-full border border-accent/40 bg-accent/10 backdrop-blur-md">
            <Check size={28} className="text-accent" aria-hidden />
          </div>
          <p className="eyebrow mt-8">Got it</p>
          <h1 className="mt-4 text-[clamp(2.5rem,6vw,5rem)] font-medium leading-[1.05] tracking-[-0.02em]">
            Thanks — we'll be{" "}
            <span className="font-serif italic text-gradient">
              in touch shortly.
            </span>
          </h1>
          <p className="mt-6 text-lg text-fg-muted md:text-xl leading-relaxed">
            Your brief has landed. We respond personally — usually within one
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
    </section>
  );
}
