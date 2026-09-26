import { type ReactNode } from "react";
import { RouteTransition } from "@/components/motion/route-transition";

/** Shared route entrance. Individual sections add their own scroll reveals. */
export default function Template({ children }: { children: ReactNode }) {
  return <RouteTransition>{children}</RouteTransition>;
}
