import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact · Start a brand, website, or systems project",
  description:
    "Start a conversation with NAMI Creative. Three questions on the form, scope and budget on the call. Personal response within one working day. For brand, website, content, or growth automation projects.",
  keywords: [
    "start a creative project UK",
    "book a creative project call",
    "hire a brand partner Newcastle",
    "brand consultation booking",
  ],
  openGraph: {
    images: [{ url: "/nami-og%20%281%29.png", width: 2800, height: 1750, alt: "NAMI Creative - Marketing and creative work done properly" }],
    title: "Contact · NAMI Creative",
    description:
      "Three questions on the form. Scope and budget on the call. Personal response within one working day.",
    url: "https://namicreative.co.uk/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
