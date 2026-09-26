"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/** Keeps full page navigation predictable without breaking intentional anchor links. */
export function NavigationEffects() {
  const pathname = usePathname();
  const previousPathname = useRef(pathname);

  useEffect(() => {
    if (previousPathname.current !== pathname && !window.location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }

    previousPathname.current = pathname;
  }, [pathname]);

  return null;
}
