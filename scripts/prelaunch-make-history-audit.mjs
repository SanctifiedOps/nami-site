// Read-only Make execution-history audit. Never prints payloads, member data or tokens.
import { readFileSync } from "node:fs";

const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf8")
    .split(/\r?\n/)
    .filter((line) => /^[A-Z0-9_]+=/.test(line))
    .map((line) => {
      const split = line.indexOf("=");
      return [line.slice(0, split), line.slice(split + 1).replace(/^"|"$/g, "")];
    }),
);
if (!env.MAKE_API_TOKEN) throw new Error("MAKE_API_TOKEN is missing.");

const scenarios = [
  { id: 9186508, name: "Contact" },
  { id: 9548802, name: "Creative Network application" },
  { id: 9756201, name: "Profile Pictures" },
  { id: 9756235, name: "Public Directory Feed" },
  { id: 9831604, name: "Weekly Featured Member" },
  { id: 9188967, name: "Newsletter Welcome" },
  { id: 9758590, name: "Directory Invite Campaign [LOCKED]" },
];

const base = "https://eu2.make.com/api/v2";
async function get(path) {
  const response = await fetch(`${base}${path}`, {
    headers: { Authorization: `Token ${env.MAKE_API_TOKEN}` },
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(`Make API ${path.split("?")[0]} returned ${response.status}: ${error.code ?? "unknown"} ${error.message ?? ""}`.trim());
  }
  return response.json();
}

let failures = 0;
function logDate(log) {
  return new Date(log.timestamp ?? log.startedAt ?? log.createdAt ?? log.date ?? 0);
}

function logStatus(log) {
  return String(log.status ?? log.state ?? log.type ?? "").toLowerCase();
}

for (const scenario of scenarios) {
  const data = await get(`/scenarios/${scenario.id}/logs`);
  const logs = data.scenarioLogs ?? data.logs ?? [];
  const recent = logs.filter((log) => {
    const date = logDate(log);
    return Number.isFinite(date.getTime()) && date.getTime() >= Date.now() - 30 * 24 * 60 * 60 * 1000;
  });
  const errors = recent.filter((log) => {
    const status = logStatus(log);
    return status === "3" || status.includes("error") || status.includes("fail");
  });
  const warnings = recent.filter((log) => {
    const status = logStatus(log);
    return status === "2" || status.includes("warn");
  });
  const successes = recent.filter((log) => {
    const status = logStatus(log);
    return status === "1" || status.includes("success");
  });
  const latestSuccess = successes.reduce((latest, log) => Math.max(latest, logDate(log).getTime()), 0);
  const unresolvedErrors = errors.filter((log) => logDate(log).getTime() >= latestSuccess);
  const line = `${unresolvedErrors.length ? "FAIL" : "PASS"} ${scenario.name}: ${recent.length} runs in 30 days, ${errors.length} historical errors, ${unresolvedErrors.length} unresolved, ${warnings.length} warnings`;
  console.log(line);
  for (const log of errors) {
    const executionId = log.executionId ?? log.id;
    const when = log.timestamp ?? log.startedAt ?? log.createdAt ?? log.date ?? "unknown";
    if (!executionId) {
      console.log(`  ERROR ${when}: execution ID unavailable`);
      continue;
    }
    const detail = await get(`/scenarios/${scenario.id}/logs/${encodeURIComponent(executionId)}`);
    const detailText = JSON.stringify(detail).toLowerCase();
    const classification = detailText.includes("mailchimp") ? "Mailchimp module"
      : detailText.includes("microsoft-email") || detailText.includes("outlook") ? "Microsoft email module"
        : detailText.includes("google-sheets") || detailText.includes("googlesheets") ? "Google Sheets module"
          : detailText.includes("webhook") ? "webhook module"
            : "unclassified module";
    const resolved = logDate(log).getTime() < latestSuccess;
    console.log(`  ${resolved ? "RESOLVED" : "ERROR"} ${executionId} at ${when}: ${classification}`);
  }
  if (unresolvedErrors.length) failures++;
}

console.log(`${failures ? "FAIL" : "PASS"} Make recent execution-history audit`);
process.exitCode = failures ? 1 : 0;
