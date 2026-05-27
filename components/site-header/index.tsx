"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { motion, useScroll, useSpring } from "motion/react";
import { Logo } from "./logo";
import { MobileDrawer } from "./mobile-drawer";
import { Magnetic } from "@/components/motion/magnetic";
import { primaryNav, ctaNav } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  // Gate pathname-driven active state behind mount so the server and first
  // client render are identical (no active link). Prevents a hydration
  // mismatch in this shared layout nav; the active underline animates in
  // a frame after hydration.
  const [mounted, setMounted] = useState(false);

  // Page scroll progress → the hairline under the bar grows left to right.
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });

  useEffect(() => setMounted(true), []);

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
          ? "border-b border-line bg-surface-0/70 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="container-shell flex h-16 items-center justify-between md:h-20">
        <Magnetic strength={0.2} field={18}>
          <Logo />
        </Magnetic>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-1 lg:flex"
        >
          {primaryNav.map((item) => {
            const active =
              mounted &&
              (pathname === item.href ||
                (item.href !== "/" && pathname?.startsWith(item.href)));
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group/navitem relative px-4 py-2 text-sm font-medium transition-colors duration-300",
                  active
                    ? "text-fg"
                    : "text-fg-muted hover:text-fg",
                )}
              >
                {item.label}
                {/* Hover hairline — grows from centre on non-active items */}
                {!active && (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-4 -bottom-0.5 h-px origin-center scale-x-0 bg-line-strong transition-transform duration-300 ease-out-expo group-hover/navitem:scale-x-100"
                  />
                )}
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    aria-hidden
                    className="absolute inset-x-3 -bottom-0.5 h-px bg-accent shadow-[0_0_10px_rgb(255_0_188/0.7)]"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Magnetic strength={0.3} field={22} className="hidden md:inline-flex">
            <Link
              href={ctaNav.href}
              className="group/cta relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgb(255_0_188/0.25)] transition-shadow duration-500 hover:shadow-[0_10px_36px_rgb(255_0_188/0.5)]"
            >
              <span className="absolute inset-0 -z-10 translate-y-full bg-accent-soft transition-transform duration-500 ease-out-expo group-hover/cta:translate-y-0" />
              {ctaNav.label}
              <ArrowUpRight
                size={16}
                aria-hidden
                className="transition-transform duration-500 ease-out-expo group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5"
              />
            </Link>
          </Magnetic>
          <MobileDrawer />
        </div>
      </div>

      {/* Scroll-progress hairline */}
      <motion.div
        aria-hidden
        style={{ scaleX: progress }}
        className="absolute inset-x-0 bottom-0 h-px origin-left bg-linear-to-r from-accent via-accent-soft to-accent-2"
      />
    </header>
  );
}
