import Link from "next/link";
import { ArrowUpRight, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden">
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
            width: "60vw",
            height: "60vw",
            maxWidth: "900px",
            maxHeight: "900px",
            filter: "blur(110px)",
            background:
              "radial-gradient(circle, rgb(255 0 188 / 0.35) 0%, rgb(100 200 255 / 0.15) 30%, transparent 65%)",
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
          <p
            aria-hidden
            className="font-mono text-sm text-accent tracking-widest"
          >
            404
          </p>
          <h1 className="mt-6 text-[clamp(2.5rem,6vw,5rem)] font-medium leading-[1.05] tracking-[-0.02em]">
            That page{" "}
            <span className="text-gradient">
              isn't here.
            </span>
          </h1>
          <p className="mt-6 text-lg text-fg-muted md:text-xl leading-relaxed">
            Wrong link, deleted page, or something we never built. Either way,
            here's the way back.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-4 text-sm font-semibold text-white shadow-[0_4px_20px_rgb(255_0_188/0.3)] transition-all duration-300 hover:bg-accent-soft hover:shadow-[0_8px_40px_rgb(255_0_188/0.5)]"
            >
              <ArrowLeft
                size={14}
                aria-hidden
                className="transition-transform duration-500 group-hover:-translate-x-1"
              />
              Back to home
            </Link>
            <Link
              href="/services"
              className="group inline-flex items-center gap-2 rounded-full border border-line-strong px-7 py-4 text-sm font-semibold text-fg transition-colors duration-300 hover:bg-white/5 hover:border-accent"
            >
              See the services
              <ArrowUpRight
                size={14}
                aria-hidden
                className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
