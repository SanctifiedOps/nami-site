// Read-only audit of every production D1 profile through the isolated preview Worker.
import { execFileSync } from "node:child_process";
import { join } from "node:path";

const base = new URL(process.argv[2] || "https://nami-creative-site-precutover.opsanctus.workers.dev");
const wrangler = join(process.cwd(), "node_modules", "wrangler", "bin", "wrangler.js");
const raw = execFileSync(process.execPath, [
  wrangler, "d1", "execute", "DB", "--remote", "--json", "--command",
  "SELECT m.id, m.email_normalized FROM members m JOIN member_profiles p ON p.member_id = m.id WHERE p.published = 1 ORDER BY m.id",
], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], maxBuffer: 8 * 1024 * 1024 });
const members = JSON.parse(raw)[0].results;
let cursor = 0;
const failures = [];

async function worker() {
  while (cursor < members.length) {
    const member = members[cursor++];
    try {
      const response = await fetch(new URL(`/network/directory/member/${member.id}`, base), {
        signal: AbortSignal.timeout(20000),
      });
      const html = await response.text();
      const issues = [];
      if (response.status !== 200) issues.push(`HTTP ${response.status}`);
      if (!html.includes('application/ld+json')) issues.push("missing schema");
      if (!html.includes('property="og:image"')) issues.push("missing OG image");
      // The owner's hello@ address is intentionally public site-wide.
      if (member.email_normalized && member.email_normalized.toLowerCase() !== "hello@namicreative.co.uk" &&
        html.toLowerCase().includes(member.email_normalized.toLowerCase())) {
        issues.push("private email exposed");
      }
      if (issues.length) failures.push(`${member.id}: ${issues.join(", ")}`);
    } catch (error) {
      failures.push(`${member.id}: ${error instanceof Error ? error.message : "request failed"}`);
    }
  }
}

await Promise.all(Array.from({ length: 8 }, () => worker()));
for (const failure of failures) console.log(`FAIL ${failure}`);
console.log(`${failures.length ? "FAIL" : "PASS"} production profile audit: ${members.length - failures.length}/${members.length} published profiles`);
process.exitCode = failures.length ? 1 : 0;
