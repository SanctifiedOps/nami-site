import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { ProcessScroll } from "@/components/sections/process-scroll";
import { SectionHeading } from "@/components/sections/section-heading";

export const metadata: Metadata = {
  title: "Process · Discovery, design, launch, partnership",
  description:
    "Four phases inside a NAMI engagement. Strategic discovery and positioning. Design and build of brand, content, and website. Launch and integration. Ongoing partnership for content, automation, and creative direction.",
  keywords: [
    "creative agency process",
    "brand engagement process",
    "design and build process UK",
    "founder brand engagement",
  ],
};

export default function ProcessPage() {
  return (
    <>
      <PageHero
        eyebrow="Process"
        title={
          <>
            From discovery to{" "}
            <span className="text-gradient sm:block">
              ongoing momentum.
            </span>
          </>
        }
        lead="Four phases: strategic, applied, shipped, sustained. Tight enough to launch in eight weeks, deep enough to keep working two years on."
      />

      <section className="container-shell py-24 md:py-32">
        <ProcessScroll
          index=""
          title={
            <>
              Four phases, from{" "}
              <span className="text-gradient sm:block">
                strategy to sustained.
              </span>
            </>
          }
          lead="The strategic thinking, the build, the launch, and the system that keeps running after we leave. Tight enough to ship in eight weeks, deep enough to keep working two years on."
        />
      </section>

      <section className="border-t border-line bg-surface-1/40 py-24 md:py-32">
        <div className="container-shell">
          <SectionHeading
            align="center"
            eyebrow="The principle"
            title={
              <>
                We launch fast,{" "}
                <span className="text-gradient sm:block">
                  then stay close.
                </span>
              </>
            }
            lead="Most agencies treat launch as the finish line. We treat it as the start. The brand only proves itself in the months after: when content has to ship, funnels have to convert, and the system has to keep working without us in the room every day."
            className="max-w-3xl"
          />
        </div>
      </section>
    </>
  );
}
