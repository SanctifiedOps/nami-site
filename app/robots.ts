import type { MetadataRoute } from "next";

const SITE = "https://namicreative.co.uk";

/**
 * Explicit rules for both general crawlers and AI/LLM crawlers. The
 * wildcard `*` rule covers Google, Bing, et al. Each AI crawler is
 * named explicitly so platforms can read the welcome signal even if
 * they ignore the wildcard. Citation visibility in AI Overviews,
 * ChatGPT-search, Perplexity, Claude, and Copilot all depend on the
 * relevant bot being allowed.
 */
export default function robots(): MetadataRoute.Robots {
  const disallow = ["/api/", "/thank-you"];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow,
      },
      // OpenAI (ChatGPT)
      { userAgent: "GPTBot", allow: "/", disallow },
      { userAgent: "ChatGPT-User", allow: "/", disallow },
      { userAgent: "OAI-SearchBot", allow: "/", disallow },
      // Anthropic (Claude)
      { userAgent: "ClaudeBot", allow: "/", disallow },
      { userAgent: "Claude-Web", allow: "/", disallow },
      { userAgent: "anthropic-ai", allow: "/", disallow },
      // Google Gemini + AI Overviews
      { userAgent: "Google-Extended", allow: "/", disallow },
      // Perplexity
      { userAgent: "PerplexityBot", allow: "/", disallow },
      { userAgent: "Perplexity-User", allow: "/", disallow },
      // Microsoft Copilot / Bing
      { userAgent: "Bingbot", allow: "/", disallow },
      { userAgent: "BingPreview", allow: "/", disallow },
      // Apple Intelligence
      { userAgent: "Applebot", allow: "/", disallow },
      { userAgent: "Applebot-Extended", allow: "/", disallow },
      // Common Crawl (training data; ok to allow for citation flywheel)
      { userAgent: "CCBot", allow: "/", disallow },
    ],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
