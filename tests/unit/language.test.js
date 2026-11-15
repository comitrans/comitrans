import { test } from "node:test";
import assert from "node:assert/strict";

import { suggestion } from "../../public/js/language.js";

const sr = { code: "sr", speakers: ["sr", "hr", "bs"] };
const en = { code: "en", speakers: ["en"] };

test("a visitor who reads the page is offered nothing", () => {
  assert.equal(suggestion("hr", sr, [en], "en"), null);
  assert.equal(suggestion("en", en, [sr], "en"), null);
});

test("a visitor is offered the language their browser asks for", () => {
  assert.equal(suggestion("en", sr, [en], "en"), "en");
  assert.equal(suggestion("sr", en, [sr], "en"), "sr");
});

test("a visitor who reads none of the languages is offered the fallback, once", () => {
  assert.equal(suggestion("de", sr, [en], "en"), "en");
  assert.equal(suggestion("de", en, [sr], "en"), null);
});
