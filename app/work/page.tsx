import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { WorkGrid } from "@/components/sections/work-grid";

export const metadata: Metadata = {
  title: "Selected work",
  description:
    "Brand, content, and systems engagements: from on-chain signal infrastructure (MILLIONS) to UK members clubs (The League), community brands (Barking Puppy), and conversion funnels (VESSL).",
};

export default function WorkPage() {
  return (
    <>
      <PageHero
        eyebrow="Selected work"
        title={
          <>
            Brands and systems
            <br className="hidden sm:inline" />
            <span className="text-gradient">built to compound.</span>
          </>
        }
        lead="Four engagements where brand, product, and infrastructure shipped together. Community at scale, on-chain intelligence, members-only experiences, and high-conversion funnels."
      />

      <section className="container-shell py-24 md:py-32">
        <WorkGrid />

        <div className="mt-20 flex flex-col items-start gap-6 rounded-3xl border border-line bg-surface-1/40 p-10 md:mt-28 md:flex-row md:items-center md:justify-between md:p-16">
          <div className="max-w-xl">
            <p className="eyebrow mb-3">Want to be next?</p>
            <p className="text-2xl font-medium tracking-tight md:text-3xl">
              We take a small number of new engagements{" "}
              <span className="text-gradient">
                each quarter.
              </span>
            </p>
          </div>
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-4 text-sm font-semibold text-white shadow-[0_4px_20px_rgb(230_50_175/0.3)] transition-all duration-300 hover:bg-accent-soft hover:shadow-[0_8px_40px_rgb(230_50_175/0.5)]"
          >
            Open a conversation
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
