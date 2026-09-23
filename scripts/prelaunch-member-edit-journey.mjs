// Staging-only authenticated member journey.
// Uses a synthetic launch-QA account and never sends email or touches production data.
import { readFile } from "node:fs/promises";
import sharp from "sharp";

const base = "https://nami-creative-site-staging.opsanctus.workers.dev";
const email = "launch-qa-77d36890-849@example.invalid";
const memberId = "launch-qa-77d36890-849";
const password = process.env.PRELAUNCH_TEST_PASSWORD;
if (!password) throw new Error("PRELAUNCH_TEST_PASSWORD is required.");

async function jsonRequest(label, path, options, expected) {
  const response = await fetch(`${base}${path}`, {
    ...options,
    headers: { Origin: base, ...(options.headers ?? {}) },
    signal: AbortSignal.timeout(30000),
  });
  const body = await response.json().catch(() => ({}));
  if (response.status !== expected) {
    throw new Error(`${label}: ${response.status}, expected ${expected}: ${JSON.stringify(body).slice(0, 300)}`);
  }
  console.log(`PASS ${label}: ${response.status}`);
  return { response, body };
}

const signedIn = await jsonRequest("test-member sign in", "/api/network/auth/sign-in/email", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password, rememberMe: false }),
}, 200);
const cookie = signedIn.response.headers.getSetCookie()
  .map((value) => value.split(";", 1)[0])
  .join("; ");
if (!cookie) throw new Error("Sign in did not return a session cookie.");
const authHeaders = { Cookie: cookie };

const dashboard = await fetch(`${base}/network/dashboard`, { headers: authHeaders, redirect: "manual" });
if (dashboard.status !== 200) throw new Error(`dashboard: ${dashboard.status}, expected 200`);
const dashboardHtml = await dashboard.text();
if (!dashboardHtml.includes("Keep your profile fresh") || !dashboardHtml.includes(email)) {
  throw new Error("Dashboard did not render the signed-in test member.");
}
console.log("PASS authenticated member dashboard: 200");

const current = await jsonRequest("member profile read", "/api/network/member-profile", { headers: authHeaders }, 200);
if (current.body.profile?.memberId !== memberId) throw new Error("Profile API returned the wrong member.");

await jsonRequest("invalid profile rejected", "/api/network/member-profile", {
  method: "PUT",
  headers: { ...authHeaders, "Content-Type": "application/json" },
  body: JSON.stringify({ ...current.body.profile, bio: "Too short" }),
}, 400);

const speciality = "Test creative, dashboard verified";
const updatedProfile = {
  ...current.body.profile,
  speciality,
  websiteUrl: "https://namicreative.co.uk",
};
await jsonRequest("valid profile edit", "/api/network/member-profile", {
  method: "PUT",
  headers: { ...authHeaders, "Content-Type": "application/json" },
  body: JSON.stringify(updatedProfile),
}, 200);

const invalidUpload = new FormData();
invalidUpload.set("kind", "profile");
invalidUpload.set("image", new Blob(["not an image"], { type: "text/plain" }), "bad.txt");
await jsonRequest("invalid profile image rejected", "/api/network/member-images", {
  method: "POST", headers: authHeaders, body: invalidUpload,
}, 400);

const source = await readFile(new URL("../public/images/network/members/joe-wilson-nami-creative.webp", import.meta.url));
const square = await sharp(source).resize(1000, 1000, { fit: "cover" }).webp({ quality: 82 }).toBuffer();
const profileUpload = new FormData();
profileUpload.set("kind", "profile");
profileUpload.set("image", new Blob([square], { type: "image/webp" }), "launch-qa-profile.webp");
const profileImage = await jsonRequest("valid profile image upload", "/api/network/member-images", {
  method: "POST", headers: authHeaders, body: profileUpload,
}, 200);
if (profileImage.body.width !== 1000 || profileImage.body.height !== 1000 || !profileImage.body.key) {
  throw new Error("Profile image response has the wrong dimensions or no key.");
}

const portrait = await sharp(source).resize(900, 1500, { fit: "cover" }).webp({ quality: 82 }).toBuffer();
const portfolioUpload = new FormData();
portfolioUpload.set("kind", "portfolio");
portfolioUpload.set("altText", "Staging launch QA portfolio image");
portfolioUpload.set("image", new Blob([portrait], { type: "image/webp" }), "launch-qa-portfolio.webp");
const portfolioImage = await jsonRequest("valid portfolio image upload", "/api/network/member-images", {
  method: "POST", headers: authHeaders, body: portfolioUpload,
}, 200);
if (portfolioImage.body.width !== 900 || portfolioImage.body.height !== 1500 || !portfolioImage.body.id) {
  throw new Error("Portfolio image response has the wrong dimensions or no ID.");
}

await jsonRequest("portfolio image delete", `/api/network/member-images?id=${encodeURIComponent(portfolioImage.body.id)}`, {
  method: "DELETE", headers: authHeaders,
}, 200);

const page = await fetch(`${base}/network/directory/member/${memberId}`, { signal: AbortSignal.timeout(30000) });
const html = await page.text();
if (page.status !== 200 || !html.includes(speciality) || !html.includes(profileImage.body.key)) {
  throw new Error("Public profile did not reflect the member edit and uploaded image.");
}
console.log("PASS public profile reflects saved edit and profile image");

const directory = await fetch(`${base}/network/directory`, { signal: AbortSignal.timeout(30000) });
if (directory.status !== 200 || !(await directory.text()).includes(memberId)) {
  throw new Error("Updated member card is missing from the directory.");
}
console.log("PASS updated member remains in directory");

const mediaPath = profileImage.body.key.split("/").map(encodeURIComponent).join("/");
const media = await fetch(`${base}/api/network/media/${mediaPath}`, { signal: AbortSignal.timeout(30000) });
if (media.status !== 200 || !media.headers.get("content-type")?.includes("image/webp")) {
  throw new Error("Uploaded profile image is not publicly readable as WebP.");
}
console.log("PASS uploaded profile image is publicly readable");

console.log(`TEST MEMBER ID ${memberId}`);
