// Process staging Sheet jobs only. Email jobs and featured rotation are excluded.
import { readFile } from "node:fs/promises";

const vars = await readFile(new URL("../.dev.vars", import.meta.url), "utf8");
const secret = vars.match(/^NETWORK_ADMIN_SECRET=(.*)$/m)?.[1]?.trim().replace(/^"|"$/g, "");
if (!secret) throw new Error("Staging admin secret unavailable.");
const response = await fetch("https://nami-creative-site-staging.opsanctus.workers.dev/api/internal/network-jobs?jobType=sheet", {
  method: "POST",
  headers: { Authorization: `Bearer ${secret}` },
  signal: AbortSignal.timeout(30000),
});
if (!response.ok) throw new Error(`Sheet job request: ${response.status}`);
const result = await response.json();
console.log(JSON.stringify(result));
