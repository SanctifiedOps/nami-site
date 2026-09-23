import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

// One-time, resumable D1 data import. This copies public profiles and member
// contact records only. Authentication, sessions, invites and email jobs stay empty.
// Pass the newly joined Sheet members through NAMI_NETWORK_NEW_MEMBERS_B64.
const apply = process.argv.includes("--apply");
const wranglerCli = join(process.cwd(), "node_modules", "wrangler", "bin", "wrangler.js");
const excludedStagingIds = new Set(["staging-test-member"]);
const expectedStagingMembers = 181;
const expectedSheetOnlyMembers = 4;
const canonicalGroups = new Map([
  ["art-illustration", "artists"],
  ["photography-film", "photographers"],
  ["designers-studios", "designers"],
  ["makers-craft", "makers"],
  ["music-audio", "music"],
]);
const allowedGroups = new Set([
  "artists", "photographers", "designers", "makers", "music", "performance",
  "writing-content", "community-events", "independent-businesses", "creative-services",
]);

function execute(database, sql, environment) {
  const args = [wranglerCli, "d1", "execute", database];
  if (environment) args.push("--env", environment);
  args.push("--remote", "--command", sql, "--json");
  const response = execFileSync(process.execPath, args, { encoding: "utf8", maxBuffer: 16 * 1024 * 1024 });
  const result = JSON.parse(response)[0];
  if (!result?.success) throw new Error(`D1 query failed for ${database}.`);
  return result.results ?? [];
}

function sqlValue(value) {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new Error("Non-finite numeric import value.");
    return String(value);
  }
  if (typeof value === "boolean") return value ? "1" : "0";
  return `'${String(value).replaceAll("'", "''")}'`;
}

function insert(table, columns, values) {
  return `INSERT OR IGNORE INTO ${table} (${columns.join(", ")}) VALUES (${values.map(sqlValue).join(", ")});`;
}

function validMember(member) {
  if (!/^[a-z0-9-]{2,160}$/.test(member.id)) throw new Error(`Invalid member ID: ${member.id}`);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.email)) throw new Error(`Invalid email for ${member.id}.`);
  if (!Number.isSafeInteger(member.joined_at) || member.joined_at <= 0) throw new Error(`Invalid join date for ${member.id}.`);
  for (const field of ["display_name", "location", "primary_group", "speciality", "bio"]) {
    if (!member[field]) throw new Error(`Missing ${field} for ${member.id}.`);
  }
  if (!allowedGroups.has(member.primary_group)) throw new Error(`Invalid group for ${member.id}.`);
  if (member.profile_image_key && !member.profile_image_key.startsWith(`network-members/${member.id}/`)) {
    throw new Error(`Unexpected image key for ${member.id}.`);
  }
  return member;
}

const encoded = process.env.NAMI_NETWORK_NEW_MEMBERS_B64;
if (!encoded) throw new Error("Set NAMI_NETWORK_NEW_MEMBERS_B64 with the Sheet-only members.");
const sheetOnly = JSON.parse(Buffer.from(encoded, "base64").toString("utf8"));
if (!Array.isArray(sheetOnly) || sheetOnly.length !== expectedSheetOnlyMembers) {
  throw new Error(`Expected ${expectedSheetOnlyMembers} Sheet-only members.`);
}

const stagingRows = execute(
  "nami-network-staging",
  `SELECT m.id, m.first_name, m.email, m.email_normalized, m.account_status,
    m.approval_status, m.joined_at, p.display_name, p.location, p.primary_group,
    p.speciality, p.bio, p.website_url, p.instagram_url, p.facebook_url,
    p.linkedin_url, p.tiktok_url, p.youtube_url, p.profile_image_key,
    p.published, p.featured, p.last_featured_at, p.updated_at AS profile_updated_at
    FROM members m JOIN member_profiles p ON p.member_id = m.id`,
  "staging",
);
const existing = stagingRows.filter((row) => !excludedStagingIds.has(row.id));
if (existing.length !== expectedStagingMembers || stagingRows.length - existing.length !== excludedStagingIds.size) {
  throw new Error("Staging count changed. Reconcile the Sheet before importing.");
}

const memberIds = new Set(existing.map((row) => row.id));
for (const entry of sheetOnly) {
  if (memberIds.has(entry.id)) throw new Error(`Sheet-only member already in staging: ${entry.id}`);
  memberIds.add(entry.id);
}
const members = [...existing, ...sheetOnly].map((entry) => validMember({
  ...entry,
  primary_group: canonicalGroups.get(entry.primary_group) ?? entry.primary_group,
  email: entry.email.trim().toLowerCase(),
  email_normalized: entry.email.trim().toLowerCase(),
  account_status: entry.account_status === "disabled" ? "disabled" : "invited",
  approval_status: "approved",
  published: Number(entry.published) === 1 ? 1 : 0,
  featured: Number(entry.featured) === 1 ? 1 : 0,
}));
if (members.length !== expectedStagingMembers + expectedSheetOnlyMembers || members.some((row) => !row.published)) {
  throw new Error("Unexpected production member count or unpublished profile.");
}

const productionRows = execute("nami-network", "SELECT id, email_normalized FROM members");
for (const row of productionRows) {
  const source = members.find((member) => member.id === row.id);
  if (!source || source.email_normalized !== row.email_normalized) {
    throw new Error(`Production has an unexpected member record: ${row.id}`);
  }
}

console.log(JSON.stringify({
  mode: apply ? "production import" : "dry run",
  stagedRealMembers: existing.length,
  excludedStagingIds: [...excludedStagingIds],
  newSheetMemberIds: sheetOnly.map((row) => row.id),
  targetMembers: members.length,
  alreadyInProduction: productionRows.length,
  sourceProfilesWithPictures: members.filter((row) => row.profile_image_key).length,
}));
if (!apply) process.exit(0);

const statements = [];
for (const member of members) {
  statements.push(insert("members", [
    "id", "first_name", "email", "email_normalized", "account_status",
    "approval_status", "joined_at",
  ], [
    member.id, member.first_name || "", member.email, member.email_normalized,
    member.account_status, member.approval_status, member.joined_at,
  ]));
  statements.push(insert("member_profiles", [
    "member_id", "display_name", "location", "primary_group", "speciality", "bio",
    "website_url", "instagram_url", "facebook_url", "linkedin_url", "tiktok_url",
    "youtube_url", "profile_image_key", "published", "featured", "last_featured_at", "updated_at",
  ], [
    member.id, member.display_name, member.location, member.primary_group,
    member.speciality, member.bio, member.website_url, member.instagram_url,
    member.facebook_url, member.linkedin_url, member.tiktok_url, member.youtube_url,
    member.profile_image_key, member.published, member.featured,
    member.last_featured_at, member.profile_updated_at ?? Date.now(),
  ]));
}

const temporary = mkdtempSync(join(tmpdir(), "nami-network-production-import-"));
try {
  const sqlPath = join(temporary, "import.sql");
  writeFileSync(sqlPath, statements.join("\n"), { mode: 0o600 });
  execFileSync(process.execPath, [wranglerCli, "d1", "execute", "nami-network", "--remote", "--file", sqlPath, "--json"], {
    encoding: "utf8", maxBuffer: 16 * 1024 * 1024, stdio: ["ignore", "pipe", "pipe"],
  });
} finally {
  rmSync(temporary, { recursive: true, force: true });
}

const [memberCount] = execute("nami-network", "SELECT COUNT(*) AS total FROM members");
const [profileCount] = execute("nami-network", "SELECT COUNT(*) AS total FROM member_profiles");
const [inviteCount] = execute("nami-network", "SELECT COUNT(*) AS total FROM member_invites");
const [emailJobCount] = execute("nami-network", "SELECT COUNT(*) AS total FROM email_jobs");
if (memberCount.total !== members.length || profileCount.total !== members.length || inviteCount.total !== 0 || emailJobCount.total !== 0) {
  throw new Error("Production verification failed: member, profile or outbound-job counts differ.");
}
console.log(JSON.stringify({ verifiedMembers: memberCount.total, verifiedProfiles: profileCount.total, invitations: 0, emailJobs: 0 }));
