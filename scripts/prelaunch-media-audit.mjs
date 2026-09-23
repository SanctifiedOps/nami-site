// Read-only audit of published staging profile images. Never prints member data.
import { readFile } from "node:fs/promises";

const base = "https://nami-creative-site-staging.opsanctus.workers.dev";
const vars = await readFile(new URL("../.dev.vars", import.meta.url), "utf8");
const secret = vars.match(/^NETWORK_ADMIN_SECRET=(.*)$/m)?.[1]?.trim().replace(/^"|"$/g, "");
if (!secret) throw new Error("Local staging admin secret is unavailable.");
const response = await fetch(`${base}/api/internal/network-admin`, {
  headers: { Authorization: `Bearer ${secret}` },
  signal: AbortSignal.timeout(20000),
});
if (!response.ok) throw new Error(`Admin read failed: ${response.status}`);
const data = await response.json();
const published = data.members.filter(({ profile }) => profile?.published);
const images = published.filter(({ profile }) => profile.profileImageKey);
let next = 0;
const failures = [];
await Promise.all(Array.from({ length: 5 }, async () => {
  while (next < images.length) {
    const { member, profile } = images[next++];
    const key = profile.profileImageKey.split("/").map(encodeURIComponent).join("/");
    try {
      const result = await fetch(`${base}/api/network/media/${key}`, {
        method: "HEAD",
        signal: AbortSignal.timeout(15000),
      });
      if (!result.ok || !result.headers.get("content-type")?.startsWith("image/")) {
        failures.push({ id: member.id, status: result.status });
      }
    } catch (error) {
      failures.push({ id: member.id, error: error instanceof Error ? error.message : "request failed" });
    }
  }
}));
console.log(JSON.stringify({ published: published.length, withImageKey: images.length, missingImageKey: published.length - images.length, inaccessibleImages: failures }, null, 2));
if (failures.length) process.exitCode = 1;
