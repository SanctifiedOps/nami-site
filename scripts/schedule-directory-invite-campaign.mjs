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
const spreadsheetId = "1uyNibCoH2sVR_z6MTAtPzvQygdogaGrrhwdC7_KoIoY";
const sendTimes = ["2026-09-04T14:30:00+01:00", "2026-09-04T15:00:00+01:00", "2026-09-04T15:30:00+01:00", "2026-09-04T16:00:00+01:00"];

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

function blueprint(batch) {
  return {
    name: `NAMI Directory Invite - 2026-09-04 - Batch ${batch}`,
    flow: [
      {
        id: 1,
        module: "google-sheets:filterRows",
        version: 2,
        parameters: { __IMTCONN__: 14434905 },
        mapper: {
          from: "drive",
          limit: 34,
          filter: [[{ a: "Z", b: "Not invited", o: "text:equal" }]],
          sheetId: "Creative Network",
          sortOrder: "asc",
          spreadsheetId,
          tableFirstRow: "A1:AF1",
          includesHeaders: true,
          valueRenderOption: "FORMATTED_VALUE",
          dateTimeRenderOption: "FORMATTED_STRING",
        },
        metadata: { designer: { x: 0, y: 0, name: `Find next 34 unsent members (batch ${batch})` } },
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
        metadata: { designer: { x: 500, y: 0, name: `Send Outlook invite (batch ${batch})` } },
      },
      {
        id: 3,
        module: "google-sheets:updateRow",
        version: 2,
        parameters: { __IMTCONN__: 14434905 },
        mapper: {
          from: "drive",
          mode: "select",
          values: { "Directory Invite Status": "Sent", "Invite Sent At": "{{now}}", "Invite Error": "" },
          sheetId: "Creative Network",
          rowNumber: "{{1.__ROW_NUMBER__}}",
          spreadsheetId: `/${spreadsheetId}`,
          includesHeaders: true,
          useColumnHeaders: true,
          valueInputOption: "USER_ENTERED",
          insertUnformatted: false,
        },
        metadata: { designer: { x: 1000, y: 0, name: "Record successful send" } },
      },
    ],
    metadata: {
      instant: false,
      version: 1,
      designer: { orphans: [] },
      scenario: { dlq: true, dataloss: false, maxErrors: 3, autoCommit: true, roundtrips: 1, sequential: true },
    },
  };
}

const listResponse = await fetch(`${api}/scenarios?teamId=${teamId}&pg[limit]=100`, { headers });
if (!listResponse.ok) throw new Error(`Scenario list failed: ${listResponse.status}`);
const listed = await listResponse.json();
const results = [];

for (let index = 0; index < sendTimes.length; index += 1) {
  const batch = index + 1;
  const name = `NAMI Directory Invite - 2026-09-04 - Batch ${batch}`;
  const body = {
    name,
    blueprint: JSON.stringify(blueprint(batch)),
    scheduling: JSON.stringify({ date: sendTimes[index], type: "once" }),
  };
  const existing = (listed.scenarios || []).find((scenario) => scenario.name === name);
  let scenarioId = existing?.id;
  let response;
  if (scenarioId) {
    response = await fetch(`${api}/scenarios/${scenarioId}?confirmed=true`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(body),
    });
  } else {
    response = await fetch(`${api}/scenarios?confirmed=true`, {
      method: "POST",
      headers,
      body: JSON.stringify({ ...body, teamId, folderId }),
    });
  }
  const result = await response.json();
  if (!response.ok) throw new Error(`Batch ${batch} configuration failed: ${response.status} ${JSON.stringify(result)}`);
  scenarioId = scenarioId || result.scenario?.id;

  const start = await fetch(`${api}/scenarios/${scenarioId}/start`, { method: "POST", headers, body: "{}" });
  const activation = await start.json();
  if (!start.ok && !(start.status === 422 && JSON.stringify(activation).includes("IM306"))) {
    throw new Error(`Batch ${batch} activation failed: ${start.status} ${JSON.stringify(activation)}`);
  }
  const detailsResponse = await fetch(`${api}/scenarios/${scenarioId}`, { headers });
  const details = await detailsResponse.json();
  if (!detailsResponse.ok) throw new Error(`Batch ${batch} verification failed: ${detailsResponse.status}`);
  results.push({
    batch,
    scenarioId,
    scheduled: details.scenario?.scheduling,
    nextExec: details.scenario?.nextExec,
    isActive: details.scenario?.isActive,
    islinked: details.scenario?.islinked,
    isinvalid: details.scenario?.isinvalid,
  });
}

process.stdout.write(JSON.stringify({ recipientsPerBatch: 34, totalPlanned: 136, results }, null, 2));
