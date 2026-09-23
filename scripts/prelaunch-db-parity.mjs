// Read-only member ID comparison between production and staging D1.
import { execFileSync } from "node:child_process";
import { join } from "node:path";

const wrangler = join(process.cwd(), "node_modules", "wrangler", "bin", "wrangler.js");
function ids(staging) {
  const args = [wrangler, "d1", "execute", "DB"];
  if (staging) args.push("--env", "staging");
  args.push("--remote", "--command", "SELECT id FROM members ORDER BY id", "--json");
  const raw = execFileSync(process.execPath, args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  return new Set(JSON.parse(raw)[0].results.map(({ id }) => id));
}

const production = ids(false);
const staging = ids(true);
const productionOnly = [...production].filter((id) => !staging.has(id));
const stagingOnly = [...staging].filter((id) => !production.has(id));
console.log(JSON.stringify({
  production: production.size,
  staging: staging.size,
  shared: production.size - productionOnly.length,
  productionOnly,
  stagingOnly,
}, null, 2));
