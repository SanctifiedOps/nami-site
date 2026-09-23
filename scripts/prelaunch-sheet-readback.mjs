// Read-only staging Sheet verification for the synthetic member-edit journey.
import { readFile } from "node:fs/promises";
import { SignJWT, importPKCS8 } from "jose";

const keyPath = process.env.GOOGLE_SERVICE_ACCOUNT_FILE;
if (!keyPath) throw new Error("GOOGLE_SERVICE_ACCOUNT_FILE is required.");
const credentials = JSON.parse(await readFile(keyPath, "utf8"));
if (credentials.project_id !== "nami-creative-network") throw new Error("Wrong Google Cloud project.");

const now = Math.floor(Date.now() / 1000);
const key = await importPKCS8(credentials.private_key, "RS256");
const assertion = await new SignJWT({ scope: "https://www.googleapis.com/auth/spreadsheets.readonly" })
  .setProtectedHeader({ alg: "RS256", typ: "JWT" })
  .setIssuer(credentials.client_email)
  .setAudience("https://oauth2.googleapis.com/token")
  .setIssuedAt(now)
  .setExpirationTime(now + 600)
  .sign(key);
const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion }),
  signal: AbortSignal.timeout(20000),
});
if (!tokenResponse.ok) throw new Error(`Google token request returned ${tokenResponse.status}.`);
const token = (await tokenResponse.json()).access_token;

const sheetId = "1uyNibCoH2sVR_z6MTAtPzvQygdogaGrrhwdC7_KoIoY";
const sheetName = process.env.PRELAUNCH_SHEET_NAME || "Creative Network Staging";
const range = encodeURIComponent(`'${sheetName}'!A:AZ`);
const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}`, {
  headers: { Authorization: `Bearer ${token}` },
  signal: AbortSignal.timeout(20000),
});
if (!response.ok) throw new Error(`Google Sheet read returned ${response.status}.`);
const rows = (await response.json()).values ?? [];
const headers = rows[0] ?? [];
const memberIds = (process.env.PRELAUNCH_MEMBER_IDS || "launch-qa-77d36890-849").split(",").map((value) => value.trim()).filter(Boolean);
for (const memberId of memberIds) {
  const idColumns = ["Member ID", "Directory ID"].map((column) => headers.indexOf(column)).filter((index) => index >= 0);
  const matches = rows.slice(1).filter((row) => idColumns.some((index) => row[index] === memberId));
  if (matches.length !== 1) throw new Error(`Expected one Sheet row for ${memberId}, found ${matches.length}.`);
  const row = matches[0];
  const value = (column) => row[headers.indexOf(column)] ?? "";
  if (sheetName === "Creative Network Staging") {
    if (value("Speciality") !== "Test creative, dashboard verified") throw new Error("Sheet speciality is stale.");
    if (value("Instagram") !== "https://www.instagram.com/namicreative/") throw new Error("Sheet Instagram URL was not normalized.");
    if (value("Account Status") !== "active") throw new Error("Sheet account status is stale.");
    if (!value("Profile Image Key")) throw new Error("Sheet profile image key is missing.");
    if (value("Sync Status") !== "Synced" || !value("Last Successful Sync")) throw new Error("Sheet sync status is incomplete.");
    console.log("PASS staging Sheet has one current row for the edited test member, with normalized links, active status and profile image.");
  } else {
    console.log(`PASS ${memberId}: one production Sheet row; profile image ${value("Profile Image Key") ? "present" : "missing"}; sync status ${value("Sync Status") || "legacy/unset"}.`);
  }
}
