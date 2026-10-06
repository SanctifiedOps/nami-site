"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Logo } from "./logo";
import { MobileDrawer } from "./mobile-drawer";
import { networkCtaNav, primaryNav } from "@/lib/nav";
import { cn } from "@/lib/utils";

export type HeaderMember = {
  displayName: string;
  profileImageUrl: string;
};

function memberInitials(name: string) {
  const words = name.split("/")[0]?.trim().split(/\s+/).filter(Boolean) ?? [];
  if (!words.length) return "NC";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words.at(-1)?.[0] ?? ""}`.toUpperCase();
}

function mediaUrl(key: string) {
  return key ? `/api/network/media/${key.split("/").map(encodeURIComponent).join("/")}` : "";
}

function matchesPath(pathname: string, href: string) {
  return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
}

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [member, setMember] = useState<HeaderMember | null>(null);
  // Gate pathname-driven active state behind mount so the server and first
  // client render are identical (no active link). Prevents a hydration
  // mismatch in this shared layout nav; the active underline animates in
  // a frame after hydration.
  const [mounted, setMounted] = useState(false);

  // Page scroll progress → the hairline under the bar grows left to right.
  useEffect(() => setMounted(true), []);

  const loadMember = useCallback(async () => {
    try {
      const response = await fetch("/api/network/member-profile", { cache: "no-store" });
      if (!response.ok) {
        setMember(null);
        return;
      }
      const result = await response.json() as { profile?: { displayName?: string; profileImageKey?: string | null } };
      if (!result.profile?.displayName) {
        setMember(null);
        return;
      }
      setMember({
        displayName: result.profile.displayName,
        profileImageUrl: mediaUrl(result.profile.profileImageKey ?? ""),
      });
    } catch {
      setMember(null);
    }
  }, []);

  useEffect(() => { void loadMember(); }, [loadMember, pathname]);

  useEffect(() => {
    const refreshMember = () => { void loadMember(); };
    window.addEventListener("nami-member-profile-updated", refreshMember);
    return () => window.removeEventListener("nami-member-profile-updated", refreshMember);
  }, [loadMember]);

  useEffect(() => setOpenMenu(null), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-200",
        scrolled
          ? "border-line bg-surface-0/95"
          : "border-transparent bg-surface-0/80",
      )}
    >
      <div className="container-shell relative z-20 flex h-16 items-center justify-between md:h-20">
        <Logo />

        <nav
          aria-label="Primary"
          className="hidden items-center gap-1 lg:flex"
        >
          {primaryNav.map((item) => {
            const active =
              mounted &&
              (matchesPath(pathname, item.href) ||
                item.children?.some((child) => matchesPath(pathname, child.href)));
            if (item.children) {
              return (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => setOpenMenu(item.href)}
                  onMouseLeave={() => setOpenMenu(null)}
                  onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget)) {
                      setOpenMenu(null);
                    }
                  }}
                >
                  <button
                    type="button"
                    aria-haspopup="true"
                    aria-expanded={openMenu === item.href}
                    onClick={() =>
                      setOpenMenu((current) =>
                        current === item.href ? null : item.href,
                      )
                    }
                    onFocus={() => setOpenMenu(item.href)}
                    className={cn(
                      "relative flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors duration-300",
                      active || openMenu === item.href
                        ? "text-fg"
                        : "text-fg-muted hover:text-fg",
                    )}
                  >
                    {item.label}
                    <ChevronDown
                      size={14}
                      aria-hidden
                      className={cn(
                        "transition-transform duration-300",
                        openMenu === item.href && "rotate-180",
                      )}
                    />
                    {active && (
                      <motion.span
                        layoutId="nav-active"
                        aria-hidden
                        className="absolute inset-x-3 -bottom-0.5 h-px bg-accent"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                  </button>
                  <AnimatePresence>
                    {openMenu === item.href && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute left-1/2 top-full z-30 w-72 -translate-x-1/2 border border-line bg-surface-0 p-2 shadow-lg"
                      >
                        {item.children.map((child) =>
                          child.children ? (
                            <div key={child.href} className="group/submenu relative border-b border-line last:border-b-0">
                              <button
                                type="button"
                                aria-haspopup="true"
                                className="flex w-full items-center justify-between px-4 py-3 text-left text-sm text-fg-muted transition-colors group-hover/submenu:bg-white/5 group-hover/submenu:text-fg group-focus-within/submenu:bg-white/5 group-focus-within/submenu:text-fg"
                              >
                                {child.label}
                                <ChevronDown size={14} aria-hidden className="-rotate-90 opacity-50" />
                              </button>
                              <div className="invisible absolute left-full top-0 w-64 translate-x-1 border border-line bg-surface-0 p-2 opacity-0 shadow-lg transition-all duration-150 group-hover/submenu:visible group-hover/submenu:translate-x-0 group-hover/submenu:opacity-100 group-focus-within/submenu:visible group-focus-within/submenu:translate-x-0 group-focus-within/submenu:opacity-100">
                                {child.children.map((service) => (
                                  <Link
                                    key={service.href}
                                    href={service.href}
                                    onClick={() => setOpenMenu(null)}
                                    className="flex items-center justify-between border-b border-line px-4 py-3 text-sm text-fg-muted transition-colors last:border-b-0 hover:bg-white/5 hover:text-fg"
                                  >
                                    {service.label}
                                    <ArrowUpRight size={14} aria-hidden className="opacity-50" />
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={() => setOpenMenu(null)}
                              className="flex items-center justify-between border-b border-line px-4 py-3 text-sm text-fg-muted transition-colors last:border-b-0 hover:bg-white/5 hover:text-fg"
                            >
                              {child.label}
                              <ArrowUpRight size={14} aria-hidden className="opacity-50" />
                            </Link>
                          ),
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }
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
                {/* Hover hairline â€” grows from centre on non-active items */}
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
                    className="absolute inset-x-3 -bottom-0.5 h-px bg-accent"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href={networkCtaNav.href}
            className="group hidden items-center gap-2 rounded-md bg-accent px-5 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-accent-soft lg:inline-flex"
          >
            {networkCtaNav.label}
            <ArrowUpRight
              size={14}
              aria-hidden
              className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
          {member && (
            <Link
              href="/network/dashboard"
              aria-label={`Open member dashboard for ${member.displayName}`}
              className="group/member inline-flex items-center gap-2 rounded-md border border-line-strong bg-surface-1 p-1.5 text-sm font-semibold text-fg transition-colors hover:border-accent xl:pr-3"
            >
              <span className="relative grid size-8 shrink-0 place-items-center overflow-hidden rounded-full bg-accent/15 text-[0.7rem] font-bold text-accent">
                {member.profileImageUrl ? (
                  <Image src={member.profileImageUrl} alt="" fill unoptimized sizes="32px" className="object-cover" />
                ) : (
                  <span aria-hidden>{memberInitials(member.displayName)}</span>
                )}
              </span>
              <span className="hidden xl:inline">My dashboard</span>
            </Link>
          )}
          <MobileDrawer member={member} />
        </div>
      </div>

      {/* Scroll-progress hairline */}
    </header>
  );
}
