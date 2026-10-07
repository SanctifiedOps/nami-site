import type { ReactNode } from "react";

export function NetworkAccountShell({ title, description, children, footer }: {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <section className="relative isolate min-h-screen overflow-hidden border-b border-line pt-20">
      <div aria-hidden className="absolute inset-0 -z-20 bg-[url('/images/north-east/1.jpg')] bg-cover bg-[58%_center] grayscale" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-black/72" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(4,4,6,.88),rgba(4,4,6,.58),rgba(4,4,6,.82))]" />

      <div className="container-shell flex min-h-[calc(100svh-5rem)] items-center justify-center py-10 md:py-16">
        <div className="w-full max-w-2xl border border-white/15 bg-surface-0/90 p-6 shadow-[0_28px_90px_rgba(0,0,0,.48)] backdrop-blur-md sm:p-9 md:p-12">
          <div className="mx-auto w-full max-w-xl">
            <div className="text-center">
              <a href="/network" className="text-sm font-semibold text-accent hover:text-white">NAMI Creative Network</a>
              <h1 className="mt-5 text-[clamp(3rem,7vw,5.5rem)] font-semibold leading-[0.92] tracking-[-0.055em]">{title}</h1>
              {description && <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-fg-muted md:text-lg">{description}</p>}
            </div>
            <div className="mt-8">{children}</div>
            {footer && <div className="mt-8 border-t border-line pt-6 text-center text-sm text-fg-muted">{footer}</div>}
          </div>
        </div>
      </div>
    </section>
  );
}
