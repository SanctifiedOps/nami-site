"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import {
  AnimatedMemberTooltip,
  type TooltipMember,
} from "@/components/ui/animated-member-tooltip";
import { ctaNav } from "@/lib/nav";

/** Shared closing action. Content and hierarchy carry the section, not effects. */
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
    <section className="border-b border-line border-t-2 border-t-accent bg-surface-1">
      <div className="container-shell grid gap-9 py-14 md:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.65fr)] md:items-end md:py-20">
        <div>
          {isNetworkPage && networkTooltip ? (
            <AnimatedMemberTooltip
              items={networkTooltip.items}
              memberCount={networkTooltip.memberCount}
              context="join"
            />
          ) : (
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
              {isNetworkPage ? "NAMI Creative Network" : "Build with me"}
            </p>
          )}
          <h2 className="type-section-title mt-5 max-w-4xl">
            {isNetworkPage
              ? "Making something up here?"
              : "Need the marketing side properly sorted?"}
          </h2>
        </div>

        <div className="md:border-l md:border-line md:pl-8">
          <p className="type-body max-w-xl">
            {isNetworkPage
              ? "Put your name in the Network so more people can find the work you’re building."
              : "I can help with the brand, website, content and automation, so the business looks right and you can get back to the graft."}
          </p>
          <Link
            href={isNetworkPage ? "/network" : ctaNav.href}
            className="group mt-7 inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-accent-soft"
          >
            {isNetworkPage ? "Join the network" : "Work with me"}
            <ArrowUpRight
              size={16}
              aria-hidden
              className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
