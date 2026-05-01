import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "NAMI Creative — Brand + Content + Systems",
    template: "%s — NAMI Creative",
  },
  description:
    "NAMI Creative is a creative marketing studio that builds brand identity, content systems, and growth infrastructure designed to make businesses feel intentional, cohesive, and scalable.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
