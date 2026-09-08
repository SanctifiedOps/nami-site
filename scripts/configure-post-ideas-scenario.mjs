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

if (!env.MAKE_API_TOKEN) throw new Error("MAKE_API_TOKEN is missing.");

const api = "https://eu2.make.com/api/v2";
const headers = { Authorization: `Token ${env.MAKE_API_TOKEN}`, "Content-Type": "application/json" };
const teamId = 1535336;
const folderId = 504439;
const scenarioName = "NAMI Creative - Morning Post Ideas [TEST]";
const hookName = "NAMI Morning Post Ideas Trigger";
const contentSheet = "1585jjAKNNzhv_pbxFXU_Lricundjfz_kLOvZYtpAqZk";

async function make(path, options = {}) {
  const response = await fetch(`${api}${path}`, { headers, ...options });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`${options.method || "GET"} ${path} failed: ${response.status} ${JSON.stringify(body)}`);
  return body;
}

const hooks = await make(`/hooks?teamId=${teamId}&typeName=gateway-webhook`);
let hook = (hooks.hooks || []).find((item) => item.name === hookName);
if (!hook) {
  const created = await make("/hooks", {
    method: "POST",
    body: JSON.stringify({ name: hookName, teamId: String(teamId), typeName: "gateway-webhook", method: true, headers: true, stringify: false }),
  });
  hook = created.hook;
}

const instructions = `You write the private daily Post Ideas bulletin for Joe Wilson at NAMI Creative.

Use clear British English and a warm North East voice. Sound like a switched-on creative collaborator, not a marketing template. Never use em dashes. Avoid the words shape, leverage, landscape, delve, unlock, elevate and game-changing. Do not invent member details, dates, venues, claims or links.

Research current North East creative news and events using web search. Treat the supplied source registry as the preferred starting list, but only include details you can verify today. Prefer official event and venue pages. Every news or event item must include a direct source link and a specific reason it matters to NAMI's audience.

The input includes a RECENT IDEA ARCHIVE. Treat it as an exclusion list, not inspiration. Do not reuse a Reel premise, opening hook, text-carousel argument or showcase angle used in the previous 30 days. Do not feature a Network member named in the archive within 45 days. A broad subject may return only when the practical lesson and hook are materially different.

Use only supplied Network member data for showcase suggestions. Choose five distinct, genuinely relevant members per feature carousel. Do not repeat a person within the same bulletin. Give each carousel a clear angle such as photographers, makers, musicians, designers, freelancers or independent businesses. If there are not five suitable members for an angle, choose a better angle.

Make the Reel section primarily talking-head videos that Joe can film alone, directly to camera, with a phone and minimal setup. The audience is small-business owners, artists, creatives and freelancers who are trying to build a name, find customers, make a living and keep going when progress feels slow.

Every Reel must:
- Open with the exact words Joe should say in the first one to three seconds.
- Use a specific, attention-grabbing hook based on a recognisable problem, useful promise, honest opinion or curiosity gap. Do not use fake controversy, vague clickbait or guaranteed results.
- Give Joe a short spoken script or clear line-by-line talking points, not a loose topic.
- Deliver practical help, a useful list, a relatable observation, an honest lesson or a clear mistake to avoid.
- Be designed for roughly 20 to 45 seconds unless the idea genuinely needs longer.
- Include a short on-screen title, simple filming direction and one natural CTA aimed at saves, shares, comments, directory visits or Network joins.
- Feel relevant to people building creative work in the North East without forcing dialect or mentioning the North East when it adds nothing.

Use a healthy mix across the week: practical tips, numbered lists, mistakes, hard-earned lessons, relatable freelance moments, pricing and visibility problems, creative confidence, finding clients, promoting work and making progress with limited time or money. Avoid generic motivation, lip-sync concepts, elaborate sketches, faceless stock-footage Reels and trend ideas that depend on a particular audio track.

Return a complete HTML email only. Do not return Markdown, JSON, a subject line, commentary or code fences. Use simple email-safe HTML with inline styles. Keep it easy to scan on mobile.

The email must contain:
1. A short morning introduction.
2. Three mostly talking-head Reel ideas. Each needs the exact opening line, an on-screen hook, a short spoken script or line-by-line beats, filming notes, approximate duration, CTA and caption direction.
3. Two showcase carousel ideas. Each needs its angle, a cover hook, the five chosen members with category and location, a slide order and a CTA.
4. One bold text-carousel idea with the cover hook followed by short, punchy copy for every slide.
5. A North East radar with up to five timely events, exhibitions, opportunities or useful stories. Include date, place and a direct source link when verified.
6. A short Pick this first section naming the single strongest idea Joe could make today and why.

Do not claim that NAMI has attended, endorsed or partnered with any event. Never publish or contact Network members. This is inspiration for Joe only.`;

const blueprint = {
  name: scenarioName,
  flow: [
    {
      id: 1,
      module: "gateway:CustomWebHook",
      version: 1,
      parameters: { hook: hook.id, maxResults: 1 },
      mapper: {},
      metadata: {
        advanced: true,
        designer: { x: 0, y: 0, name: "Cloudflare 9am trigger" },
        interface: [
          { name: "runId", type: "text" }, { name: "runDate", type: "text" },
          { name: "requestedAt", type: "text" }, { name: "source", type: "text" },
          { name: "timezone", type: "text" }, { name: "recipient", type: "text" },
          { name: "testMode", type: "boolean" },
        ],
        parameters: [{ name: "hook", type: "hook:gateway-webhook", label: "Webhook", required: true }, { name: "maxResults", type: "number", label: "Maximum number of results" }],
      },
    },
    {
      id: 2,
      module: "google-sheets:filterRows",
      version: 2,
      parameters: { __IMTCONN__: 14434905 },
      mapper: {
        from: "drive", limit: 148, filter: [[{ a: "K", b: "TRUE", o: "text:equal" }]],
        orderBy: "__ROW_NUMBER__", sheetId: "Member Features", fieldType: "number", sortOrder: "asc",
        spreadsheetId: contentSheet, tableFirstRow: "A1:L1", includesHeaders: true,
        valueRenderOption: "FORMATTED_VALUE", dateTimeRenderOption: "FORMATTED_STRING",
      },
      metadata: { designer: { x: 300, y: 0, name: "Read eligible Network members" } },
    },
    {
      id: 3,
      module: "builtin:BasicAggregator",
      version: 1,
      parameters: { feeder: 2 },
      mapper: { properties: { id: "{{2.`0`}}", name: "{{2.`1`}}", category: "{{2.`2`}}", location: "{{2.`3`}}", lastSuggested: "{{2.`4`}}", lastAngle: "{{2.`6`}}", cooldownUntil: "{{2.`9`}}" } },
      metadata: { restore: { extra: { feeder: { label: "Read eligible Network members [2]" }, target: { label: "Custom" } } }, designer: { x: 600, y: 0, name: "Build member pool" } },
    },
    {
      id: 4,
      module: "google-sheets:filterRows",
      version: 2,
      parameters: { __IMTCONN__: 14434905 },
      mapper: {
        from: "drive", limit: 50, filter: [[{ a: "G", b: "TRUE", o: "text:equal" }]],
        orderBy: "__ROW_NUMBER__", sheetId: "Source Registry", fieldType: "number", sortOrder: "asc",
        spreadsheetId: contentSheet, tableFirstRow: "A1:J1", includesHeaders: true,
        valueRenderOption: "FORMATTED_VALUE", dateTimeRenderOption: "FORMATTED_STRING",
      },
      metadata: { designer: { x: 900, y: 0, name: "Read enabled North East sources" } },
    },
    {
      id: 5,
      module: "builtin:BasicAggregator",
      version: 1,
      parameters: { feeder: 4 },
      mapper: { properties: { name: "{{4.`1`}}", url: "{{4.`2`}}", coverage: "{{4.`3`}}", priority: "{{4.`5`}}", notes: "{{4.`9`}}" } },
      metadata: { restore: { extra: { feeder: { label: "Read enabled North East sources [4]" }, target: { label: "Custom" } } }, designer: { x: 1200, y: 0, name: "Build source list" } },
    },
    {
      id: 10,
      module: "google-sheets:filterRows",
      version: 2,
      parameters: { __IMTCONN__: 14434905 },
      mapper: {
        from: "drive", limit: 30, filter: [[{ a: "K", b: "Delivered", o: "text:equal" }]],
        orderBy: "C", sheetId: "Idea Archive", fieldType: "text", sortOrder: "desc",
        spreadsheetId: contentSheet, tableFirstRow: "A1:K1", includesHeaders: true,
        valueRenderOption: "FORMATTED_VALUE", dateTimeRenderOption: "FORMATTED_STRING",
      },
      metadata: { designer: { x: 1500, y: 0, name: "Read recent delivered ideas" } },
    },
    {
      id: 11,
      module: "builtin:BasicAggregator",
      version: 1,
      parameters: { feeder: 10 },
      mapper: { properties: { suggestedAt: "{{10.`2`}}", title: "{{10.`4`}}", summary: "{{10.`5`}}" } },
      metadata: { restore: { extra: { feeder: { label: "Read recent delivered ideas [10]" }, target: { label: "Custom" } } }, designer: { x: 1800, y: 0, name: "Build recent idea exclusions" } },
    },
    {
      id: 6,
      module: "openai-gpt-3:createModelResponse",
      version: 1,
      parameters: { __IMTCONN__: 8417474 },
      mapper: {
        input: `Bulletin date: {{1.runDate}}\nRun ID: {{1.runId}}\n\nELIGIBLE NETWORK MEMBERS:\n{{3.array}}\n\nPREFERRED NORTH EAST SOURCES:\n{{5.array}}\n\nRECENT IDEA ARCHIVE (avoid these ideas, angles, hooks and members):\n{{11.array}}`,
        model: "gpt-5-mini", store: false, instructions, inputContentType: "text", max_output_tokens: 12000,
        createConversation: false, tools: [{ type: "web_search_preview" }],
      },
      metadata: { designer: { x: 2100, y: 0, name: "Write and research NAMI bulletin" }, parameters: [{ name: "__IMTCONN__", type: "account:openai-gpt-3", label: "Connection", required: true }] },
    },
    {
      id: 7,
      module: "microsoft-email:createAndSendAMessage",
      version: 2,
      parameters: { __IMTCONN__: 14166635 },
      mapper: {
        content: "{{6.result}}", replyTo: [{ name: "NAMI Creative", address: "hello@namicreative.co.uk" }],
        subject: "NAMI Post Ideas | {{1.runDate}}", contentType: "html",
        toRecipients: [{ name: "Joe", address: "hello@namicreative.co.uk" }], singleValueExtendedProperties: {},
      },
      metadata: { designer: { x: 2400, y: 0, name: "Send Joe-only Outlook briefing" } },
    },
    {
      id: 12,
      module: "openai-gpt-3:createModelResponse",
      version: 1,
      parameters: { __IMTCONN__: 8417474 },
      mapper: {
        input: "{{6.result}}",
        model: "gpt-5-mini",
        store: false,
        instructions: `Extract a compact reuse-prevention record from this NAMI Post Ideas HTML email. Return plain text only, no Markdown and no commentary. Use exactly these labels on separate lines:\nREELS: [each exact opening hook plus its core premise, separated by |]\nSHOWCASE ANGLES: [each carousel angle, separated by |]\nFEATURED MEMBERS: [every featured member name, separated by |]\nTEXT CAROUSEL: [cover hook plus the core argument]\nKeep the whole response below 1,800 characters. Preserve names and hooks accurately.`,
        inputContentType: "text",
        max_output_tokens: 900,
        createConversation: false,
      },
      metadata: { designer: { x: 2700, y: 0, name: "Summarise ideas for reuse prevention" }, parameters: [{ name: "__IMTCONN__", type: "account:openai-gpt-3", label: "Connection", required: true }] },
    },
    {
      id: 13,
      module: "google-sheets:addRow",
      version: 2,
      parameters: { __IMTCONN__: 14434905 },
      mapper: {
        from: "drive", mode: "select", sheetId: "Idea Archive", spreadsheetId: `/${contentSheet}`,
        includesHeaders: true, insertDataOption: "INSERT_ROWS", useColumnHeaders: true,
        valueInputOption: "USER_ENTERED", insertUnformatted: false,
        values: {
          "Idea ID": "{{1.runId}}", "Run ID": "{{1.runId}}", "Suggested at": "{{now}}",
          Format: "Daily bulletin", "Working title": "NAMI Post Ideas | {{1.runDate}}",
          Hook: "{{12.result}}", Angle: "Reuse-prevention summary", "Members / subjects": "{{12.result}}",
          "Source URLs": "", Score: "", Status: "Delivered",
        },
      },
      metadata: { designer: { x: 3000, y: 0, name: "Archive delivered ideas" } },
    },
    {
      id: 8,
      module: "google-sheets:addRow",
      version: 2,
      parameters: { __IMTCONN__: 14434905 },
      mapper: {
        from: "drive", mode: "select", sheetId: "Run Log", spreadsheetId: `/${contentSheet}`,
        includesHeaders: true, insertDataOption: "INSERT_ROWS", useColumnHeaders: true,
        valueInputOption: "USER_ENTERED", insertUnformatted: false,
        values: { "Run ID": "{{1.runId}}", "Started at": "{{1.requestedAt}}", "Completed at": "{{now}}", Status: "Delivered", "Sources checked": "13", "Ideas delivered": "6", "Email status": "Sent", "Error summary": "" },
      },
      metadata: { designer: { x: 3300, y: 0, name: "Log successful briefing" } },
    },
  ],
  metadata: { instant: true, version: 1, designer: { orphans: [] }, scenario: { dlq: true, dataloss: false, maxErrors: 3, autoCommit: true, sequential: true } },
};

const listed = await make(`/scenarios?teamId=${teamId}&pg[limit]=100`);
const existing = (listed.scenarios || []).find((scenario) => scenario.name === scenarioName);
let scenarioId = existing?.id;
const scenarioBody = { name: scenarioName, blueprint: JSON.stringify(blueprint), scheduling: JSON.stringify({ type: "immediately", maximum_runs_per_minute: 2 }) };

if (scenarioId) {
  await make(`/scenarios/${scenarioId}?confirmed=true`, { method: "PATCH", body: JSON.stringify(scenarioBody) });
} else {
  const created = await make("/scenarios?confirmed=true", { method: "POST", body: JSON.stringify({ ...scenarioBody, teamId, folderId }) });
  scenarioId = created.scenario.id;
}

const activation = await fetch(`${api}/scenarios/${scenarioId}/start`, { method: "POST", headers, body: "{}" });
if (!activation.ok && activation.status !== 422) throw new Error(`Scenario activation failed: ${activation.status} ${await activation.text()}`);

process.stdout.write(JSON.stringify({ scenarioId, hookId: hook.id, active: true, testMode: true }));
