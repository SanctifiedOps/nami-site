// Read-only audit of the legacy Make featured-member scenario.
// Prints schedule and execution metadata only. Never prints tokens or member data.
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

const base = "https://eu2.make.com/api/v2";
const scenarioId = 9831604;
async function get(path) {
  const response = await fetch(`${base}${path}`, {
    headers: { Authorization: `Token ${env.MAKE_API_TOKEN}` },
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`Make API request returned ${response.status}.`);
  return response.json();
}

const [scenariosResult, logsResult] = await Promise.all([
  get("/scenarios?teamId=1535336"),
  get(`/scenarios/${scenarioId}/logs`),
]);
const scenario = (scenariosResult.scenarios ?? []).find((item) => item.id === scenarioId);
const logs = logsResult.scenarioLogs ?? logsResult.logs ?? [];

console.log(JSON.stringify({
  id: scenario?.id ?? scenarioId,
  name: scenario?.name ?? "Unknown",
  active: scenario?.isActive ?? null,
  paused: scenario?.isPaused ?? null,
  invalid: scenario?.isinvalid ?? null,
  scheduling: scenario?.scheduling ?? null,
  recentExecutions: logs.slice(0, 10).map((log) => ({
    id: log.executionId ?? log.id ?? null,
    status: log.status ?? log.state ?? log.type ?? null,
    timestamp: log.timestamp ?? log.startedAt ?? log.createdAt ?? log.date ?? null,
  })),
}, null, 2));
