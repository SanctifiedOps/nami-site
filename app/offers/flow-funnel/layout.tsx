import type { Metadata } from "next";
import {
  JsonLd,
  buildFaqPageSchema,
  buildBreadcrumbSchema,
  type JsonLdSchema,
} from "@/components/seo/json-ld";
import { flowFunnel } from "@/lib/content/offers";

const SITE_URL = "https://namicreative.co.uk";
const OFFER_URL = `${SITE_URL}/offers/${flowFunnel.slug}`;

export const metadata: Metadata = {
  title:
    "The Flow Funnel · £750 build + £50 per qualified lead · NAMI Creative",
  description:
    "Productised landing page, lead capture, private dashboard, and attribution layer. Built and live in 7 days for £750. After that you only pay £50 per qualified lead, capped at £750 a month, rate locked for 6 months. Built for UK independent service operators with a personal brand.",
  keywords: [
    "flow funnel",
    "performance-priced landing page UK",
    "pay-per-lead landing page",
    "lead-priced funnel UK",
    "attribution dashboard for coaches",
    "landing page for consultants UK",
    "results-based web design UK",
    "lead funnel for personal brands",
    "productised landing page",
    "performance pricing web design",
  ],
  openGraph: {
    title: "The Flow Funnel · NAMI Creative",
    description:
      "Landing page, lead capture, dashboard, attribution. Live in 7 days for £750. Then you only pay £50 per qualified lead, capped at £750 a month. Built for UK service operators.",
    url: OFFER_URL,
    type: "website",
  },
  alternates: {
    canonical: OFFER_URL,
  },
};

/**
 * Service schema with embedded Offer. Build fee is the headline price; the
 * £50/qualified-lead unit ships as a separate priceSpecification so search
 * engines + AI Overviews can surface the dual-component pricing accurately.
 */
const offerServiceSchema: JsonLdSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${OFFER_URL}#service`,
  name: flowFunnel.name,
  description:
    "Productised landing page, lead capture, private lead dashboard, attribution layer, and instant email notification. Built and shipped in 7 days for UK independent service operators with a personal brand. Performance-priced after the build: £50 per qualified lead, capped at £750 a month, rate locked for 6 months.",
  serviceType:
    "Performance-priced landing page and lead funnel build",
  provider: { "@id": `${SITE_URL}/#organization` },
  areaServed: [
    { "@type": "Country", name: "United Kingdom" },
  ],
  url: OFFER_URL,
  offers: {
    "@type": "Offer",
    price: flowFunnel.priceGBP,
    priceCurrency: "GBP",
    availability: "https://schema.org/LimitedAvailability",
    url: OFFER_URL,
    seller: { "@id": `${SITE_URL}/#organization` },
    priceSpecification: [
      {
        "@type": "PriceSpecification",
        price: flowFunnel.performanceTerms.buildFee,
        priceCurrency: "GBP",
        unitText: "build (one-off, paid on kickoff)",
      },
      {
        "@type": "UnitPriceSpecification",
        price: flowFunnel.performanceTerms.perLeadFee,
        priceCurrency: "GBP",
        unitText: "qualified lead",
        referenceQuantity: { "@type": "QuantitativeValue", value: 1 },
      },
      {
        "@type": "PriceSpecification",
        maxPrice: flowFunnel.performanceTerms.monthlyCap,
        priceCurrency: "GBP",
        unitText: "monthly ceiling (rate locked 6 months)",
      },
    ],
  },
};

export default function FlowFunnelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd
        schema={[
          offerServiceSchema,
          buildFaqPageSchema(flowFunnel.faq),
          buildBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: flowFunnel.name, url: `/offers/${flowFunnel.slug}` },
          ]),
        ]}
      />
      {children}
    </>
  );
}
