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
    <section className="border-b border-line bg-surface-0 pt-20 md:pt-24">
      <div className="container-shell grid lg:min-h-[calc(100svh-5rem)] lg:grid-cols-12">
        <div className="flex flex-col justify-between border-line py-14 lg:col-span-7 lg:border-r lg:py-20 lg:pr-16 xl:pr-24">
          <div>
            <p className="mb-8 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Creative consultancy + North East network
            </p>
            <h1 className="max-w-[12ch] text-[clamp(3.4rem,7.4vw,7.2rem)] font-semibold leading-[0.86] tracking-[-0.065em] text-fg">
              Helping people find their people and get their work{" "}
              <span className="text-accent">seen</span>
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-[1.45] text-fg-muted md:text-xl">
              NAMI brings marketing services and a growing North East creative
              network together, helping businesses build stronger brands, find
              the right creative people and turn good work into real opportunities.
            </p>
          </div>

          <div className="mt-12 flex flex-wrap gap-3 lg:mt-16">
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
              className="group inline-flex items-center gap-2 rounded-md border border-line-strong px-6 py-3.5 text-sm font-semibold text-fg transition-colors hover:border-accent hover:text-accent"
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

        <div className="relative min-h-[34rem] overflow-hidden border-x border-line lg:col-span-5 lg:border-l-0 lg:border-r-0">
          <Image
            src="/assets/videos/wave-3-poster.jpg"
            alt="Abstract black sculptural waves"
            fill
            priority
            sizes="(min-width: 1024px) 42vw, 100vw"
            className="object-cover"
          />
          <div aria-hidden className="absolute inset-0 bg-black/20" />

          <div className="absolute inset-x-0 top-0 flex items-center justify-between border-b border-white/15 bg-black/35 px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/75 md:px-7">
            <span>NAMI Creative</span>
            <span>Newcastle upon Tyne</span>
          </div>

          <div className="absolute inset-x-0 bottom-0 border-t border-white/15 bg-black/80 p-6 pb-8 backdrop-blur-sm md:p-8">
            <p className="mb-5 max-w-sm text-xl font-medium leading-tight text-white md:text-2xl">
              Good work deserves the right audience
            </p>
            <AnimatedMemberTooltip
              items={tooltipMembers}
              memberCount={memberCount}
              context="contact"
              align="left"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
