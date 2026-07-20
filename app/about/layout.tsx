import type { Metadata } from "next";
import { JsonLd, founderPersonSchema } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "About - Joe Wilson, founder of NAMI Creative",
  description:
    "Joe Wilson is the founder of NAMI Creative, a Newcastle-born creative partner helping North East businesses, brands, and creators through marketing services and the NAMI Creative Network.",
  keywords: [
    "Joe Wilson NAMI",
    "NAMI Creative founder",
    "independent creative partner Newcastle",
    "independent creative director UK",
    "fractional brand director",
  ],
  openGraph: {
    images: [{ url: "/nami-og%20%281%29.png", width: 2800, height: 1750, alt: "NAMI Creative - Marketing and creative work done properly" }],
    title: "About - NAMI Creative",
    description:
      "Joe Wilson on NAMI Creative, supporting North East businesses, creator network building, brand work, websites, content, and helping good people get seen.",
    url: "https://namicreative.co.uk/about",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd schema={founderPersonSchema} />
      {children}
    </>
  );
}
