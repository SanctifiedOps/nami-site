"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

type CursorState = "default" | "link" | "media" | "disabled";

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [state, setState] = useState<CursorState>("default");
  const cursorRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { damping: 32, stiffness: 700, mass: 0.25 });
  const sy = useSpring(y, { damping: 32, stiffness: 700, mass: 0.25 });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;

    if (isTouch || reduced) {
      setEnabled(false);
      return;
    }

    setEnabled(true);
    document.documentElement.dataset.cursor = "custom";

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };

    const onOver = (e: PointerEvent) => {
      const t = e.target;
      if (!(t instanceof HTMLElement)) return;
      const interactive = t.closest(
        "a, button, [role='button'], input, select, textarea, [data-cursor='link']",
      );
      const media = t.closest("video, [data-cursor='media']");
      const disabled =
        t.closest("[aria-disabled='true'], [disabled]") &&
        !t.closest("[data-cursor='link']");
      if (disabled) setState("disabled");
      else if (media) setState("media");
      else if (interactive) setState("link");
      else setState("default");
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      delete document.documentElement.dataset.cursor;
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        ref={cursorRef}
        style={{ x, y }}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-100 -translate-x-1/2 -translate-y-1/2"
      >
        <motion.div
          animate={{
            scale: state === "link" ? 0 : state === "media" ? 1.4 : 1,
            opacity: state === "disabled" ? 0.3 : 1,
          }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="h-1.5 w-1.5 rounded-full bg-accent"
          style={{ mixBlendMode: "difference" }}
        />
      </motion.div>
      <motion.div
        style={{ x: sx, y: sy }}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-100 -translate-x-1/2 -translate-y-1/2"
      >
        <motion.div
          animate={{
            width: state === "link" ? 48 : state === "media" ? 64 : 28,
            height: state === "link" ? 48 : state === "media" ? 64 : 28,
            opacity: state === "disabled" ? 0.2 : 1,
          }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-full border border-accent"
          style={{ mixBlendMode: "difference" }}
        />
      </motion.div>
    </>
  );
}
