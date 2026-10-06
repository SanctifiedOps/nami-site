import { Check } from "lucide-react";
import { processSteps } from "@/lib/content/process";

type Props = {
  index?: string;
  title?: React.ReactNode;
  lead?: string;
};

const DEFAULT_TITLE = <>What happens when you work with me</>;

export function ProcessScroll({
  title = DEFAULT_TITLE,
  lead = "I work out what's causing the problem, agree what needs doing with you and get it sorted. You'll always know what's happening and what comes next.",
}: Props = {}) {
  return (
    <div className="grid gap-14 lg:grid-cols-12 lg:gap-0">
      <div className="lg:col-span-4 lg:pr-16">
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          How I work
        </p>
        <h2 className="type-section-title max-w-md">{title}</h2>
        <p className="mt-6 max-w-md text-lg leading-[1.5] text-fg-muted">
          {lead}
        </p>
      </div>

      <ol className="border-t border-line lg:col-span-8">
        {processSteps.map((step) => (
          <li
            key={step.number}
            className="grid gap-5 border-b border-line py-8 md:grid-cols-[4rem_1fr] md:gap-8 md:py-10"
          >
            <span className="text-sm font-semibold tabular-nums text-accent">
              {step.number}
            </span>
            <article>
              <div className="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-baseline">
                <h3 className="text-2xl font-medium tracking-tight md:text-3xl">
                  {step.title}
                </h3>
                <p className="text-xs uppercase tracking-[0.14em] text-fg-subtle">
                  {step.duration}
                </p>
              </div>
              <p className="mt-5 max-w-2xl leading-[1.5] text-fg-muted">
                {step.summary}
              </p>
              <ul className="mt-6 grid gap-x-8 gap-y-3 text-sm text-fg-muted sm:grid-cols-2">
                {step.detail.map((line) => (
                  <li key={line} className="flex items-start gap-2.5">
                    <Check
                      size={14}
                      aria-hidden
                      className="mt-1 shrink-0 text-accent"
                    />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </article>
          </li>
        ))}
      </ol>
    </div>
  );
}
