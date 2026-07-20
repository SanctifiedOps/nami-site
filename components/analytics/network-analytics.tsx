"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/analytics";

function getNetworkPage(pathname: string) {
  if (pathname === "/network") return "network_landing";
  if (pathname === "/network/thank-you") return "network_thank_you";
  return null;
}

function cleanText(value: string | null) {
  return value?.replace(/\s+/g, " ").trim().slice(0, 120) || "unknown";
}

export function NetworkAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    const networkPage = getNetworkPage(pathname);
    if (!networkPage) return;
    const params = new URLSearchParams(window.location.search);

    const sharedParams = {
      page_path: pathname,
      network_page: networkPage,
      source_context: "nami_creative_network",
    };

    trackEvent("network_page_viewed", sharedParams);

    if (pathname === "/network") {
      trackEvent("network_landing_viewed", {
        ...sharedParams,
        utm_source: params.get("utm_source"),
        utm_medium: params.get("utm_medium"),
        utm_campaign: params.get("utm_campaign"),
        utm_content: params.get("utm_content"),
        utm_term: params.get("utm_term"),
      });
    }

    if (pathname === "/network/thank-you") {
      trackEvent("network_join_completed", {
        ...sharedParams,
        event_category: "conversion",
        conversion_type: "creative_network_join",
      });
    }
  }, [pathname]);

  useEffect(() => {
    const networkPage = getNetworkPage(pathname);
    if (!networkPage) return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const element = target.closest("a, button");
      if (!(element instanceof HTMLElement)) return;

      const href = element instanceof HTMLAnchorElement ? element.href : null;
      const rawHref = element instanceof HTMLAnchorElement ? element.getAttribute("href") : null;
      const buttonType = element instanceof HTMLButtonElement ? element.type : null;

      trackEvent("network_cta_clicked", {
        page_path: pathname,
        network_page: networkPage,
        source_context: "nami_creative_network",
        cta_text: cleanText(element.textContent),
        cta_href: rawHref,
        cta_destination: href,
        cta_type: buttonType ?? (rawHref?.startsWith("#") ? "anchor" : "link"),
      });
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [pathname]);

  return null;
}