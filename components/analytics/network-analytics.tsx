"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/analytics";

const SUBMISSION_ID_KEY = "nami_network_submission_id";

function getNetworkPage(pathname: string) {
  if (pathname === "/network") return "network_landing";
  if (pathname === "/network/thank-you") return "network_thank_you";
  return null;
}

function getTrafficSourceContext(params: URLSearchParams) {
  const utmSource = params.get("utm_source")?.toLowerCase();
  if (utmSource) return `utm:${utmSource}`;

  const referrer = document.referrer.toLowerCase();
  if (!referrer) return "direct";
  if (referrer.includes("instagram.com")) return "instagram_referral";
  if (referrer.includes("facebook.com")) return "facebook_referral";
  if (referrer.includes("whatsapp.com")) return "whatsapp_referral";
  if (referrer.includes("namicreative.co.uk")) return "internal";
  return "referral";
}

function getThankYouCommunityEvent(href: string | null) {
  if (!href) return null;
  if (href.includes("facebook.com/groups/1033572522893615")) {
    return "facebook_group_clicked";
  }
  if (href.includes("chat.whatsapp.com/Fq8MpjoXZTo7FFGM9KUiOr")) {
    return "whatsapp_community_clicked";
  }
  if (href.includes("instagram.com/namicreativeuk")) {
    return "instagram_follow_clicked";
  }
  return null;
}

function getSectionEvent(sectionName: string) {
  if (sectionName === "why_join") return "network_why_join_viewed";
  if (sectionName === "who_belongs") return "network_who_belongs_viewed";
  if (sectionName === "join_form") return "network_form_viewed";
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
    const submissionId = sessionStorage.getItem(SUBMISSION_ID_KEY);

    const sharedParams = {
      page_path: pathname,
      network_page: networkPage,
      source_context: "nami_creative_network",
      traffic_source_context: getTrafficSourceContext(params),
      submission_id: submissionId,
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
      trackEvent("generate_lead", {
        ...sharedParams,
        event_category: "conversion",
        lead_type: "creative_network_join",
        method: "network_thank_you_page",
      });
      if (submissionId) {
        sessionStorage.removeItem(SUBMISSION_ID_KEY);
      }
    }
  }, [pathname]);

  useEffect(() => {
    if (pathname !== "/network" || typeof IntersectionObserver === "undefined") {
      return;
    }

    const seenSections = new Set<string>();
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-network-section]"),
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const sectionName = entry.target.getAttribute("data-network-section");
          if (!sectionName || seenSections.has(sectionName)) return;
          seenSections.add(sectionName);

          const params = {
            page_path: pathname,
            network_page: "network_landing",
            source_context: "nami_creative_network",
            section_name: sectionName,
          };

          trackEvent("network_section_viewed", params);

          const sectionEvent = getSectionEvent(sectionName);
          if (sectionEvent) {
            trackEvent(sectionEvent, params);
          }
        });
      },
      { threshold: 0.45 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
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

      const ctaText = cleanText(element.textContent);
      const ctaType = buttonType ?? (rawHref?.startsWith("#") ? "anchor" : "link");

      trackEvent("network_cta_clicked", {
        page_path: pathname,
        network_page: networkPage,
        source_context: "nami_creative_network",
        cta_text: ctaText,
        cta_href: rawHref,
        cta_destination: href,
        cta_type: ctaType,
      });

      if (pathname === "/network/thank-you") {
        const communityEvent = getThankYouCommunityEvent(href);
        if (communityEvent) {
          trackEvent(communityEvent, {
            page_path: pathname,
            network_page: networkPage,
            source_context: "nami_creative_network",
            cta_text: ctaText,
            cta_href: rawHref,
            cta_destination: href,
            cta_type: ctaType,
          });
        }
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [pathname]);

  return null;
}