import type { Metadata } from "next";
import { JsonLd, founderPersonSchema } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "About Joe Wilson | North East Freelance Marketer",
  description:
    "Meet Joe Wilson, the freelance marketer behind NAMI Creative and the NAMI Creative Network, supporting businesses and creatives across the North East.",
  keywords: [
    "Joe Wilson NAMI",
    "NAMI Creative founder",
    "Newcastle creatives",
    "North East creatives",
    "independent creative partner Newcastle",
    "North East marketing support",
    "NAMI Creative Network",
  ],
  openGraph: {
    images: [
      {
        url: "/nami-og%20%281%29.png",
        width: 2800,
        height: 1750,
        alt: "NAMI Creative - Newcastle marketing and North East creative network",
      },
    ],
    title: "About Joe Wilson | North East Freelance Marketer",
    description:
      "Joe Wilson on NAMI Creative, the Creative Network, North East creativity, marketing services, websites, content, and helping good people get seen.",
    url: "https://namicreative.co.uk/about",
  },
  alternates: {
    canonical: "/about",
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
