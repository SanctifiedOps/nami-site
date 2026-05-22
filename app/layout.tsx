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
    default: "NAMI Creative · Brand, Content, Systems",
    template: "%s · NAMI Creative",
  },
  description:
    "NAMI Creative builds self-sustaining creative ecosystems for founders. One creative partner across brand, content, websites, visual direction, and growth automation, so your business stops depending on you being in every room. Newcastle-built, working globally.",
  metadataBase: new URL("https://namicreative.co.uk"),
  openGraph: {
    type: "website",
    locale: "en_GB",
    title: "NAMI Creative · Brand, Content, Systems",
    description:
      "Self-sustaining creative ecosystems for founders. One studio across brand, content, websites, visual direction, and growth automation.",
    images: [
      {
        url: "/assets/images/Nami-OG.png",
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
    images: ["/assets/images/Nami-OG.png"],
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
