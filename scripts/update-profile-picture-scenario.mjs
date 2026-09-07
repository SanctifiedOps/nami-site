import fs from "node:fs";

const env = Object.fromEntries(
  fs.readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .filter((line) => line && !line.startsWith("#") && line.includes("="))
    .map((line) => {
      const divider = line.indexOf("=");
      return [line.slice(0, divider), line.slice(divider + 1).replace(/^['"]|['"]$/g, "")];
    }),
);
const token = env.MAKE_API_TOKEN;
if (!token) throw new Error("MAKE_API_TOKEN is missing.");

const scenarioId = 9756201;
const base = `https://eu2.make.com/api/v2/scenarios/${scenarioId}`;
const headers = { Authorization: `Token ${token}`, "Content-Type": "application/json" };
const currentResponse = await fetch(`${base}/blueprint`, { headers });
if (!currentResponse.ok) throw new Error(`Blueprint read failed: ${currentResponse.status}`);
const current = await currentResponse.json();
const blueprint = current.response.blueprint;

blueprint.metadata ??= {};
blueprint.metadata.scenario = {
  ...(blueprint.metadata.scenario || {}),
  dlq: true,
  dataloss: false,
  maxErrors: 3,
  sequential: false,
};

const webhook = blueprint.flow.find((module) => module.id === 1);
if (!webhook.metadata.interface.some((field) => field.name === "bioUpdate")) {
  webhook.metadata.interface.splice(9, 0, { name: "bioUpdate", type: "text" });
}

const findMember = blueprint.flow.find((module) => module.id === 3);
findMember.mapper.tableFirstRow = "A1:AF1";

const writeBio = {
  id: 7,
  mapper: {
    input: "Member name: {{5.`0`}}\nCurrent NAMI directory bio: {{5.`8`}}\nMember's optional refreshed description: {{1.bioUpdate}}",
    model: "gpt-5-mini",
    store: false,
    instructions: "Return one complete third-person directory bio for NAMI Creative Network. If the refreshed description is blank, return the current NAMI directory bio exactly as supplied. If a refreshed description is supplied, rewrite it in clear British English using only the supplied information. Preserve the member's meaning and do not invent credentials, clients, achievements or locations. Lead with what the person or business does, then add the most useful distinguishing detail. Aim for 20 to 45 words, but favour a shorter complete sentence when the source is brief. Return the finished bio only, with no label, quotation marks, markdown, em dash, hype, generic praise or first-person language.",
    inputContentType: "text",
    max_output_tokens: 4000,
    createConversation: false,
  },
  module: "openai-gpt-3:createModelResponse",
  version: 1,
  metadata: {
    designer: { x: 1680, y: -180, name: "Refresh NAMI directory bio" },
    parameters: [{ name: "__IMTCONN__", type: "account:openai-gpt-3", label: "Connection", required: true }],
  },
  parameters: { __IMTCONN__: 8417474 },
};

const withoutBio = blueprint.flow.filter((module) => module.id !== 7);
const publicIndex = withoutBio.findIndex((module) => module.id === 5);
withoutBio.splice(publicIndex + 1, 0, writeBio);
blueprint.flow = withoutBio;
const updateMember = blueprint.flow.find((module) => module.id === 4);
Object.assign(updateMember.mapper.values, {
  "Directory Bio": "{{7.result}}",
  "Upload Completed At": "{{1.submittedAt}}",
  "Bio Update Requested": "{{1.bioUpdate}}",
});

const updatePublic = blueprint.flow.find((module) => module.id === 6);
updatePublic.mapper.values["Directory Bio"] = "{{7.result}}";

const updateResponse = await fetch(`${base}?confirmed=true`, {
  method: "PATCH",
  headers,
  body: JSON.stringify({
    blueprint: JSON.stringify(blueprint),
    scheduling: JSON.stringify({ type: "immediately", maximum_runs_per_minute: 15 }),
  }),
});
const result = await updateResponse.json();
if (!updateResponse.ok) throw new Error(`Scenario update failed: ${updateResponse.status} ${JSON.stringify(result)}`);
let activation;
if (!result.scenario?.isActive) {
  const startResponse = await fetch(`${base}/start`, { method: "POST", headers, body: "{}" });
  activation = await startResponse.json();
  if (!startResponse.ok) throw new Error(`Scenario activation failed: ${startResponse.status} ${JSON.stringify(activation)}`);
}
process.stdout.write(JSON.stringify({ id: result.scenario?.id, islinked: result.scenario?.islinked, isinvalid: result.scenario?.isinvalid, activation }));
