"use client";

import {
  Children,
  Fragment,
  cloneElement,
  isValidElement,
  useMemo,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from "react";
import { useReducedMotion } from "motion/react";

type Props = {
  children: ReactNode;
  /** Average time between consecutively-revealed characters (seconds) */
  stagger?: number;
  /** Animation duration per character */
  duration?: number;
  /** Optional className applied to the wrapping span */
  className?: string;
};

/**
 * Reveals a title character-by-character with a deterministic pseudo-random
 * order so the effect feels random but renders identically on server and
 * client (no hydration drift). Preserves nested JSX (e.g. text-gradient
 * spans) and respects prefers-reduced-motion.
 *
 * Words are wrapped in .lr-word containers (display:inline-block,
 * white-space:nowrap) so titles never break mid-word. Whitespace passes
 * through as bare text so browser line-wrapping happens at word boundaries.
 *
 * Animation is CSS-driven via the `lr-char` class defined in globals.css.
 */
export function LetterReveal({
  children,
  stagger = 0.02,
  duration = 0.7,
  className,
}: Props) {
  const reduced = useReducedMotion();

  const total = useMemo(() => countChars(children), [children]);
  const delays = useMemo(
    () => computeDelays(total, stagger),
    [total, stagger],
  );

  if (reduced) {
    return <span className={className}>{children}</span>;
  }

  const cursor = { i: 0 };
  const animated = walk(children, cursor, delays, duration);
  return <span className={className}>{animated}</span>;
}

/* ------------------------------------------------------------------ helpers */

function countChars(node: ReactNode): number {
  // Counts only non-whitespace characters — whitespace renders as bare
  // text (no animated span) and shouldn't consume a delay slot.
  let n = 0;
  Children.forEach(node, (child) => {
    if (typeof child === "string" || typeof child === "number") {
      n += String(child).replace(/\s/g, "").length;
    } else if (isValidElement(child)) {
      const el = child as ReactElement<{ children?: ReactNode }>;
      n += countChars(el.props.children);
    }
  });
  return n;
}

/**
 * Returns delays[i] = the staggered delay for character index i, after
 * shuffling positions deterministically. Same input always produces the
 * same output — safe across SSR + client hydration.
 */
function computeDelays(n: number, stagger: number): number[] {
  const positions = Array.from({ length: n }, (_, i) => i);
  positions.sort((a, b) => hash(a) - hash(b));
  const delays = new Array<number>(n);
  positions.forEach((charIdx, pos) => {
    delays[charIdx] = pos * stagger;
  });
  return delays;
}

/** xorshift-flavoured deterministic hash — no Math.random anywhere */
function hash(i: number): number {
  let x = (i + 1) * 2654435761;
  x ^= x >>> 13;
  x = (x * 1597334677) >>> 0;
  x ^= x >>> 16;
  return x >>> 0;
}

function walk(
  node: ReactNode,
  cursor: { i: number },
  delays: number[],
  duration: number,
): ReactNode {
  if (typeof node === "string" || typeof node === "number") {
    const text = String(node);
    // Tokenise into words + whitespace. Words wrap in .lr-word (atomic,
    // no mid-word breaking). Whitespace passes through as bare text so
    // the browser can line-break at word boundaries.
    const tokens = text.split(/(\s+)/);
    const out: ReactNode[] = [];
    tokens.forEach((token, tokenIdx) => {
      if (!token) return;
      if (/^\s+$/.test(token)) {
        out.push(token);
        return;
      }
      const charSpans: ReactNode[] = [];
      for (let k = 0; k < token.length; k++) {
        const ch = token[k];
        const idx = cursor.i++;
        charSpans.push(
          <span
            key={`lr-${idx}`}
            className="lr-char"
            style={
              {
                "--lr-delay": `${delays[idx] ?? 0}s`,
                "--lr-duration": `${duration}s`,
              } as CSSProperties
            }
          >
            {ch}
          </span>,
        );
      }
      out.push(
        <span key={`lr-word-${tokenIdx}`} className="lr-word">
          {charSpans}
        </span>,
      );
    });
    return out;
  }

  if (Array.isArray(node)) {
    return node.map((child, idx) => (
      <Fragment key={`lr-frag-${idx}`}>
        {walk(child, cursor, delays, duration)}
      </Fragment>
    ));
  }

  if (isValidElement(node)) {
    const el = node as ReactElement<{ children?: ReactNode }>;
    return cloneElement(
      el,
      undefined,
      walk(el.props.children, cursor, delays, duration),
    );
  }

  return node;
}
