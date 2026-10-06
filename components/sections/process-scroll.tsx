import { processSteps } from "@/lib/content/process";

type Props = {
  index?: string;
  title?: React.ReactNode;
  lead?: string;
};

const DEFAULT_TITLE = <>A clear route from problem to finished work</>;

export function ProcessScroll({
  title = DEFAULT_TITLE,
  lead = "We agree what needs attention, I do the work, and you always know what is happening next.",
}: Props = {}) {
  return (
    <div>
      <header className="grid gap-5 md:grid-cols-2 md:items-end">
        <h2 className="type-section-title max-w-2xl">{title}</h2>
        <p className="max-w-xl text-base leading-[1.5] text-white/72 md:justify-self-end md:text-lg">
          {lead}
        </p>
      </header>

      <ol className="mt-12 grid gap-px overflow-hidden rounded-sm border border-white/15 bg-white/15 md:grid-cols-2 xl:grid-cols-4">
        {processSteps.map((step) => (
          <li key={step.number} className="flex min-h-72 flex-col bg-black/55 p-6 backdrop-blur-sm md:p-8">
            <p className="text-sm font-medium text-accent">{step.duration}</p>
            <h3 className="mt-8 text-2xl font-semibold leading-tight tracking-[-0.025em] text-white">
              {step.title}
            </h3>
            <p className="mt-4 text-sm leading-[1.55] text-white/70 md:text-base">
              {step.summary}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
