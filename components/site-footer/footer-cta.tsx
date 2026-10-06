"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { Magnetic } from "@/components/motion/magnetic";
import {
  AnimatedMemberTooltip,
  type TooltipMember,
} from "@/components/ui/animated-member-tooltip";
import { ctaNav } from "@/lib/nav";
import { stage, fadeUp } from "@/lib/motion";

/**
 * Cinematic closing moment. Instrument grid + an accent light bloom behind a
 * centred statement and a magnetic CTA: the last thing a visitor sees before
 * the sitemap.
 */
export function FooterCta() {
  const pathname = usePathname();
  const isNetworkPage = pathname.startsWith("/network");
  const [networkTooltip, setNetworkTooltip] = useState<{
    items: TooltipMember[];
    memberCount: number;
  } | null>(null);

  useEffect(() => {
    if (!isNetworkPage || networkTooltip) return;
    const controller = new AbortController();
    fetch("/api/network/tooltip", { signal: controller.signal })
      .then((response) =>
        response.ok
          ? (response.json() as Promise<{
              items: TooltipMember[];
              memberCount: number;
            }>)
          : null,
      )
      .then((payload) => {
        if (
          Array.isArray(payload?.items) &&
          payload.items.length > 0 &&
          typeof payload.memberCount === "number"
        ) {
          setNetworkTooltip(payload);
        }
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, [isNetworkPage, networkTooltip]);

  return (
    <section className="relative overflow-hidden border-b border-line">
      <div aria-hidden className="hairline-grid absolute inset-0 opacity-40" />
      <div
        aria-hidden
        className="absolute -bottom-40 left-1/2 h-80 w-[72rem] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgb(255_0_188/0.16),transparent_70%)] blur-3xl"
      />
      <motion.div
        className="container-shell relative py-16 text-center md:py-20"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={stage}
      >
        <motion.div variants={fadeUp}>
          {isNetworkPage && networkTooltip ? (
            <AnimatedMemberTooltip
              items={networkTooltip.items}
              memberCount={networkTooltip.memberCount}
              context="join"
            />
          ) : (
            <p className="mono-label">
              {isNetworkPage ? "NAMI Creative Network" : "Build with me"}
            </p>
          )}
        </motion.div>
        <motion.h2
          className="type-section-title mx-auto mt-6 max-w-4xl"
          variants={fadeUp}
        >
          {isNetworkPage ? "Making something" : "Need the marketing side"}{" "}
          <span className="text-gradient sm:block">
            {isNetworkPage ? "up here?" : "properly sorted?"}
          </span>
        </motion.h2>
        <motion.p
          className="type-lead mx-auto mt-8 max-w-xl"
          variants={fadeUp}
        >
          {isNetworkPage
            ? "Put your name in the Network so more people can find the work you’re building."
            : "I can help with the brand, website, content, and automation, so the business looks right and you can get back to the graft."}
        </motion.p>
        <motion.div className="mt-12 flex justify-center" variants={fadeUp}>
          <Magnetic>
            <Link
              href={isNetworkPage ? "/network" : ctaNav.href}
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-accent px-9 py-4 text-sm font-semibold text-white shadow-[0_4px_20px_rgb(255_0_188/0.3)] transition-shadow duration-500 hover:shadow-[0_8px_40px_rgb(255_0_188/0.55)]"
            >
              <span className="absolute inset-0 -z-10 translate-y-full bg-accent-soft transition-transform duration-500 ease-out-expo group-hover:translate-y-0" />
              {isNetworkPage ? "Join the network" : "Work with me"}
              <ArrowUpRight
                size={16}
                aria-hidden
                className="transition-transform duration-500 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </Magnetic>
        </motion.div>
      </motion.div>
    </section>
  );
}
