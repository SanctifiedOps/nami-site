import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing · Project, partnership, and systems engagements",
  description:
    "Three ways to work with NAMI Creative: scoped projects (4-8 weeks), ongoing partnerships (monthly retainer), and systems + product builds (2-5 weeks). Engagements sized to the work, not packaged into fixed bundles. Honest scoping on every call.",
  keywords: [
    "creative studio pricing UK",
    "brand engagement pricing",
    "creative retainer pricing",
    "boutique brand studio cost",
  ],
  openGraph: {
    title: "Pricing · NAMI Creative",
    description:
      "Project (4-8 weeks), Partnership (monthly retainer), Systems + product (2-5 weeks). Sized to the work, never packaged.",
    url: "https://namicreative.co.uk/pricing",
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
