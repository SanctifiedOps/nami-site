import type { Metadata } from "next";
import { instrumentSans } from "@/lib/fonts";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { CustomCursor } from "@/components/providers/custom-cursor";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import {
  JsonLd,
  organizationSchema,
  localBusinessSchema,
  websiteSchema,
} from "@/components/seo/json-ld";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "NAMI Creative · Independent creative studio for founders",
    template: "%s · NAMI Creative",
  },
  description:
    "Independent creative studio for founders, working globally from Newcastle. One partner across brand, content, websites, visual direction, and growth automation.",
  keywords: [
    "creative studio for founders",
    "brand and content studio",
    "independent creative studio UK",
    "brand strategy studio Newcastle",
    "creative partner for founders",
    "fractional creative director UK",
    "brand and automation agency",
    "self-sustaining creative ecosystem",
  ],
  metadataBase: new URL("https://namicreative.co.uk"),
  verification: {
    other: {
      "msvalidate.01": "3A2F2990F57CF69F305081E0AD32C1BF",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    title: "NAMI Creative · Brand, Content, Systems",
    description:
      "Self-sustaining creative ecosystems for founders. One studio across brand, content, websites, visual direction, and growth automation.",
    images: [
      {
        url: "/assets/images/Nami-OG-v2.png",
        width: 1600,
        height: 1000,
        alt: "NAMI Creative · Self-sustaining creative ecosystems for founders",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NAMI Creative · Brand, Content, Systems",
    description:
      "Self-sustaining creative ecosystems for founders. One studio across brand, content, websites, visual direction, and growth automation.",
    images: ["/assets/images/Nami-OG-v2.png"],
  },
  icons: {
    icon: [
      { url: "/assets/images/nami-fav.png", type: "image/png" },
    ],
    shortcut: "/assets/images/nami-fav.png",
    apple: "/assets/images/nami-fav.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={instrumentSans.variable}
      suppressHydrationWarning
    >
      <body className="bg-surface-0 text-fg antialiased">
        <JsonLd
          schema={[organizationSchema, localBusinessSchema, websiteSchema]}
        />
        <SmoothScroll />
        <CustomCursor />
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
