import { test } from "node:test";
import assert from "node:assert/strict";

import { lastStop, progress } from "../../public/js/route.js";

const stops = [
  { name: "Novi Sad", km: 0 },
  { name: "Beška", km: 32 },
  { name: "Aerodrom", km: 80 },
];

test("progress runs from the top of the page to its very bottom", () => {
  assert.equal(progress(0, 5000, 1000), 0);
  assert.equal(progress(2000, 5000, 1000), 0.5);
  assert.equal(progress(4000, 5000, 1000), 1);
});

test("progress stays in range past either end and on a page too short to scroll", () => {
  assert.equal(progress(-50, 5000, 1000), 0);
  assert.equal(progress(4200, 5000, 1000), 1);
  assert.equal(progress(0, 800, 1000), 0);
});

test("the trip names the last stop it has passed", () => {
  assert.equal(lastStop(stops, 0).name, "Novi Sad");
  assert.equal(lastStop(stops, 31).name, "Novi Sad");
  assert.equal(lastStop(stops, 32).name, "Beška");
  assert.equal(lastStop(stops, 80).name, "Aerodrom");
});
