import type { Metadata } from "next";
import {
  JsonLd,
  buildFaqPageSchema,
  type JsonLdSchema,
} from "@/components/seo/json-ld";
import { flowFunnel } from "@/lib/content/offers";

const SITE_URL = "https://namicreative.co.uk";
const OFFER_URL = `${SITE_URL}/offers/${flowFunnel.slug}`;

export const metadata: Metadata = {
  title: "The Flow Funnel",
  description:
    "A landing page, lead capture, and private lead dashboard. Built and live in 7 days for £500. For founders, freelancers, and creatives whose DMs are doing the work their website should be.",
  openGraph: {
    title: "The Flow Funnel · NAMI Creative",
    description:
      "A landing page, lead capture, and lead dashboard. Built and live in 7 days for £500. For founders, freelancers, and creatives.",
    url: OFFER_URL,
    type: "website",
  },
  alternates: {
    canonical: OFFER_URL,
  },
};

/**
 * Service schema with embedded Offer (price). Builds on the pattern in
 * components/seo/json-ld.tsx but adds the priced Offer field which the
 * existing buildServiceSchema helper doesn't surface.
 */
const offerServiceSchema: JsonLdSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${OFFER_URL}#service`,
  name: flowFunnel.name,
  description:
    "Productised landing page, lead capture form, private lead dashboard, and instant email notification. Designed and shipped in 7 days for founders, freelancers, and creatives.",
  serviceType: "Landing page and lead funnel build",
  provider: { "@id": `${SITE_URL}/#organization` },
  areaServed: [
    { "@type": "Country", name: "United Kingdom" },
    { "@type": "Place", name: "Worldwide" },
  ],
  url: OFFER_URL,
  offers: {
    "@type": "Offer",
    price: flowFunnel.priceGBP,
    priceCurrency: "GBP",
    availability: "https://schema.org/LimitedAvailability",
    url: OFFER_URL,
    seller: { "@id": `${SITE_URL}/#organization` },
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
        schema={[offerServiceSchema, buildFaqPageSchema(flowFunnel.faq)]}
      />
      {children}
    </>
  );
}
