import type { ReactNode } from "react";

export function NetworkAccountShell({ title, description, children, footer }: {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <section className="min-h-screen border-b border-line pt-20">
      <div className="grid min-h-[calc(100vh-5rem)] lg:grid-cols-[minmax(22rem,0.82fr)_minmax(0,1.18fr)]">
        <div className="relative hidden min-h-full overflow-hidden border-r border-line lg:block">
          <div className="absolute inset-0 bg-[url('/assets/images/nami-office.webp')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/10" />
          <div className="absolute inset-x-0 bottom-0 p-10 xl:p-14">
            <p className="max-w-md text-3xl font-semibold leading-tight text-white xl:text-4xl">Your place to share the work, events and ideas being made across the North East.</p>
          </div>
        </div>
        <div className="flex items-center px-6 py-16 sm:px-10 lg:px-14 xl:px-20">
          <div className="w-full max-w-xl">
            <a href="/network" className="text-sm font-semibold text-accent hover:text-white">NAMI Creative Network</a>
            <h1 className="mt-5 text-[clamp(3rem,7vw,5.5rem)] font-semibold leading-[0.92] tracking-[-0.055em]">{title}</h1>
            {description && <p className="mt-6 max-w-lg text-base leading-relaxed text-fg-muted md:text-lg">{description}</p>}
            <div className="mt-8">{children}</div>
            {footer && <div className="mt-8 border-t border-line pt-6 text-sm text-fg-muted">{footer}</div>}
          </div>
        </div>
      </div>
    </section>
  );
}
