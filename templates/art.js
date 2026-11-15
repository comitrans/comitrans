import { readFileSync } from "node:fs";

import { raw } from "./html.js";

const drawn = new Map();

export function art(name) {
  if (!drawn.has(name)) {
    const file = new URL(`art/${name}.svg`, import.meta.url);
    drawn.set(name, raw(readFileSync(file, "utf8").trim()));
  }
  return drawn.get(name);
}
