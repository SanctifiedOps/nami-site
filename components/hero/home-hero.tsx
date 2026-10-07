import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import {
  AnimatedMemberTooltip,
  type TooltipMember,
} from "@/components/ui/animated-member-tooltip";

export function HomeHero({
  memberCount,
  tooltipMembers,
}: {
  memberCount: number;
  tooltipMembers: TooltipMember[];
}) {
  return (
    <section className="relative isolate flex min-h-[calc(100svh-5rem)] items-center overflow-hidden border-b border-line pt-20 md:items-end">
      <Image
        src="/images/north-east/1.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-[58%_center] grayscale"
      />
      <div aria-hidden className="absolute inset-0 bg-black/65" />
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,7,.94)_0%,rgba(5,5,7,.76)_46%,rgba(5,5,7,.38)_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-48 bg-linear-to-b from-transparent to-surface-0/80"
      />

      <div className="container-shell relative z-10 py-12 md:py-20 lg:py-24">
        <AnimatedMemberTooltip
          items={tooltipMembers}
          memberCount={memberCount}
          context="contact"
          align="left"
          className="mb-8"
        />

        <h1 className="max-w-none text-[clamp(2.7rem,10vw,3.35rem)] font-semibold leading-[1.04] tracking-[-0.035em] text-white md:max-w-[16ch] md:text-[clamp(3rem,6.4vw,6.2rem)] md:tracking-[-0.04em]">
          Helping people find their people and get their work{" "}
          <span className="text-accent">seen</span>
        </h1>

        <p className="mt-7 max-w-[54ch] text-lg leading-[1.5] text-white/82 md:text-xl">
          Brand, websites, content and automation sit alongside a growing North
          East network, helping good work reach the right people.
        </p>

        <div className="mt-9 flex flex-wrap gap-3">
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-accent-soft"
          >
            Work with me
            <ArrowUpRight
              size={15}
              aria-hidden
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
          <Link
            href="/network"
            className="group inline-flex items-center gap-2 rounded-md border border-white/35 bg-black/30 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:border-accent hover:text-accent"
          >
            Explore the network
            <ArrowRight
              size={15}
              aria-hidden
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
