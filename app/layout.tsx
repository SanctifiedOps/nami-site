import type { Metadata } from "next";
import { instrumentSans, instrumentSerif } from "@/lib/fonts";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { CustomCursor } from "@/components/providers/custom-cursor";
import { cn } from "@/lib/utils";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "NAMI Creative — Brand + Content + Systems",
    template: "%s — NAMI Creative",
  },
  description:
    "NAMI Creative is a creative marketing studio that builds brand identity, content systems, and growth infrastructure designed to make businesses feel intentional, cohesive, and scalable.",
  metadataBase: new URL("https://namicreative.studio"),
  openGraph: {
    type: "website",
    locale: "en_GB",
    title: "NAMI Creative — Brand + Content + Systems",
    description:
      "A creative marketing studio aligning brand, content, and systems into one cohesive structure for growth.",
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={cn(instrumentSans.variable, instrumentSerif.variable)}
      suppressHydrationWarning
    >
      <body className="bg-surface-0 text-fg antialiased">
        <SmoothScroll />
        <CustomCursor />
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
