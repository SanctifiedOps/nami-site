import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact NAMI Creative | Newcastle Marketing Support",
  description:
    "Start a conversation with NAMI Creative about marketing, content, websites, automation, or a clearer buyer journey for your North East business.",
  keywords: [
    "Newcastle marketing support",
    "North East marketing services",
    "website support Newcastle",
    "content strategy Newcastle",
    "buyer journey automation",
  ],
  openGraph: {
    images: [
      {
        url: "/nami-og%20%281%29.png",
        width: 2800,
        height: 1750,
        alt: "NAMI Creative - Newcastle marketing support",
      },
    ],
    title: "Contact NAMI Creative | Newcastle Marketing Support",
    description:
      "Talk to Joe about your brand, content, website, automation, or buyer journey.",
    url: "https://namicreative.co.uk/contact",
  },
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
