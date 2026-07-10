import { commonStartingPoints } from "@/lib/content/pathways";

export function CommonStartingPoints() {
  return (
    <section className="container-shell py-24 md:py-32">
      <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
        <div className="max-w-xl">
          <h2 className="text-4xl font-semibold leading-[1.12] tracking-tight md:text-5xl">
            Where the work{" "}
            <span className="text-gradient sm:block">usually starts.</span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-fg-muted">
            The five pillars are the full system. Real projects usually begin
            where the pressure is loudest, then connect the surrounding pieces.
          </p>
        </div>

        <div className="grid gap-5">
          {commonStartingPoints.map((item) => (
            <article
              key={item.name}
              className="rounded-2xl border border-line bg-surface-1/55 p-7 md:p-8"
            >
              <h3 className="text-2xl font-medium tracking-tight text-fg">
                {item.name}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                <span className="font-medium text-fg">Best when:</span>{" "}
                {item.when}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-fg-subtle">
                <span className="font-medium text-fg-muted">Usually includes:</span>{" "}
                {item.includes}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
