import type { Metadata } from "next";
import {
  JsonLd,
  buildBreadcrumbSchema,
  buildFaqPageSchema,
  type JsonLdSchema,
} from "@/components/seo/json-ld";
import { creatorWaveWorkshop } from "@/lib/content/creator-wave-workshop";

const SITE_URL = "https://namicreative.co.uk";
const OFFER_URL = `${SITE_URL}${creatorWaveWorkshop.url}`;

export const metadata: Metadata = {
  title:
    "Creator Wave Workshop | Creative Network Member Offer | NAMI Creative",
  description:
    "A discounted Creative Network member offer for North East creatives, freelancers, makers, and small businesses. Free creator check-in, funnel report for \u00a399, or a simple website and funnel build from \u00a3499.",
  keywords: [
    "creator funnel consultation",
    "North East creators marketing",
    "Newcastle creatives website",
    "creative network member offer",
    "creator website design",
    "freelancer landing page",
    "small business funnel Newcastle",
    "creative business marketing North East",
  ],
  openGraph: {
    images: [
      {
        url: "/nami-og%20%281%29.png",
        width: 2800,
        height: 1750,
        alt: "NAMI Creative - Marketing and creative work done properly",
      },
    ],
    title: "Creator Wave Workshop | NAMI Creative",
    description:
      "A Creative Network member offer to make the path from attention to enquiry, booking, sale, or commission clearer.",
    url: OFFER_URL,
    type: "website",
  },
  alternates: {
    canonical: OFFER_URL,
  },
};

const offerServiceSchema: JsonLdSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${OFFER_URL}#service`,
  name: creatorWaveWorkshop.name,
  description:
    "Free creator check-in, funnel report, and simple website or funnel build for Creative Network members, freelancers, makers, artists, and small businesses in the North East.",
  serviceType: "Creator funnel consultation and website design",
  provider: { "@id": `${SITE_URL}/#organization` },
  areaServed: [
    { "@type": "AdministrativeArea", name: "North East England" },
    { "@type": "City", name: "Newcastle upon Tyne" },
    { "@type": "City", name: "Gateshead" },
    { "@type": "City", name: "Sunderland" },
    { "@type": "City", name: "Durham" },
    { "@type": "Country", name: "United Kingdom" },
  ],
  audience: {
    "@type": "Audience",
    audienceType:
      "Creative Network members, creatives, freelancers, artists, makers, musicians, photographers, and small businesses",
  },
  url: OFFER_URL,
  offers: [
    {
      "@type": "Offer",
      name: "30 minute Creator Check-in",
      price: 0,
      priceCurrency: "GBP",
      availability: "https://schema.org/LimitedAvailability",
      url: OFFER_URL,
      seller: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "Offer",
      name: "Full Creator Funnel Report",
      price: 99,
      priceCurrency: "GBP",
      availability: "https://schema.org/LimitedAvailability",
      url: OFFER_URL,
      seller: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "Offer",
      name: "Creator Website and Funnel Build",
      price: 499,
      priceCurrency: "GBP",
      availability: "https://schema.org/LimitedAvailability",
      url: OFFER_URL,
      seller: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

export default function CreatorWaveWorkshopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd
        schema={[
          offerServiceSchema,
          buildFaqPageSchema(creatorWaveWorkshop.faq),
          buildBreadcrumbSchema([
            { name: "Home", url: "/" },
            {
              name: creatorWaveWorkshop.name,
              url: creatorWaveWorkshop.url,
            },
          ]),
        ]}
      />
      {children}
    </>
  );
}