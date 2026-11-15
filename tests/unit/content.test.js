import { test } from "node:test";
import assert from "node:assert/strict";

import { loadContent } from "../../templates/content.js";

const { site, strings } = loadContent();
const codes = site.locales.map(({ code }) => code);

function shape(value) {
  if (Array.isArray(value)) return value.map(shape);
  if (value && typeof value === "object")
    return Object.fromEntries(Object.entries(value).map(([key, inner]) => [key, shape(inner)]));
  return typeof value;
}

function texts(value, path = "") {
  if (typeof value === "string") return [[path, value]];
  if (value && typeof value === "object")
    return Object.entries(value).flatMap(([key, inner]) => texts(inner, `${path}/${key}`));
  return [];
}

test("every locale has the same keys and the same list lengths", () => {
  const [first, ...rest] = codes;
  for (const code of rest)
    assert.deepEqual(shape(strings[code]), shape(strings[first]), `${code} differs from ${first}`);
});

test("no string is empty or padded", () => {
  for (const code of codes)
    for (const [path, text] of texts(strings[code]))
      assert.ok(text.length > 0 && text === text.trim(), `${code}${path}`);
});

test("every route and every stop on the trip line is named in every locale", () => {
  for (const code of codes) {
    for (const { id } of site.routes)
      assert.ok(strings[code].routes.airports[id], `${code}: ${id}`);
    for (const { id } of site.trip.stops) assert.ok(strings[code].places[id], `${code}: ${id}`);
  }
});

test("the trip line follows a listed route from its first kilometre to its last", () => {
  const route = site.routes.find(({ id }) => id === site.trip.route);
  const kms = site.trip.stops.map(({ km }) => km);
  assert.ok(route, "trip.route names no route");
  assert.equal(kms[0], 0);
  assert.equal(kms.at(-1), route.km);
  assert.deepEqual(
    kms,
    [...kms].sort((a, b) => a - b),
  );
});

test("anchors are unique within a locale", () => {
  for (const code of codes) {
    const anchors = Object.values(strings[code].anchors);
    assert.equal(new Set(anchors).size, anchors.length, code);
  }
});

test("the fallback locale is one of the locales", () => {
  assert.ok(codes.includes(site.fallbackLocale));
});

// Launching publishes every fact on the page to search engines, so it waits
// for the list of unconfirmed ones to be empty.
test("the site launches only with nothing left to confirm", () => {
  assert.ok(!site.launched || site.todo.length === 0, `still to confirm: ${site.todo.join("; ")}`);
});
