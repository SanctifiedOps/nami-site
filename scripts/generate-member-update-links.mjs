import crypto from "node:crypto";
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
const secret = env.NETWORK_PROFILE_UPDATE_SECRET || env.MAKE_API_TOKEN;
if (!secret) throw new Error("No signing secret is available.");

const source = fs.readFileSync("lib/content/network-directory.ts", "utf8");
const declaration = source.indexOf("networkDirectoryMembers");
const start = source.indexOf("[", source.indexOf("= ", declaration));
const end = source.lastIndexOf("];");
const members = Function(`return ${source.slice(start, end + 1)}`)();

const links = members.map(({ id }) => {
  const signature = crypto.createHmac("sha256", secret).update(`v1:${id}`).digest("base64url");
  const token = `v1.${Buffer.from(id).toString("base64url")}.${signature}`;
  return {
    id,
    token,
    url: `https://namicreative.co.uk/network/profile-picture?token=${encodeURIComponent(token)}`,
  };
});

process.stdout.write(JSON.stringify(links));
