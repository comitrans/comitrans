import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, statSync } from "node:fs";
import { posix } from "node:path";

import { loadContent } from "../../templates/content.js";
import { render } from "../../templates/render.js";

const content = loadContent();
const { site } = content;
const files = render(content);
const pages = Object.entries(files).filter(([path]) => path.endsWith(".html"));
const root = new URL("../../public/", import.meta.url);

const attributes = (html, name) =>
  [...html.matchAll(new RegExp(`\\s${name}="([^"]*)"`, "g"))].map(([, value]) => value);

const served = (path) => {
  if (path in files) return true;
  const file = new URL(path, root);
  return existsSync(file) && statSync(file).isFile();
};

// A link to somewhere on the site, as the path under public/ it has to resolve to.
function target(page, link) {
  const [path] = link.split(/[?#]/);
  const joined = link.startsWith("/") ? path.slice(1) : posix.join(posix.dirname(page), path);
  const clean = posix.normalize(joined).replace(/^\.\/?$/, "");
  return clean === "" || clean.endsWith("/") ? `${clean}index.html` : clean;
}

const local = (link) => !/^[a-z][a-z0-9+.-]*:/i.test(link) && !link.startsWith("#");

test("every local link and asset on a page exists", () => {
  for (const [page, html] of pages)
    for (const link of [...attributes(html, "href"), ...attributes(html, "src")].filter(local))
      assert.ok(served(target(page, link)), `${page}: nothing is served at ${link}`);
});

test("every in-page link lands on an element of that page", () => {
  for (const [page, html] of pages) {
    const ids = new Set(attributes(html, "id"));
    for (const link of attributes(html, "href").filter((href) => href.startsWith("#")))
      assert.ok(link === "#top" || ids.has(link.slice(1)), `${page}: no element answers ${link}`);
  }
});

test("no id is used twice on a page", () => {
  for (const [page, html] of pages) {
    const ids = attributes(html, "id");
    assert.equal(new Set(ids).size, ids.length, page);
  }
});

test("every language's page names all of them as alternates", () => {
  const expected = [...site.locales.map(({ hreflang }) => hreflang), "x-default"].sort();
  for (const { path } of site.locales) {
    const html = files[`${path}index.html`];
    const named = [...html.matchAll(/rel="alternate" hreflang="([^"]+)"/g)].map(([, tag]) => tag);
    assert.deepEqual(named.sort(), expected, `${path}index.html`);
  }
});

test("a page carries no inline style, which the content policy would drop", () => {
  for (const [page, html] of pages) {
    assert.ok(!/\sstyle="/.test(html), `${page} has a style attribute`);
    assert.ok(!/<style[\s>]/.test(html), `${page} has a style element`);
  }
});

// The address is joined by the script from its parts, out of reach of scrapers
// that read the source.
test("the email address never stands whole in a page", () => {
  const { user, domain } = site.contact.email;
  for (const [page, html] of pages) assert.ok(!html.includes(`${user}@${domain}`), page);
});

test("an unlaunched site asks not to be indexed", () => {
  for (const [page, html] of pages)
    assert.equal(
      html.includes('name="robots" content="noindex"'),
      !site.launched || page === "404.html",
      page,
    );
});
