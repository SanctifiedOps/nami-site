import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { WorkGrid } from "@/components/sections/work-grid";

export const metadata: Metadata = {
  title: "Selected work · Brand, content, and conversion case studies",
  description:
    "Six projects where the public face and the working parts line up. On-chain intelligence, UK members clubs, community brands, DTC conversion funnels, property, and a national trade body.",
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
        eyebrow="Selected work"
        title={
          <>
            Brands where the public face and{" "}
            <span className="text-gradient sm:block">
              working parts line up
            </span>
          </>
        }
        lead="Six projects across on-chain intelligence, UK members clubs, community brands, conversion funnels, property, and a national trade body. The common thread is simple: the public face and the working parts line up."
      />

      <section className="container-shell py-24 md:py-32">
        <WorkGrid />

        <div className="glass-refractive mt-20 flex flex-col items-start gap-6 rounded-3xl p-10 md:mt-28 md:flex-row md:items-center md:justify-between md:p-16">
          <div className="max-w-xl">
            <p className="mono-label mb-3">Want to be next?</p>
            <p className="text-2xl font-medium tracking-tight md:text-3xl">
              I keep the calendar narrow{" "}
              <span className="text-gradient">
                so the work gets the room it needs
              </span>
            </p>
          </div>
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-4 text-sm font-semibold text-white shadow-[0_4px_20px_rgb(255_0_188/0.3)] transition-all duration-300 hover:bg-accent-soft hover:shadow-[0_8px_40px_rgb(255_0_188/0.5)]"
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
