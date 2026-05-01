import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function Home() {
  return (
    <>
      {/* Hero placeholder — Phase 2 will build the WebGL gradient mesh + scroll-pinned services */}
      <section className="relative overflow-hidden pt-40 pb-24 md:pt-56 md:pb-40">
        {/* radial brand glows */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 20% 20%, rgb(230 50 175 / 0.12), transparent 60%), radial-gradient(ellipse 50% 40% at 80% 70%, rgb(100 200 255 / 0.08), transparent 60%)",
          }}
        />

        <div className="container-shell">
          <p className="eyebrow mb-6">NAMI Creative</p>

          <h1 className="max-w-5xl text-5xl font-semibold tracking-tight md:text-7xl lg:text-8xl">
            Creative systems built for{" "}
            <span className="text-gradient italic font-serif">
              real-world momentum.
            </span>
          </h1>

          <p className="mt-8 max-w-2xl text-lg text-fg-muted md:text-xl">
            Brand, content, and systems — wired into one cohesive structure
            that holds while you scale.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-4 text-sm font-semibold text-white shadow-[0_4px_16px_rgb(230_50_175/0.25)] transition-all duration-300 hover:bg-accent-soft hover:shadow-[0_8px_32px_rgb(230_50_175/0.4)] hover:-translate-y-px"
            >
              Start a project
              <ArrowUpRight size={16} aria-hidden />
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-full border border-line-strong px-7 py-4 text-sm font-semibold text-fg transition-colors duration-300 hover:bg-white/5 hover:border-accent"
            >
              Explore the work
            </Link>
          </div>
        </div>
      </section>

      {/* Phase 1 status band — replaced in Phase 2 with real content */}
      <section className="container-shell py-16 md:py-24">
        <div className="glass rounded-3xl p-8 md:p-12">
          <p className="eyebrow mb-4">Foundation</p>
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Phase 1 in place.
          </h2>
          <p className="mt-4 max-w-xl text-fg-muted">
            Tokens, typography, header, mobile drawer, footer, smooth scroll,
            and custom cursor are wired. Hero, services pillar, process, and
            forms land in Phase 2.
          </p>
        </div>
      </section>
    </>
  );
}
