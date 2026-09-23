import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const assetsDirectory = resolve(".open-next", "assets");
await mkdir(assetsDirectory, { recursive: true });
await writeFile(
  resolve(assetsDirectory, ".assetsignore"),
  [
    "assets/images/Video/*.mov",
    "_worker.js",
    "_routes.json",
    "",
  ].join("\n"),
  "utf8",
);
