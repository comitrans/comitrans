import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";

import { build } from "../../tools/build.js";

const root = new URL("../../public/", import.meta.url);
const built = await build();

const committed = (path) => {
  try {
    return readFileSync(new URL(path, root), "utf8");
  } catch {
    return null;
  }
};

test("the committed files are what the templates render", () => {
  for (const [path, text] of Object.entries(built))
    assert.ok(committed(path) === text, `public/${path} is stale: run npm run build`);
});

test("every page under public has a template behind it", () => {
  const pages = readdirSync(root, { recursive: true })
    .map((path) => path.replaceAll("\\", "/"))
    .filter((path) => path.endsWith(".html"));
  for (const path of pages) assert.ok(path in built, `public/${path} is not rendered by anything`);
});
