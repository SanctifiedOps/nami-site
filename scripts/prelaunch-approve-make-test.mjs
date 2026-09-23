// Approve only the known staging QA application. Never send an invitation.
import { readFile } from "node:fs/promises";

const base = "https://nami-creative-site-staging.opsanctus.workers.dev";
const id = "launch-qa-make-20260922";
const vars = await readFile(new URL("../.dev.vars", import.meta.url), "utf8");
const secret = vars.match(/^NETWORK_ADMIN_SECRET=(.*)$/m)?.[1]?.trim().replace(/^"|"$/g, "");
if (!secret) throw new Error("Staging admin secret unavailable.");
const headers = { Authorization: `Bearer ${secret}` };

async function readAdmin() {
  const response = await fetch(`${base}/api/internal/network-admin`, {
    headers,
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) throw new Error(`Admin read: ${response.status}`);
  return response.json();
}

const before = await readAdmin();
const application = before.applications.find((item) => item.id === id);
if (!application || application.status !== "pending") throw new Error("Expected pending QA application not found.");
if (application.email !== "launch-qa+network@example.invalid") throw new Error("QA email mismatch.");
const approval = await fetch(`${base}/api/internal/network-admin`, {
  method: "POST",
  headers: { ...headers, "Content-Type": "application/json" },
  body: JSON.stringify({ action: "approve", applicationId: id, primaryGroup: "artists", speciality: "Launch QA" }),
  signal: AbortSignal.timeout(20000),
});
if (!approval.ok) throw new Error(`Approval: ${approval.status}: ${(await approval.text()).slice(0, 200)}`);
if ((await approval.json()).memberId !== id) throw new Error("Approved wrong member.");

const after = await readAdmin();
const member = after.members.find((item) => item.member?.id === id);
if (!member?.profile?.published || member.member.accountStatus !== "unclaimed") {
  throw new Error("Published, unclaimed QA member not found.");
}
const page = await fetch(`${base}/network/directory/member/${id}`, { signal: AbortSignal.timeout(20000) });
const html = await page.text();
if (page.status !== 200 || !html.includes("og:image") || !html.includes("application/ld+json")) {
  throw new Error("Profile page, OG image or schema missing.");
}
const directory = await fetch(`${base}/network/directory`, { signal: AbortSignal.timeout(20000) });
if (directory.status !== 200 || !(await directory.text()).includes(id)) {
  throw new Error("Directory card missing.");
}
console.log(`PASS ${id}: approved, unclaimed, public card and page; no invitation requested.`);
