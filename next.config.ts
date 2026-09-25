import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/services/visual-direction",
        destination: "/services/brand-strategy",
        permanent: true,
      },
      {
        source: "/insights/brand-decay",
        destination: "/services/brand-strategy",
        permanent: true,
      },
      {
        source: "/insights/the-friction-tax",
        destination: "/services/automation-growth",
        permanent: true,
      },
      {
        source: "/insights/audience-without-architecture",
        destination: "/services/content-systems",
        permanent: true,
      },
    ];
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "drive.google.com",
        pathname: "/uc/**",
      },
    ],
  },
};

initOpenNextCloudflareForDev({
  configPath: "wrangler.local.jsonc",
  envFiles: [".env.local", ".env.development.local"],
});

export default nextConfig;
