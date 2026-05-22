"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "./logo";
import { MobileDrawer } from "./mobile-drawer";
import { primaryNav, ctaNav } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-500",
        scrolled
          ? "bg-surface-0/80 backdrop-blur-xl border-b border-line"
          : "bg-transparent border-b border-transparent",
      )}
    >
      <div className="container-shell flex h-16 items-center justify-between md:h-20">
        <Logo />

        <nav
          aria-label="Primary"
          className="hidden lg:flex items-center gap-1"
        >
          {primaryNav.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/" && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium rounded-md transition-colors",
                  active
                    ? "text-fg bg-white/[0.06]"
                    : "text-fg-muted hover:text-fg hover:bg-white/[0.04]",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href={ctaNav.href}
            className="hidden md:inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgb(255_0_188/0.25)] transition-all duration-300 hover:bg-accent-soft hover:shadow-[0_8px_32px_rgb(255_0_188/0.4)] hover:-translate-y-px"
          >
            {ctaNav.label}
            <ArrowUpRight size={16} aria-hidden />
          </Link>
          <MobileDrawer />
        </div>
      </div>
    </header>
  );
}
