"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export function CreatorWaveThankYouTracker() {
  useEffect(() => {
    const sharedParams = {
      page_path: "/offers/creator-wave-workshop/thank-you",
      source_context: "creator_wave_workshop",
      conversion_type: "creator_wave_enquiry",
    };

    trackEvent("creator_wave_enquiry_completed", {
      ...sharedParams,
      event_category: "conversion",
    });

    trackEvent("generate_lead", {
      ...sharedParams,
      event_category: "conversion",
      lead_type: "creator_wave_workshop",
      method: "creator_wave_thank_you_page",
    });
  }, []);

  return null;
}
