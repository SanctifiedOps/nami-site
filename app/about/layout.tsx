import type { Metadata } from "next";
import { JsonLd, founderPersonSchema } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "About - Joe Wilson, founder of NAMI Creative",
  description:
    "Joe Wilson is the founder of NAMI Creative, a Newcastle-born creative partner helping businesses with brand, websites, content, and the working bits behind them. NAMI also spotlights North East creatives, artists, local businesses, and brands doing things properly.",
  keywords: [
    "Joe Wilson NAMI",
    "NAMI Creative founder",
    "independent creative partner Newcastle",
    "independent creative director UK",
    "fractional brand director",
  ],
  openGraph: {
    title: "About - NAMI Creative",
    description:
      "Joe Wilson on NAMI Creative, North East creativity, brand work, websites, content, and helping good people get their work seen.",
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
