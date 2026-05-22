import type { Metadata } from "next";
import { JsonLd, founderPersonSchema } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "About · Joe Wilson, founder of NAMI Creative",
  description:
    "NAMI Creative is a one-studio operation by Joe Wilson, based in Newcastle upon Tyne, working globally. Senior-only output, direct founder relationships, no middle layer. Brand, content, websites, visual direction, and growth systems delivered as one engagement, not five vendors.",
  keywords: [
    "Joe Wilson NAMI",
    "NAMI Creative founder",
    "creative studio founder Newcastle",
    "independent creative director UK",
    "fractional brand director",
  ],
  openGraph: {
    title: "About · NAMI Creative",
    description:
      "Joe Wilson on building NAMI Creative: senior-only output, direct founder relationships, no middle layer.",
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
