"use client";

import { useEffect, useRef } from "react";

type Props = {
  /** Video filename relative to /public/assets/videos/ (e.g. "wave-1.mp4") */
  src: string;
  /** Overlay darkening intensity (0–1). Higher = darker. Default 0.55. */
  overlay?: number;
  /**
   * Optional poster image filename in /public/assets/videos/. Defaults to
   * derived `<basename>-poster.jpg` (e.g. wave-3.mp4 -> wave-3-poster.jpg).
   */
  poster?: string;
};

/**
 * Looping autoplay video background. Muted + playsInline so iOS/Safari
 * respect autoplay. Stretched to fill its absolute parent. Heavy darken
 * overlay sits above so foreground type stays legible. Respects
 * prefers-reduced-motion: pauses video and shows a static gradient instead.
 */
export function VideoBackground({ src, overlay = 0.55, poster }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const posterSrc =
    poster ?? `/assets/videos/${src.replace(/\.mp4$/, "-poster.jpg")}`;

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) {
      video.pause();
      video.removeAttribute("autoplay");
    }
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      <video
        ref={ref}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster={posterSrc}
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src={`/assets/videos/${src}`} type="video/mp4" />
      </video>

      {/* Darken overlay — single layer, tunable */}
      <div
        className="absolute inset-0"
        style={{ background: `rgba(0,0,0,${overlay})` }}
      />

      {/* Bottom vignette to reinforce contrast under copy + CTAs */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, transparent 50%, rgb(0 0 0 / 0.35) 100%)",
        }}
      />

      {/* Brand accent wash — very low alpha so video reads through */}
      <div
        className="absolute inset-0 mix-blend-soft-light opacity-60"
        style={{
          background:
            "radial-gradient(ellipse at 30% 0%, rgb(230 50 175 / 0.35) 0%, transparent 60%), radial-gradient(ellipse at 80% 100%, rgb(100 200 255 / 0.25) 0%, transparent 65%)",
        }}
      />
    </div>
  );
}

/** Deterministic video pick: same path always returns same video. */
export function pickVideoForPath(pathname: string): string {
  const videos = ["wave-1.mp4", "wave-2.mp4", "wave-3.mp4"];
  let h = 0;
  for (let i = 0; i < pathname.length; i++) {
    h = ((h << 5) - h + pathname.charCodeAt(i)) | 0;
  }
  return videos[Math.abs(h) % videos.length];
}
