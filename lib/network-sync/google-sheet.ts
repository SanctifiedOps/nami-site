import "server-only";

import { SignJWT, importPKCS8 } from "jose";
import { eq } from "drizzle-orm";
import { getNetworkDb, schema } from "@/lib/network-db";
import { getRuntimeEnvironment } from "@/lib/cloudflare-env";
import { findMemberSheetRow } from "./find-sheet-row";

const COLUMNS = [
  "Member ID", "First Name", "Email", "Directory Display Name", "Location", "Main Directory Group",
  "Speciality", "Bio", "Website", "Instagram", "Facebook", "LinkedIn", "TikTok", "YouTube",
  "Account Status", "Profile Image Key", "Portfolio Image 1", "Portfolio Image 1 Alt", "Portfolio Image 2",
  "Portfolio Image 2 Alt", "Portfolio Image 3", "Portfolio Image 3 Alt", "Portfolio Image 4",
  "Portfolio Image 4 Alt", "Last Member Update", "Last Successful Sync", "Sync Status",
] as const;

async function googleToken() {
  const env = await getRuntimeEnvironment();
  const email = env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!email || !privateKey) throw new Error("Google service-account credentials are incomplete.");
  const now = Math.floor(Date.now() / 1000);
  const key = await importPKCS8(privateKey, "RS256");
  const assertion = await new SignJWT({ scope: "https://www.googleapis.com/auth/spreadsheets" })
    .setProtectedHeader({ alg: "RS256", typ: "JWT" }).setIssuer(email)
    .setAudience("https://oauth2.googleapis.com/token").setIssuedAt(now).setExpirationTime(now + 3600).sign(key);
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion }),
  });
  if (!response.ok) throw new Error(`Google authentication failed (${response.status}).`);
  const result = (await response.json()) as { access_token?: string };
  if (!result.access_token) throw new Error("Google did not return an access token.");
  return result.access_token;
}

async function sheetsRequest(sheetId: string, path: string, token: string, init?: RequestInit) {
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  if (!response.ok) throw new Error(`Google Sheets request failed (${response.status}).`);
  return response;
}

const columnLetters = (count: number) => {
  let value = count; let output = "";
  while (value > 0) { value--; output = String.fromCharCode(65 + (value % 26)) + output; value = Math.floor(value / 26); }
  return output;
};

async function ensureSheetTab(sheetId: string, sheetName: string, token: string) {
  const metadataResponse = await sheetsRequest(sheetId, "?fields=sheets.properties.title", token);
  const metadata = (await metadataResponse.json()) as { sheets?: Array<{ properties?: { title?: string } }> };
  if (metadata.sheets?.some((sheet) => sheet.properties?.title === sheetName)) return;
  await sheetsRequest(sheetId, ":batchUpdate", token, {
    method: "POST",
    body: JSON.stringify({ requests: [{ addSheet: { properties: { title: sheetName } } }] }),
  });
}

export async function syncMemberToGoogleSheet(memberId: string) {
  const env = await getRuntimeEnvironment();
  const sheetId = env.GOOGLE_SHEET_ID;
  const sheetName = env.GOOGLE_SHEET_NAME || "Creative Network";
  if (!sheetId) throw new Error("GOOGLE_SHEET_ID is not configured.");
  const db = await getNetworkDb();
  const [record] = await db.select({ member: schema.members, profile: schema.memberProfiles }).from(schema.members)
    .innerJoin(schema.memberProfiles, eq(schema.memberProfiles.memberId, schema.members.id))
    .where(eq(schema.members.id, memberId)).limit(1);
  if (!record) throw new Error(`Member ${memberId} was not found.`);
  const images = await db.select().from(schema.profileImages).where(eq(schema.profileImages.memberId, memberId)).orderBy(schema.profileImages.position);
  const token = await googleToken();
  await ensureSheetTab(sheetId, sheetName, token);
  const rangeName = encodeURIComponent(`'${sheetName}'!A:AZ`);
  const currentResponse = await sheetsRequest(sheetId, `/values/${rangeName}`, token);
  const current = (await currentResponse.json()) as { values?: string[][] };
  const rows = current.values ?? [];
  const existingHeaders = rows[0] ?? [];
  const headers = [...existingHeaders];
  for (const column of COLUMNS) if (!headers.includes(column)) headers.push(column);
  if (headers.length !== existingHeaders.length) {
    const headerRange = encodeURIComponent(`'${sheetName}'!A1:${columnLetters(headers.length)}1`);
    await sheetsRequest(sheetId, `/values/${headerRange}?valueInputOption=RAW`, token, { method: "PUT", body: JSON.stringify({ values: [headers] }) });
  }
  const rowIndex = findMemberSheetRow(headers, rows, memberId);
  const targetRow = rowIndex >= 1 ? rowIndex + 1 : Math.max(rows.length + 1, 2);
  const previous = rowIndex >= 1 ? rows[rowIndex] : [];
  const values = [...previous, ...Array(Math.max(0, headers.length - previous.length)).fill("")];
  const set = (column: typeof COLUMNS[number], value: string) => { values[headers.indexOf(column)] = value; };
  const syncedAt = new Date().toISOString();
  set("Member ID", memberId); if (record.member.firstName) set("First Name", record.member.firstName); set("Email", record.member.email); set("Directory Display Name", record.profile.displayName);
  set("Location", record.profile.location); set("Main Directory Group", record.profile.primaryGroup); set("Speciality", record.profile.speciality);
  set("Bio", record.profile.bio); set("Website", record.profile.websiteUrl ?? ""); set("Instagram", record.profile.instagramUrl ?? "");
  set("Facebook", record.profile.facebookUrl ?? ""); set("LinkedIn", record.profile.linkedinUrl ?? ""); set("TikTok", record.profile.tiktokUrl ?? ""); set("YouTube", record.profile.youtubeUrl ?? "");
  set("Account Status", record.member.accountStatus); set("Profile Image Key", record.profile.profileImageKey ?? "");
  images.slice(0, 4).forEach((image, index) => { set(`Portfolio Image ${index + 1}` as typeof COLUMNS[number], image.r2Key); set(`Portfolio Image ${index + 1} Alt` as typeof COLUMNS[number], image.altText); });
  set("Last Member Update", record.profile.updatedAt.toISOString()); set("Last Successful Sync", syncedAt); set("Sync Status", "Synced");
  const updateRange = encodeURIComponent(`'${sheetName}'!A${targetRow}:${columnLetters(headers.length)}${targetRow}`);
  await sheetsRequest(sheetId, `/values/${updateRange}?valueInputOption=RAW`, token, { method: "PUT", body: JSON.stringify({ values: [values.slice(0, headers.length)] }) });
}
