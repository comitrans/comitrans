import { readFileSync } from "node:fs";

const root = new URL("../content/", import.meta.url);
const read = (path) => JSON.parse(readFileSync(new URL(path, root), "utf8"));

export function loadContent() {
  const site = read("site.json");
  const strings = Object.fromEntries(
    site.locales.map(({ code }) => [code, read(`locales/${code}.json`)]),
  );
  return { site, strings };
}
