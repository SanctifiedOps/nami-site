import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { ProcessScroll } from "@/components/sections/process-scroll";
import { SectionHeading } from "@/components/sections/section-heading";

export const metadata: Metadata = {
  title: "Process · Discovery, design, launch, partnership",
  description:
    "Four phases inside a NAMI engagement. Understand the job, build the brand, website, and content, launch cleanly, then keep improving the work.",
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
              ongoing momentum
            </span>
          </>
        }
        lead="Four phases: understand the job, build the work, launch it cleanly, then keep improving it once real people start using it."
      />

      <section className="container-shell py-24 md:py-32">
        <ProcessScroll
          index=""
          title={
            <>
              Four phases, from{" "}
              <span className="text-gradient sm:block">
                strategy to sustained
              </span>
            </>
          }
          lead="The thinking, the build, the launch, and the month-after-month work that shows whether the brand can hold outside the workshop."
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
                  then stay close
                </span>
              </>
            }
            lead="Launch is when the assumptions meet real traffic, real content deadlines, real leads, and real team habits. That is where the system either holds or shows us what to improve next."
            className="max-w-3xl"
          />
        </div>
      </section>
    </>
  );
}
