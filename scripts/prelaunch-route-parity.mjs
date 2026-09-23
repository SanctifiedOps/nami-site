// Read-only route status comparison. Staging-only features may differ in content.
const live = "https://namicreative.co.uk";
const staging = "https://nami-creative-site-staging.opsanctus.workers.dev";
const paths = [
  "/", "/about", "/work", "/services", "/process", "/pricing", "/contact",
  "/network", "/network/directory", "/network/directory/artists",
  "/network/directory/member/joe-wilson-nami-creative", "/network/news",
  "/offers/creator-wave-workshop", "/privacy", "/terms", "/robots.txt", "/sitemap.xml",
];
let failures = 0;
for (const path of paths) {
  try {
    const [a, b] = await Promise.all([live, staging].map((base) => fetch(base + path, {
      redirect: "manual", signal: AbortSignal.timeout(15000),
    })));
    const good = a.status === b.status;
    if (!good) failures++;
    console.log(`${good ? "PASS" : "FAIL"} ${path}: live=${a.status} staging=${b.status}`);
  } catch (error) {
    failures++;
    console.log(`FAIL ${path}: ${error instanceof Error ? error.message : "request failed"}`);
  }
}
process.exitCode = failures ? 1 : 0;
