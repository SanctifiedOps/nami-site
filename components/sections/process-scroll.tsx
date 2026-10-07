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

      <ol className="mt-12 grid overflow-hidden rounded-sm border border-white/30 md:grid-cols-2 xl:grid-cols-4">
        {processSteps.map((step, index) => (
          <li
            key={step.number}
            className={`flex flex-col bg-black/70 p-5 backdrop-blur-sm md:min-h-64 md:p-8 xl:min-h-72 ${
              index > 0 ? "border-t border-white/25" : ""
            } ${index === 1 ? "md:border-l md:border-t-0" : ""} ${
              index === 2 ? "md:border-t md:border-l-0 xl:border-l xl:border-t-0" : ""
            } ${index === 3 ? "md:border-l md:border-t xl:border-t-0" : ""}`}
          >
            <h3 className="whitespace-nowrap text-xl font-semibold leading-tight tracking-[-0.025em] text-white 2xl:text-2xl">
              {step.title}
            </h3>
            <p className="mt-3 text-sm leading-[1.55] text-white/70 md:mt-4 md:text-base">
              {step.summary}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
