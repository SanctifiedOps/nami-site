"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, X } from "lucide-react";

type PortfolioImage = {
  src: string;
  alt: string;
  title?: string;
  description?: string;
  linkUrl?: string;
};

export function PortfolioGallery({ images, memberName }: { images: PortfolioImage[]; memberName: string }) {
  const [activeImage, setActiveImage] = useState<PortfolioImage | null>(null);

  useEffect(() => {
    if (!activeImage) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setActiveImage(null); };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", close);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", close); };
  }, [activeImage]);

  return <>
    <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
      {images.map((image, index) => (
        <figure key={`${image.src}-${index}`} className="group relative aspect-[3/5] overflow-hidden rounded-3xl border border-line bg-surface-0/65 shadow-[0_12px_40px_rgba(0,0,0,0.18)] transition-all duration-500 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_22px_60px_rgba(255,0,166,0.16)]">
          <button type="button" onClick={() => setActiveImage(image)} className="absolute inset-0 z-10" aria-label={`Open ${image.title || `work by ${memberName}`} in gallery`} />
          <img src={image.src} alt={image.alt || `Work by ${memberName}`} className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]" />
          <div className="pointer-events-none absolute inset-0 z-20 flex items-end bg-gradient-to-t from-black/95 via-black/30 to-transparent p-4 opacity-90 transition-opacity duration-400 sm:p-6 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
            <div className="translate-y-2 transition-transform duration-400 group-hover:translate-y-0 group-focus-within:translate-y-0">
              {image.title && <h3 className="text-base font-semibold text-white sm:text-xl">{image.title}</h3>}
              {image.description && <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-white/75 sm:text-sm">{image.description}</p>}
              {image.linkUrl && <a href={image.linkUrl} target="_blank" rel="noopener noreferrer" className="pointer-events-auto relative z-30 mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-accent sm:text-sm">Learn more <ArrowUpRight size={14} aria-hidden /></a>}
            </div>
          </div>
        </figure>
      ))}
      {Array.from({ length: Math.max(0, 4 - images.length) }, (_, index) => (
        <div key={`portfolio-placeholder-${index}`} className="relative grid aspect-[3/5] place-items-center overflow-hidden rounded-3xl border border-dashed border-accent/35 bg-surface-0/65 p-5 text-center md:p-8">
          <div aria-hidden className="hairline-grid absolute inset-0 opacity-20" />
          <div className="relative"><span className="mx-auto grid size-12 place-items-center rounded-full border border-accent/30 bg-accent/10 text-2xl text-accent">+</span><p className="mt-4 font-semibold text-fg">Portfolio image</p><p className="mt-2 text-sm text-fg-subtle">Portfolio image coming soon</p></div>
        </div>
      ))}
    </div>

    {activeImage && <div role="dialog" aria-modal="true" aria-label={activeImage.title || `Work by ${memberName}`} className="fixed inset-0 z-[120] grid place-items-center overflow-y-auto bg-black/90 p-4 backdrop-blur-md" onMouseDown={(event) => { if (event.target === event.currentTarget) setActiveImage(null); }}>
      <div className="relative grid max-h-[92vh] w-full max-w-6xl overflow-hidden rounded-3xl border border-white/15 bg-[#0d0d10] shadow-[0_35px_120px_rgba(0,0,0,0.8)] lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.65fr)]">
        <button type="button" onClick={() => setActiveImage(null)} className="absolute right-4 top-4 z-20 grid size-11 place-items-center rounded-full bg-black/75 text-white transition-colors hover:bg-accent" aria-label="Close gallery"><X size={21} /></button>
        <div className="grid min-h-0 place-items-center bg-black"><img src={activeImage.src} alt={activeImage.alt || `Work by ${memberName}`} className="max-h-[72vh] w-full object-contain lg:max-h-[92vh]" /></div>
        <div className="overflow-y-auto p-6 sm:p-9 lg:self-end lg:p-10"><p className="mono-label text-accent">Work by {memberName}</p>{activeImage.title && <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">{activeImage.title}</h2>}{activeImage.description && <p className="mt-5 whitespace-pre-line leading-relaxed text-fg-muted">{activeImage.description}</p>}{activeImage.linkUrl && <a href={activeImage.linkUrl} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-accent-soft">Learn more <ArrowUpRight size={15} aria-hidden /></a>}</div>
      </div>
    </div>}
  </>;
}
