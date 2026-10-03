import { memberSitemapXml, sitemapResponse } from "@/lib/seo/sitemap";

// Keep the member list live at the origin. The Worker caches successful XML
// responses for an hour and memberSitemapXml always has a local fallback.
export const dynamic = "force-dynamic";

export async function GET() {
  return sitemapResponse(await memberSitemapXml(), 3600);
}
