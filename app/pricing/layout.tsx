import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Freelance Marketing Pricing & Ways to Work",
  description:
    "Explore project, partnership and systems support from NAMI Creative for North East businesses that need practical marketing help.",
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
    title: "Freelance Marketing Pricing & Ways to Work",
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
