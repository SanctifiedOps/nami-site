"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

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
 * Hero background. The poster image is the base layer — optimised, preloaded,
 * and the LCP element, so it paints instantly on every device while the video
 * streams in over it. The video plays on mobile too; it is skipped only for
 * explicit user preferences (reduced motion, save-data) and very slow (2G)
 * links. The video pauses while the hero is offscreen.
 *
 * Rendering the video only after mount keeps SSR + first client render
 * identical (poster-only), so there's no hydration mismatch.
 */
export function VideoBackground({ src, overlay = 0.55, poster }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [videoSrc, setVideoSrc] = useState("");
  const posterSrc =
    poster ?? `/assets/videos/${src.replace(/\.mp4$/, "-poster.jpg")}`;

  useEffect(() => {
    // Play the video everywhere, including mobile. Skip it only for explicit
    // user preferences or a genuinely slow link; the poster keeps first paint
    // instant either way.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const conn = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    if (conn?.saveData) return;
    if (conn?.effectiveType && /(slow-2g|2g)/.test(conn.effectiveType)) return;
    // Phones get a lighter (~720px) encode; larger screens get the full file.
    const file =
      window.innerWidth < 768 ? src.replace(/\.mp4$/, "-mobile.mp4") : src;
    setVideoSrc(`/assets/videos/${file}`);
    setShowVideo(true);
  }, [src]);

  useEffect(() => {
    if (!showVideo) return;
    const video = ref.current;
    if (!video) return;
    // Pause while offscreen so the hero stops costing once scrolled past.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.01 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, [showVideo]);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {/* Poster base layer — optimised, preloaded, the LCP element */}
      <Image
        src={posterSrc}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {/* Video enhancement — capable clients only, fades in over the poster */}
      {showVideo && (
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
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}

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

      {/* Brand accent wash — very low alpha so the layers read through */}
      <div
        className="absolute inset-0 mix-blend-soft-light opacity-60"
        style={{
          background:
            "radial-gradient(ellipse at 30% 0%, rgb(255 0 188 / 0.35) 0%, transparent 60%), radial-gradient(ellipse at 80% 100%, rgb(100 200 255 / 0.25) 0%, transparent 65%)",
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
