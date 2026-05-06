import type { Metadata } from "next";
import { instrumentSans } from "@/lib/fonts";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { CustomCursor } from "@/components/providers/custom-cursor";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "NAMI Creative · Brand, Content, Systems",
    template: "%s · NAMI Creative",
  },
  description:
    "NAMI Creative is a future-focused studio building brands with structure, identity, and impact. Waves of creative impact, from identity to execution and launch to scale.",
  metadataBase: new URL("https://namicreative.co.uk"),
  openGraph: {
    type: "website",
    locale: "en_GB",
    title: "NAMI Creative · Brand, Content, Systems",
    description:
      "A future-focused studio aligning brand, content, and systems into one cohesive structure. Waves of creative impact.",
    images: [
      {
        url: "/assets/images/Nami-OG.png",
        width: 1600,
        height: 1000,
        alt: "NAMI Creative · Waves of creative impact",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NAMI Creative · Brand, Content, Systems",
    description:
      "A future-focused studio aligning brand, content, and systems into one cohesive structure. Waves of creative impact.",
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
        <SmoothScroll />
        <CustomCursor />
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
