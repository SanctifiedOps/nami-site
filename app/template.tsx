import { type ReactNode } from "react";

/** Pages render immediately. Motion is reserved for purposeful local interactions. */
export default function Template({ children }: { children: ReactNode }) {
  return children;
}
