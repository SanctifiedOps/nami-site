import Image from "next/image";
import Link from "next/link";
import {
  LinkedinIcon,
  InstagramIcon,
  YoutubeIcon,
  FacebookIcon,
} from "@/components/icons/socials";
import { footerNav } from "@/lib/nav";
import { FooterCta } from "./footer-cta";

const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/98101073", icon: LinkedinIcon },
  { label: "Instagram", href: "https://www.instagram.com/namicreativeuk/", icon: InstagramIcon },
  { label: "YouTube", href: "https://www.youtube.com/@namiupcreative", icon: YoutubeIcon },
  { label: "Facebook", href: "https://facebook.com/namicreativeuk", icon: FacebookIcon },
];

export function SiteFooter() {
  return (
    <footer className="relative border-t border-line bg-linear-to-b from-surface-0 to-surface-1">
      <FooterCta />

      {/* Sitemap */}
      <div className="container-shell py-10 md:py-20">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-[1.4fr_repeat(3,1fr)] md:gap-12">
          <div className="col-span-2 space-y-4 md:col-span-1">
            <Link href="/" aria-label="NAMI Creative · home" className="inline-flex -ml-2 items-center transition-opacity duration-300 hover:opacity-80">
              <Image
                src="/Nami-Logo.png"
                alt="NAMI Creative"
                width={200}
                height={40}
                className="h-8 w-auto md:h-9"
              />
            </Link>
            <p className="max-w-xs text-sm text-fg-muted leading-relaxed">
              Brand, websites, content, and automation for businesses that want the
              marketing side handled properly.
            </p>
            <p className="max-w-xs text-xs uppercase tracking-[0.32em] text-fg-subtle pt-1">
              Done properly, up North.
            </p>
            <ul className="flex items-center gap-2.5 pt-2 md:gap-3 md:pt-4">
              {socials.map((s) => {
                const Icon = s.icon;
                return (
                  <li key={s.href}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`NAMI Creative on ${s.label}`}
                      className="inline-grid size-10 place-items-center rounded-full border border-line text-fg-muted transition-colors hover:border-accent hover:text-accent md:size-11"
                    >
                      <Icon size={16} aria-hidden />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {footerNav.map((column, index) => (
            <nav
              key={column.title}
              aria-label={column.title}
              className={`space-y-3 md:space-y-4 ${index === footerNav.length - 1 ? "col-span-2 md:col-span-1" : ""}`}
            >
              <p className="eyebrow">{column.title}</p>
              <ul className={`${index === footerNav.length - 1 ? "grid grid-cols-2 gap-x-6 gap-y-2.5 md:block md:space-y-2.5" : "space-y-2.5"}`}>
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
        <div className="container-shell flex flex-col gap-3 py-5 md:flex-row md:items-center md:justify-between md:py-6">
          <p className="text-xs text-fg-subtle">
            © {new Date().getFullYear()} NAMI Creative. Built from Newcastle upon Tyne. Working globally.
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
