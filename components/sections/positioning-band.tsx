export function PositioningBand() {
  return (
    <section className="border-b border-line bg-surface-1">
      <div className="container-shell grid lg:grid-cols-12">
        <p className="border-line py-12 text-xs font-semibold uppercase tracking-[0.18em] text-accent lg:col-span-3 lg:border-r lg:py-16 lg:pr-10">
          One connected practice
        </p>
        <div className="py-12 lg:col-span-9 lg:py-16 lg:pl-16">
          <p className="max-w-4xl text-[clamp(1.65rem,3vw,3rem)] font-medium leading-[1.08] tracking-[-0.035em] text-fg">
            Clear marketing helps businesses explain what they do. The Network
            helps North East creatives get found, supported and hired.
          </p>
          <p className="mt-6 max-w-2xl text-base leading-[1.5] text-fg-muted md:text-lg">
            Both sides are built around the same idea: good work should be
            easier to understand and easier to discover.
          </p>
        </div>
      </div>
    </section>
  );
}
