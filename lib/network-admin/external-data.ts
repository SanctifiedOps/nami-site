import "server-only";

import { SignJWT, importPKCS8 } from "jose";
import { getRuntimeEnvironment } from "@/lib/cloudflare-env";

export type GaSnapshot = {
  connected: boolean;
  users: number | null;
  sessions: number | null;
  views: number | null;
  usersChange: number | null;
  directorySearches: number | null;
  profileClicks: number | null;
  error?: string;
};

export type InstagramSnapshot = {
  connected: boolean;
  username: string | null;
  followers: number | null;
  mediaCount: number | null;
  error?: string;
};

async function googleAccessToken() {
  const env = await getRuntimeEnvironment();
  const email = env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!email || !privateKey) return null;
  const key = await importPKCS8(privateKey, "RS256");
  const now = Math.floor(Date.now() / 1000);
  const assertion = await new SignJWT({ scope: "https://www.googleapis.com/auth/analytics.readonly" })
    .setProtectedHeader({ alg: "RS256", typ: "JWT" })
    .setIssuer(email)
    .setSubject(email)
    .setAudience("https://oauth2.googleapis.com/token")
    .setIssuedAt(now)
    .setExpirationTime(now + 3600)
    .sign(key);
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Google Analytics authentication failed");
  return ((await response.json()) as { access_token: string }).access_token;
}

async function gaReport(token: string, propertyId: string, body: object) {
  const response = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Google Analytics returned ${response.status}`);
  return response.json() as Promise<{ rows?: Array<{ dimensionValues?: Array<{ value?: string }>; metricValues?: Array<{ value?: string }> }> }>;
}

function numberAt(report: Awaited<ReturnType<typeof gaReport>>, index: number) {
  return Number(report.rows?.[0]?.metricValues?.[index]?.value ?? 0);
}

function percentChange(current: number, previous: number) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

export async function getGaSnapshot(): Promise<GaSnapshot> {
  const env = await getRuntimeEnvironment();
  const propertyId = env.GA4_PROPERTY_ID;
  if (!propertyId) return { connected: false, users: null, sessions: null, views: null, usersChange: null, directorySearches: null, profileClicks: null, error: "GA4 property ID needs connecting" };
  try {
    const token = await googleAccessToken();
    if (!token) throw new Error("Google service account is not configured");
    const metrics = [{ name: "totalUsers" }, { name: "sessions" }, { name: "screenPageViews" }];
    const [current, previous, events] = await Promise.all([
      gaReport(token, propertyId, { dateRanges: [{ startDate: "30daysAgo", endDate: "yesterday" }], metrics }),
      gaReport(token, propertyId, { dateRanges: [{ startDate: "60daysAgo", endDate: "31daysAgo" }], metrics }),
      gaReport(token, propertyId, {
        dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
        dimensions: [{ name: "eventName" }],
        metrics: [{ name: "eventCount" }],
        dimensionFilter: { filter: { fieldName: "eventName", inListFilter: { values: ["network_directory_searched", "network_member_profile_clicked"] } } },
      }),
    ]);
    const eventCounts = new Map((events.rows ?? []).map((row) => [row.dimensionValues?.[0]?.value, Number(row.metricValues?.[0]?.value ?? 0)]));
    const users = numberAt(current, 0);
    return {
      connected: true,
      users,
      sessions: numberAt(current, 1),
      views: numberAt(current, 2),
      usersChange: percentChange(users, numberAt(previous, 0)),
      directorySearches: eventCounts.get("network_directory_searched") ?? 0,
      profileClicks: eventCounts.get("network_member_profile_clicked") ?? 0,
    };
  } catch (error) {
    return { connected: false, users: null, sessions: null, views: null, usersChange: null, directorySearches: null, profileClicks: null, error: error instanceof Error ? error.message : "GA4 is unavailable" };
  }
}

export async function getInstagramSnapshot(): Promise<InstagramSnapshot> {
  const env = await getRuntimeEnvironment();
  const accountId = env.INSTAGRAM_ACCOUNT_ID;
  const token = env.INSTAGRAM_ACCESS_TOKEN;
  if (!accountId || !token) return { connected: false, username: null, followers: null, mediaCount: null, error: "Instagram account connection needs moving" };
  try {
    const url = new URL(`https://graph.instagram.com/v23.0/${accountId}`);
    url.searchParams.set("fields", "username,followers_count,media_count");
    url.searchParams.set("access_token", token);
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error(`Instagram returned ${response.status}`);
    const data = (await response.json()) as { username?: string; followers_count?: number; media_count?: number };
    return { connected: true, username: data.username ?? null, followers: data.followers_count ?? null, mediaCount: data.media_count ?? null };
  } catch (error) {
    return { connected: false, username: null, followers: null, mediaCount: null, error: error instanceof Error ? error.message : "Instagram is unavailable" };
  }
}
