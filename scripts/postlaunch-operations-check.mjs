// Staging-only write check for the independent support route.
// Uses a synthetic address and held owner notifications, so no email is created or sent.
const base = new URL(process.argv[2] || "https://nami-creative-site-staging.opsanctus.workers.dev");
if (!base.hostname.includes("staging") && !base.hostname.endsWith(".workers.dev")) {
  throw new Error("The operations write check must target a staging Worker.");
}

const response = await fetch(new URL("/api/network/tickets", base), {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "Launch QA",
    email: "launch-qa@example.invalid",
    subject: "Staging ticket route check",
    description: "Synthetic staging ticket used to verify storage without sending an owner or member email.",
    pageUrl: new URL("/network/login", base).toString(),
    priority: "normal",
  }),
  signal: AbortSignal.timeout(20000),
});
const body = await response.json().catch(() => ({}));
if (response.status !== 200 || !body.ticketId) {
  throw new Error(`Ticket route returned ${response.status}: ${JSON.stringify(body).slice(0, 300)}`);
}
console.log(`PASS staging ticket stored with reference ${body.ticketId}`);

const events = await fetch(new URL("/api/network/events", base), {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: "{}",
  signal: AbortSignal.timeout(20000),
});
if (events.status !== 503) throw new Error(`Held events route returned ${events.status}, expected 503.`);
console.log("PASS event submissions remain held");
