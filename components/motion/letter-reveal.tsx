import { type ReactNode } from "react";

type Props = {
  children: ReactNode;
  stagger?: number;
  duration?: number;
  className?: string;
};

/**
 * Preserves the heading API while rendering semantic, unsplit text. Parent
 * motion provides the entrance without creating an animated span per letter.
 */
export function LetterReveal({ children, className }: Props) {
  return <span className={className}>{children}</span>;
}
