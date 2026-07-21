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

const siteDescription =
  "NAMI Creative helps North East businesses, brands, and creatives get seen through marketing, websites, content, automation, and the Creative Network.";

const socialDescription =
  "Marketing, websites, content, automation, and a growing Creative Network for North East businesses, brands, and creatives.";

export const metadata: Metadata = {
  title: {
    default: "NAMI Creative | Newcastle Marketing & Creative Network",
    template: "%s | NAMI Creative",
  },
  description: siteDescription,
  keywords: [
    "NAMI Creative",
    "Newcastle creatives",
    "North East creatives",
    "North East creative network",
    "Newcastle marketing support",
    "marketing services Newcastle",
    "content strategy Newcastle",
    "website support Newcastle",
    "creative partner North East",
    "North East small business marketing",
  ],
  applicationName: "NAMI Creative",
  authors: [{ name: "Joe Wilson", url: "https://namicreative.co.uk/about" }],
  creator: "Joe Wilson",
  publisher: "NAMI Creative",
  category: "Marketing and creative services",
  metadataBase: new URL("https://namicreative.co.uk"),
  alternates: {
    canonical: "/",
  },
  verification: {
    other: {
      "msvalidate.01": "3A2F2990F57CF69F305081E0AD32C1BF",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "NAMI Creative",
    title: "NAMI Creative | Newcastle Marketing & Creative Network",
    description: socialDescription,
    url: "https://namicreative.co.uk",
    images: [
      {
        url: "/nami-og%20%281%29.png",
        width: 2800,
        height: 1750,
        alt: "NAMI Creative - Newcastle marketing and North East creative network",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NAMI Creative | Newcastle Marketing & Creative Network",
    description: socialDescription,
    images: ["/nami-og%20%281%29.png"],
  },
  icons: {
    icon: [{ url: "/Nami%20Favicon.png", type: "image/png" }],
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
