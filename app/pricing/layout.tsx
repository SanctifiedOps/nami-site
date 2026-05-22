import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Three ways to work with NAMI Creative: scoped projects, ongoing partnerships, and systems + product builds. Engagements sized to the work, not bundled. Honest scoping on every conversation.",
  openGraph: {
    title: "Pricing · NAMI Creative",
    description:
      "Engagement models: Project (4-8 weeks), Partnership (monthly retainer), Systems + product (2-5 weeks). Sized to the work, never packaged.",
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
