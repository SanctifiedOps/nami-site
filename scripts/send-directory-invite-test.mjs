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
const scenarioName = "NAMI Creative Network - Directory Invite Campaign [LOCKED]";
const emailHtml = `
<div style="display:none;max-height:0;overflow:hidden;opacity:0">Add your profile picture and check the bio on your directory card.</div>
<div style="font-family:Arial,sans-serif;font-size:16px;line-height:1.65;color:#17171a;max-width:620px;margin:0 auto;padding:24px">
  <p>Hiya {{get(split(1.\`1\`; " "); 1)}},</p>
  <p>The <a href="https://namicreative.co.uk/network/directory" style="color:#d6009a;font-weight:700">NAMI Creative Network directory</a> is now live.</p>
  <p>Your name, location, links and a short description of what you do have been added to your own directory card.</p>
  <p>I&rsquo;d love you to add a profile picture to your listing.</p>
  <p>You can also send me a refreshed description if your work has changed or you&rsquo;d like the wording updated. I&rsquo;ll use it to write a new short bio in the NAMI voice.</p>
  <p style="margin:30px 0"><a href="{{1.\`24\`}}" style="display:inline-block;background:#f000b8;color:#ffffff;text-decoration:none;font-weight:700;padding:14px 22px;border-radius:999px">Update my directory profile</a></p>
  <p>This is your personal link, so it will take you straight to your own profile.</p>
  <p>Thanks again for being part of the network. The aim is to build a proper roster of North East creatives, freelancers and independent businesses that people can find and work with.</p>
  <p>Best regards,</p>
  <p><strong>Joe Wilson</strong><br>NAMI Creative</p>
  <p style="font-size:14px;color:#5c5c66">P.S. You can browse the full <a href="https://namicreative.co.uk/network/directory" style="color:#d6009a">NAMI Creative Network directory</a> here.</p>
</div>`.trim();

const blueprint = {
  name: scenarioName,
  flow: [
    {
      id: 1,
      module: "google-sheets:filterRows",
      version: 2,
      parameters: { __IMTCONN__: 14434905 },
      mapper: {
        from: "drive",
        limit: 1,
        filter: [[{ a: "C", b: "hello@namicreative.co.uk", o: "text:equal" }]],
        sheetId: "Creative Network",
        sortOrder: "asc",
        spreadsheetId: "1uyNibCoH2sVR_z6MTAtPzvQygdogaGrrhwdC7_KoIoY",
        tableFirstRow: "A1:AF1",
        includesHeaders: true,
        valueRenderOption: "FORMATTED_VALUE",
        dateTimeRenderOption: "FORMATTED_STRING",
      },
      metadata: { designer: { x: 0, y: 0, name: "Find Joe test record" } },
    },
    {
      id: 2,
      module: "microsoft-email:createAndSendAMessage",
      version: 2,
      parameters: { __IMTCONN__: 14166635 },
      mapper: {
        content: emailHtml,
        replyTo: [{ name: "NAMI Creative", address: "hello@namicreative.co.uk" }],
        subject: "Your NAMI Creative Network profile is ready",
        contentType: "html",
        toRecipients: [{ name: "{{1.`1`}}", address: "{{1.`2`}}" }],
        singleValueExtendedProperties: {},
      },
      metadata: { designer: { x: 500, y: 0, name: "Send Joe-only Outlook test" } },
    },
    {
      id: 3,
      module: "google-sheets:updateRow",
      version: 2,
      parameters: { __IMTCONN__: 14434905 },
      mapper: {
        from: "drive",
        mode: "select",
        values: { "Directory Invite Status": "Test resent", "Invite Sent At": "{{now}}", "Invite Error": "" },
        sheetId: "Creative Network",
        rowNumber: "{{1.__ROW_NUMBER__}}",
        spreadsheetId: "/1uyNibCoH2sVR_z6MTAtPzvQygdogaGrrhwdC7_KoIoY",
        includesHeaders: true,
        useColumnHeaders: true,
        valueInputOption: "USER_ENTERED",
        insertUnformatted: false,
      },
      metadata: { designer: { x: 1000, y: 0, name: "Mark test email sent" } },
    },
  ],
  metadata: { instant: false, version: 1, designer: { orphans: [] }, scenario: { maxErrors: 1, autoCommit: true, sequential: true } },
};

const listResponse = await fetch(`${api}/scenarios?teamId=1535336`, { headers });
if (!listResponse.ok) throw new Error(`Scenario list failed: ${listResponse.status}`);
const listed = await listResponse.json();
const existing = (listed.scenarios || []).find((scenario) => scenario.name === scenarioName);
let scenarioId = existing?.id;

if (scenarioId) {
  const update = await fetch(`${api}/scenarios/${scenarioId}?confirmed=true`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ blueprint: JSON.stringify(blueprint), scheduling: JSON.stringify({ type: "on-demand" }) }),
  });
  if (!update.ok) throw new Error(`Scenario update failed: ${update.status} ${await update.text()}`);
} else {
  const create = await fetch(`${api}/scenarios?confirmed=true`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      teamId: 1535336,
      folderId: 504439,
      name: scenarioName,
      blueprint: JSON.stringify(blueprint),
      scheduling: JSON.stringify({ type: "on-demand" }),
    }),
  });
  const result = await create.json();
  if (!create.ok) throw new Error(`Scenario creation failed: ${create.status} ${JSON.stringify(result)}`);
  scenarioId = result.scenario.id;
}

const activate = await fetch(`${api}/scenarios/${scenarioId}/start`, { method: "POST", headers, body: "{}" });
if (!activate.ok) {
  const activationError = await activate.text();
  if (activate.status !== 422 || !activationError.includes("IM306")) {
    throw new Error(`Scenario activation failed: ${activate.status} ${activationError}`);
  }
}

let runResult;
try {
  const run = await fetch(`${api}/scenarios/${scenarioId}/run?wait=true`, { method: "POST", headers, body: "{}" });
  runResult = await run.json();
  if (!run.ok) throw new Error(`Scenario run failed: ${run.status} ${JSON.stringify(runResult)}`);
} finally {
  await fetch(`${api}/scenarios/${scenarioId}/stop`, { method: "POST", headers, body: "{}" });
}
process.stdout.write(JSON.stringify({ scenarioId, run: runResult, campaignLocked: true }));
