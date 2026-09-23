// Safe staging checks. Invalid form payloads must fail validation before integrations run.
const base = new URL(process.argv[2] || "https://nami-creative-site-staging.opsanctus.workers.dev");
const checks = [
  { name: "home", path: "/", status: 200 },
  { name: "contact page", path: "/contact", status: 200 },
  { name: "workshop page", path: "/offers/creator-wave-workshop", status: 200 },
  { name: "network application page", path: "/network", status: 200 },
  { name: "directory", path: "/network/directory", status: 200 },
  { name: "unpublished network news", path: "/network/news", status: 404 },
  { name: "unpublished network news article", path: "/network/news/why-i-built-the-nami-creative-directory", status: 404 },
  { name: "member login", path: "/network/login", status: 200 },
  { name: "password reset page", path: "/network/forgot-password", status: 200 },
  { name: "independent ticket page", path: "/network/report-a-problem", status: 200 },
  { name: "held events noticeboard", path: "/network/events", status: 404 },
  { name: "robots", path: "/robots.txt", status: 200 },
  { name: "sitemap", path: "/sitemap.xml", status: 200 },
  { name: "contact invalid input", path: "/api/contact", method: "POST", body: {}, status: 400 },
  { name: "workshop invalid input", path: "/api/creator-wave-workshop", method: "POST", body: {}, status: 400 },
  { name: "network invalid input", path: "/api/network", method: "POST", body: {}, status: 400 },
  { name: "subscribe invalid input", path: "/api/subscribe", method: "POST", body: {}, status: 400 },
  { name: "contact outbound hold", path: "/api/contact", method: "POST", body: { firstName: "Launch", lastName: "QA", email: "launch-qa@example.invalid" }, status: 503 },
  { name: "workshop outbound hold", path: "/api/creator-wave-workshop", method: "POST", body: { name: "Launch QA", email: "launch-qa@example.invalid", packageInterest: "Test" }, status: 503 },
  { name: "newsletter outbound hold", path: "/api/subscribe", method: "POST", body: { email: "launch-qa@example.invalid" }, status: 503 },
  { name: "member profile requires login", path: "/api/network/member-profile", status: 401 },
  { name: "member profile edit requires login", path: "/api/network/member-profile", method: "PUT", body: {}, status: 401 },
  { name: "owner approval API requires authorization", path: "/api/internal/network-admin", status: 401 },
  { name: "owner operations API requires authorization", path: "/api/internal/network-operations", status: 401 },
  { name: "ticket invalid input", path: "/api/network/tickets", method: "POST", body: {}, status: 400 },
  { name: "event submissions held", path: "/api/network/events", method: "POST", body: {}, status: 503 },
];

let failures = 0;
for (const check of checks) {
  try {
    const response = await fetch(new URL(check.path, base), {
      method: check.method || "GET",
      headers: check.method ? { "Content-Type": "application/json" } : undefined,
      body: check.method ? JSON.stringify(check.body) : undefined,
      redirect: "manual",
      signal: AbortSignal.timeout(15000),
    });
    const passed = response.status === check.status;
    if (!passed) failures++;
    console.log(`${passed ? "PASS" : "FAIL"} ${check.name}: ${response.status} (expected ${check.status})`);
  } catch (error) {
    failures++;
    console.log(`FAIL ${check.name}: ${error instanceof Error ? error.message : "request failed"}`);
  }
}
process.exitCode = failures ? 1 : 0;
