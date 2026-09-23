// Staging-only member journey. Creates one clearly marked test member.
// Never enables integrations or sends an invitation.
import { readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";

const base = "https://nami-creative-site-staging.opsanctus.workers.dev";
const vars = await readFile(new URL("../.dev.vars", import.meta.url), "utf8");
const secret = vars.match(/^NETWORK_ADMIN_SECRET=(.*)$/m)?.[1]?.trim().replace(/^"|"$/g, "");
if (!secret) throw new Error("Local staging admin secret is unavailable.");

const id = `launch-qa-${randomUUID().slice(0, 12)}`;
const name = `NAMI launch QA ${id.slice(-6)}`;
const image = await readFile(new URL("../public/images/network/members/joe-wilson-nami-creative.webp", import.meta.url));
const form = new FormData();
const fields = {
  memberId: id,
  firstName: "Launch",
  displayName: name,
  email: `${id}@example.invalid`,
  instagram: "@namicreative",
  category: "Test creative",
  location: "Newcastle",
  note: "Staging launch test profile. This is not a real member.",
  link: "https://namicreative.co.uk",
  directoryConsent: "true",
};
for (const [key, value] of Object.entries(fields)) form.set(key, value);
form.set("image", new Blob([image], { type: "image/webp" }), "test-profile.webp");

async function expect(label, url, options, status) {
  const response = await fetch(url, { ...options, signal: AbortSignal.timeout(20000) });
  if (response.status !== status) {
    throw new Error(`${label}: ${response.status}, expected ${status}: ${(await response.text()).slice(0, 300)}`);
  }
  console.log(`PASS ${label}: ${response.status}`);
  return response;
}

const auth = { Authorization: `Bearer ${secret}` };
await expect("test application", `${base}/api/network`, { method: "POST", body: form }, 200);
let admin = await expect("admin application list", `${base}/api/internal/network-admin`, { headers: auth }, 200);
let data = await admin.json();
const application = data.applications.find((item) => item.id === id);
if (!application || application.status !== "pending" || !application.profileImageKey) {
  throw new Error("Application or uploaded image missing from staging D1.");
}
console.log("PASS pending application and image key in staging D1");

const approval = await expect("owner approval", `${base}/api/internal/network-admin`, {
  method: "POST",
  headers: { ...auth, "Content-Type": "application/json" },
  body: JSON.stringify({ action: "approve", applicationId: id, primaryGroup: "artists", speciality: "Test creative" }),
}, 200);
if ((await approval.json()).memberId !== id) throw new Error("Approval returned wrong member ID.");
admin = await expect("admin approved member", `${base}/api/internal/network-admin`, { headers: auth }, 200);
data = await admin.json();
const member = data.members.find((item) => item.member?.id === id);
if (!member || member.member.accountStatus !== "unclaimed" || !member.profile?.published || !member.profile.profileImageKey) {
  throw new Error("Approved unclaimed member or public profile missing.");
}
console.log("PASS approved, published, unclaimed member with profile image");

const profileUrl = `${base}/network/directory/member/${id}`;
const page = await expect("public profile page", profileUrl, {}, 200);
const html = await page.text();
if (!html.includes(name) || !html.includes("og:image") || !html.includes("application/ld+json")) {
  throw new Error("Profile name, OG image, or schema missing.");
}
console.log("PASS profile name, OG image, and schema");
const imageUrl = `${base}/api/network/media/${member.profile.profileImageKey.split("/").map(encodeURIComponent).join("/")}`;
const imageResponse = await expect("public profile image", imageUrl, {}, 200);
if (!imageResponse.headers.get("content-type")?.includes("image/webp")) throw new Error("Wrong image content type.");
console.log("PASS public WebP image");

const directory = await expect("directory", `${base}/network/directory`, {}, 200);
if (!(await directory.text()).includes(id)) throw new Error("New card missing from directory HTML.");
console.log(`PASS directory card links to ${id}`);
console.log(`TEST MEMBER ID ${id}`);
