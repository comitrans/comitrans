// Render the site's generated files into public/.
//
// Usage:
//   node tools/build.js          write whatever changed
//   node tools/build.js --check  write nothing, fail if anything would change
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import * as prettier from "prettier";

import { loadContent } from "../templates/content.js";
import { render } from "../templates/render.js";

const out = new URL("../public/", import.meta.url);

async function pretty(path, text) {
  const file = fileURLToPath(new URL(path, out));
  return prettier.format(text, { ...(await prettier.resolveConfig(file)), filepath: file });
}

export async function build() {
  const built = {};
  for (const [path, text] of Object.entries(render(loadContent())))
    built[path] = path.endsWith(".html") ? await pretty(path, text) : text;
  return built;
}

async function main() {
  const check = process.argv.includes("--check");
  const stale = [];
  for (const [path, text] of Object.entries(await build())) {
    const target = new URL(path, out);
    if ((await readFile(target, "utf8").catch(() => null)) === text) continue;
    stale.push(path);
    if (check) continue;
    await mkdir(dirname(fileURLToPath(target)), { recursive: true });
    await writeFile(target, text);
  }
  for (const path of stale) console.log(`${check ? "stale" : "wrote"}  public/${path}`);
  if (!stale.length) console.log("public/ is up to date");
  if (check && stale.length) process.exitCode = 1;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main();
