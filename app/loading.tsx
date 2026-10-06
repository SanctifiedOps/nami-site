export default function Loading() {
  return (
    <div
      className="container-shell min-h-[70svh] pt-32 pb-20 md:pt-40"
      role="status"
      aria-live="polite"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
        Loading
      </p>
      <div className="mt-7 max-w-4xl border-t border-line pt-8">
        <div className="h-12 w-4/5 bg-surface-2 md:h-16" />
        <div className="mt-4 h-12 w-3/5 bg-surface-2 md:h-16" />
        <div className="mt-8 h-4 w-full max-w-2xl bg-surface-2" />
        <div className="mt-3 h-4 w-4/5 max-w-xl bg-surface-2" />
      </div>
      <span className="sr-only">The page is loading.</span>
    </div>
  );
}
