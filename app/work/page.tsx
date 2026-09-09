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

        <div className="glass-refractive mt-20 flex flex-col items-start gap-6 rounded-3xl p-10 md:mt-28 md:flex-row md:items-center md:justify-between md:p-16">
          <div className="max-w-xl">
            <p className="mono-label mb-3">Work with me</p>
            <p className="text-2xl font-medium tracking-tight md:text-3xl">
              Got something{" "}
              <span className="text-gradient">
                that needs sorting?
              </span>
            </p>
            <p className="mt-4 max-w-lg leading-relaxed text-fg-muted">
              Tell me what is getting in the way. I will tell you whether I can help.
            </p>
          </div>
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-4 text-sm font-semibold text-white shadow-[0_4px_20px_rgb(255_0_188/0.3)] transition-all duration-300 hover:bg-accent-soft hover:shadow-[0_8px_40px_rgb(255_0_188/0.5)]"
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


