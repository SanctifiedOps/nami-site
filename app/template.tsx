import { type ReactNode } from "react";

/** Keep route changes immediate. Individual sections handle their own motion. */
export default function Template({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
