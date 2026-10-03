import { sitemapIndexXml, sitemapResponse } from "@/lib/seo/sitemap";

export const dynamic = "force-static";

export function GET() {
  return sitemapResponse(sitemapIndexXml(), 86400);
}
