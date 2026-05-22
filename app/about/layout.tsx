import type { Metadata } from "next";
import { JsonLd, founderPersonSchema } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "About",
  description:
    "NAMI Creative is a one-studio operation by Joe Wilson, Newcastle-based, working globally. Brand, content, websites, visual direction, and growth systems delivered as one engagement, not five vendors.",
  openGraph: {
    title: "About · NAMI Creative",
    description:
      "Joe Wilson on building NAMI Creative: senior-only output, direct founder relationships, no middle layer. Brand, content, and growth systems integrated at strategy.",
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
