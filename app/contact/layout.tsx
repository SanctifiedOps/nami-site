import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start a conversation with NAMI Creative. Tell us about the business, what's working, and what's stuck. Typically a personal response within one working day.",
  openGraph: {
    title: "Contact · NAMI Creative",
    description:
      "Three questions to start. Scope and budget on the call. Personal response within one working day.",
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
