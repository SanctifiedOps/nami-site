import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { WorkGrid } from "@/components/sections/work-grid";

export const metadata: Metadata = {
  title: "Work | Newcastle Marketing, Websites & Creative Projects",
  description:
    "See how NAMI Creative has helped businesses improve their brand, website, content, enquiries and day-to-day systems.",
  keywords: [
    "creative partner case studies",
    "brand strategy case studies UK",
    "conversion funnel case studies",
    "independent brand work",
  ],
};

export default function WorkPage() {
  return (
    <>
      <PageHero
        backgroundImage="/images/north-east/7.jpg"
        backgroundPosition="center 48%"
        eyebrow="Selected work"
        title={
          <>
            Work that looks right{" "}
            <span className="text-gradient sm:block">
              and works properly
            </span>
          </>
        }
        lead="Each business came with something that was getting in the way. Here is what I helped them sort and what changed as a result."
      />

      <section className="container-shell py-24 md:py-32">
        <WorkGrid />

        <div className="mt-20 grid overflow-hidden border border-line bg-surface-1 md:mt-28 md:grid-cols-[1fr_auto]">
          <div className="max-w-xl">
            <div className="p-8 md:p-12">
            <p className="text-2xl font-semibold tracking-tight md:text-4xl">
              Got something that needs sorting?
            </p>
            <p className="mt-4 max-w-lg leading-relaxed text-fg-muted">
            Tell me what&apos;s getting in the way. I&apos;ll tell you whether I can help.
            </p>
            </div>
          </div>
          <Link
            href="/contact"
            className="group inline-flex min-h-28 items-center justify-center gap-2 bg-accent px-8 py-6 text-sm font-semibold text-white transition-colors hover:bg-accent-soft md:min-w-64"
          >
            Tell me about the job
            <ArrowUpRight
              size={16}
              aria-hidden
              className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>
      </section>
    </>
  );
}


