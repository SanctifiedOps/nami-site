// Read-only Make configuration audit. Never prints tokens, webhook URLs, or member data.
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
async function get(path) {
  const response = await fetch(`${base}${path}`, {
    headers: { Authorization: `Token ${env.MAKE_API_TOKEN}` },
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`Make API ${path.split("?")[0]} returned ${response.status}.`);
  return response.json();
}

const expected = [
  { id: 9186508, name: "Contact", variable: "CONTACT_WEBHOOK_URL", ownerEmail: true },
  { id: 9548802, name: "Creative Network application", variable: "CREATIVE_NETWORK_WEBHOOK_URL", ownerEmail: true },
  { id: 9756201, name: "Profile Pictures", variable: "PROFILE_IMAGE_WEBHOOK_URL", ownerEmail: false },
  { id: 9756235, name: "Public Directory Feed", variable: "DIRECTORY_FEED_WEBHOOK_URL", ownerEmail: false },
];
const other = [
  { id: 9831604, name: "Weekly Featured Member", schedule: "indefinitely", ownerEmail: true },
  { id: 9188967, name: "Newsletter Welcome", schedule: "immediately", dynamicEmail: true },
  { id: 9758590, name: "Directory Invite Campaign [LOCKED]", schedule: "on-demand", dynamicEmail: true },
];

const [scenarioResult, hookResult] = await Promise.all([
  get("/scenarios?teamId=1535336"),
  get("/hooks?teamId=1535336&typeName=gateway-webhook"),
]);
const scenarios = new Map((scenarioResult.scenarios ?? []).map((scenario) => [scenario.id, scenario]));
const hooks = hookResult.hooks ?? [];
let failures = 0;
function check(name, passed) {
  console.log(`${passed ? "PASS" : "FAIL"} ${name}`);
  if (!passed) failures++;
}

for (const item of expected) {
  const scenario = scenarios.get(item.id);
  const matchedHook = hooks.find((hook) => hook.scenarioId === item.id && hook.url === env[item.variable]);
  check(`${item.name}: active and valid`, scenario?.isActive === true && !scenario.isinvalid && !scenario.isPaused);
  check(`${item.name}: ${item.variable} matches Make hook`, Boolean(matchedHook));
}

for (const item of other) {
  const scenario = scenarios.get(item.id);
  check(`${item.name}: active, valid, ${item.schedule}`, scenario?.isActive === true &&
    !scenario.isinvalid && !scenario.isPaused && scenario.scheduling?.type === item.schedule);
}

for (const item of [...expected, ...other]) {
  const blueprint = (await get(`/scenarios/${item.id}/blueprint`)).response?.blueprint;
  const emailModules = blueprint?.flow?.filter((module) => module.module === "microsoft-email:createAndSendAMessage") ?? [];
  if (item.ownerEmail) {
    check(`${item.name}: email goes to owner`, emailModules.length === 1 &&
      JSON.stringify(emailModules[0].mapper?.toRecipients).includes("hello@namicreative.co.uk"));
  } else if (item.dynamicEmail) {
    check(`${item.name}: recipient is mapped`, emailModules.length === 1 &&
      JSON.stringify(emailModules[0].mapper?.toRecipients).includes("{{"));
  } else {
    check(`${item.name}: no email module`, emailModules.length === 0);
  }
  const scenario = scenarios.get(item.id);
  if (scenario?.dlqCount) console.warn(`WARN ${item.name}: ${scenario.dlqCount} incomplete executions`);
}

console.log(`${failures ? "FAIL" : "PASS"} Make read-only configuration audit`);
process.exitCode = failures ? 1 : 0;
