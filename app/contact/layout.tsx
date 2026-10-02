import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Joe | Start a Marketing Project",
  description:
    "Talk to Joe at NAMI Creative about freelance marketing, websites, content, brand support and automation for your North East business.",
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
        url: "/assets/images/nami-og.png",
        width: 1080,
        height: 540,
        alt: "NAMI Creative - Newcastle marketing support",
      },
    ],
    title: "Contact Joe | Start a Marketing Project",
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
