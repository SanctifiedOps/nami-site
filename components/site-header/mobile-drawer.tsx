"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { primaryNav, ctaNav } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function MobileDrawer() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        className="lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-md border border-line bg-white/6 text-fg transition-colors hover:bg-white/10"
      >
        <Menu size={20} aria-hidden />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="drawer-root"
            className="fixed inset-0 z-60 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-surface-0/80 backdrop-blur-xl"
            />

            <motion.div
              className="absolute inset-x-0 top-0 bg-surface-1 border-b border-line shadow-[0_24px_60px_rgb(0_0_0/0.4)]"
              initial={{ y: -32, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -32, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="container-shell flex h-16 items-center justify-between md:h-20">
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  aria-label="NAMI Creative · home"
                  className="inline-flex items-center transition-opacity duration-300 hover:opacity-80"
                >
                  <Image
                    src="/Nami-Logo.png"
                    alt="NAMI Creative"
                    width={200}
                    height={40}
                    className="h-7 w-auto"
                  />
                </Link>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-line bg-white/6 text-fg transition-colors hover:bg-white/10"
                >
                  <X size={20} aria-hidden />
                </button>
              </div>

              <nav
                aria-label="Mobile primary"
                className="container-shell pb-10 pt-2"
              >
                <ul className="flex flex-col gap-1">
                  {primaryNav.map((item, i) => {
                    const active =
                      pathname === item.href ||
                      (item.href !== "/" && pathname?.startsWith(item.href));
                    return (
                      <motion.li
                        key={item.href}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: 0.05 + i * 0.04,
                          duration: 0.35,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                      >
                        <Link
                          href={item.href}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "flex items-center justify-between rounded-md px-4 py-4 text-2xl font-medium tracking-tight transition-colors",
                            active
                              ? "text-fg bg-white/4"
                              : "text-fg-muted hover:text-fg hover:bg-white/3",
                          )}
                        >
                          {item.label}
                          <ArrowUpRight
                            size={20}
                            aria-hidden
                            className="opacity-40"
                          />
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.05 + primaryNav.length * 0.04,
                    duration: 0.35,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="mt-6 border-t border-line pt-6"
                >
                  <Link
                    href={ctaNav.href}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-4 text-base font-semibold text-white shadow-[0_4px_16px_rgb(255_0_188/0.25)] transition-all hover:bg-accent-soft"
                  >
                    {ctaNav.label}
                    <ArrowUpRight size={18} aria-hidden />
                  </Link>
                </motion.div>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
