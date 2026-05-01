import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { footerNav, ctaNav } from "@/lib/nav";

export function SiteFooter() {
  return (
    <footer className="relative mt-32 border-t border-line bg-linear-to-b from-surface-0 to-surface-1">
      {/* CTA strip */}
      <section className="container-shell border-b border-line py-20 md:py-28">
        <div className="grid gap-10 md:grid-cols-[2fr_1fr] md:items-end">
          <div className="space-y-4">
            <p className="eyebrow">Build with us</p>
            <h2 className="text-4xl md:text-6xl font-semibold tracking-tight">
              Ready to build something <br className="hidden md:block" />
              <span className="text-gradient">that lasts?</span>
            </h2>
            <p className="max-w-xl text-fg-muted">
              Brand, content, and systems — wired into one cohesive structure
              that holds while you scale.
            </p>
          </div>
          <div className="flex md:justify-end">
            <Link
              href={ctaNav.href}
              className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-4 text-sm font-semibold text-white shadow-[0_4px_16px_rgb(230_50_175/0.25)] transition-all duration-300 hover:bg-accent-soft hover:shadow-[0_8px_32px_rgb(230_50_175/0.4)] hover:-translate-y-px"
            >
              Start a project
              <ArrowUpRight size={16} aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* Sitemap */}
      <div className="container-shell py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="space-y-4">
            <span className="font-semibold tracking-tight text-xl text-fg">
              NAMI<span className="text-accent">.</span> Creative
            </span>
            <p className="max-w-xs text-sm text-fg-muted leading-relaxed">
              A creative marketing studio building brand identity, content
              systems, and growth infrastructure.
            </p>
          </div>

          {footerNav.map((column) => (
            <nav
              key={column.title}
              aria-label={column.title}
              className="space-y-4"
            >
              <p className="eyebrow">{column.title}</p>
              <ul className="space-y-2.5">
                {column.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-fg-muted transition-colors hover:text-accent"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      {/* Bottom row */}
      <div className="border-t border-line">
        <div className="container-shell flex flex-col gap-3 py-6 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-fg-subtle">
            © {new Date().getFullYear()} NAMI Creative. All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-fg-subtle">
            <li>
              <Link
                href="/privacy"
                className="hover:text-fg-muted transition-colors"
              >
                Privacy
              </Link>
            </li>
            <li>
              <Link
                href="/terms"
                className="hover:text-fg-muted transition-colors"
              >
                Terms
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="hover:text-fg-muted transition-colors"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
