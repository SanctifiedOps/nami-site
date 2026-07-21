import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing | Marketing, Website & Creative Support",
  description:
    "Pricing guidance for NAMI Creative projects and partnerships across marketing, websites, content, automation, and buyer journey work.",
  keywords: [
    "creative marketing pricing UK",
    "marketing support pricing Newcastle",
    "website project pricing North East",
    "content strategy pricing",
    "creative retainer pricing",
  ],
  openGraph: {
    images: [
      {
        url: "/nami-og%20%281%29.png",
        width: 2800,
        height: 1750,
        alt: "NAMI Creative - marketing and creative support pricing",
      },
    ],
    title: "Pricing | NAMI Creative",
    description:
      "Project and partnership pricing for marketing, websites, content, automation, and buyer journey work.",
    url: "https://namicreative.co.uk/pricing",
  },
  alternates: {
    canonical: "/pricing",
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
