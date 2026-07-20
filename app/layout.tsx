import type { Metadata } from "next";
import { instrumentSans } from "@/lib/fonts";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { CustomCursor } from "@/components/providers/custom-cursor";
import { MotionProvider } from "@/components/providers/motion-config";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { NetworkAnalytics } from "@/components/analytics/network-analytics";
import {
  JsonLd,
  organizationSchema,
  localBusinessSchema,
  websiteSchema,
} from "@/components/seo/json-ld";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "NAMI Creative - Marketing and creative work done properly",
    template: "%s - NAMI Creative",
  },
  description:
    "Marketing and creative work for North East businesses, brands, and creators. Brand, websites, content, automation, and the NAMI Creative Network, handled by Joe Wilson.",
  keywords: [
    "marketing and creative support",
    "brand website content support",
    "independent creative partner UK",
    "brand strategy Newcastle",
    "creative partner for founders",
    "fractional creative director UK",
    "brand and automation agency",
    "marketing support for founders",
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
    title: "NAMI Creative - Brand, Content, Automation",
    description:
      "Marketing and creative work for North East businesses, brands, and creators. Brand, websites, content, automation, and the NAMI Creative Network, handled by Joe Wilson.",
        images: [
      {
        url: "/nami-og%20%281%29.png",
        width: 2800,
        height: 1750,
        alt: "NAMI Creative - Marketing and creative work done properly",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NAMI Creative - Brand, Content, Automation",
    description:
      "Marketing and creative work for North East businesses, brands, and creators. Brand, websites, content, automation, and the NAMI Creative Network, handled by Joe Wilson.",
    images: ["/nami-og%20%281%29.png"],
  },
  icons: {
    icon: [
      { url: "/Nami%20Favicon.png", type: "image/png" },
    ],
    shortcut: "/Nami%20Favicon.png",
    apple: "/Nami%20Favicon.png",
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
        <MotionProvider>
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
        </MotionProvider>
        <GoogleAnalytics />
        <NetworkAnalytics />
      </body>
    </html>
  );
}
