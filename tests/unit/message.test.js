import { test } from "node:test";
import assert from "node:assert/strict";

import { callLink, mailLink, viberLink, whatsappLink } from "../../public/js/links.js";
import { buildMessage, formatDate } from "../../public/js/message.js";
import { loadContent } from "../../templates/content.js";

const { strings } = loadContent();
const sr = strings.sr.booking.message;
const en = strings.en.booking.message;
const routes = { beg: "Aerodrom Beograd (BEG)" };

const trip = (fields) => ({
  route: "beg",
  direction: "to",
  date: "",
  time: "",
  address: "",
  destination: "",
  passengers: 1,
  luggage: 0,
  flight: "",
  name: "",
  note: "",
  ...fields,
});

test("a date reads the way each language writes it", () => {
  assert.equal(formatDate("2026-11-05", sr), "5.11.2026.");
  assert.equal(formatDate("2026-11-05", en), "5 November 2026");
});

test("an untouched form still says where the ride goes and for how many", () => {
  assert.equal(
    buildMessage(trip(), sr, routes),
    [sr.greeting, "Relacija: Novi Sad → Aerodrom Beograd (BEG)", "Putnika: 1"].join("\n"),
  );
});

test("the route turns around for a ride from the airport", () => {
  const message = buildMessage(trip({ direction: "from" }), sr, routes);
  assert.ok(message.includes("Relacija: Aerodrom Beograd (BEG) → Novi Sad"));
});

test("every field that is filled in gets a line, in the order of the form", () => {
  const message = buildMessage(
    trip({
      date: "2026-11-21",
      time: "04:30",
      address: "Bulevar oslobođenja 1",
      passengers: 3,
      luggage: 2,
      flight: "JU 500",
      name: "Ana",
      note: "Dečje sedište",
    }),
    sr,
    routes,
  );
  assert.deepEqual(message.split("\n").slice(1), [
    "Relacija: Novi Sad → Aerodrom Beograd (BEG)",
    "Datum i vreme: 21.11.2026. u 04:30",
    "Adresa: Bulevar oslobođenja 1",
    "Putnika: 3",
    "Kofera: 2",
    "Broj leta: JU 500",
    "Ime: Ana",
    "Napomena: Dečje sedište",
  ]);
});

test("a ride that is not on the list names its own destination", () => {
  const message = buildMessage(trip({ route: "other", destination: "Subotica" }), sr, routes);
  assert.ok(!message.includes("Relacija"));
  assert.ok(message.includes("Odredište: Subotica"));
});

test("a date or a time alone is still passed on", () => {
  assert.ok(buildMessage(trip({ date: "2026-11-21" }), sr, routes).includes("21.11.2026."));
  assert.ok(buildMessage(trip({ time: "04:30" }), sr, routes).includes("Datum i vreme: 04:30"));
});

test("contact links carry the number in the form each app expects", () => {
  assert.equal(callLink("+381 60 000 0000"), "tel:+381600000000");
  assert.equal(whatsappLink("+381600000000"), "https://wa.me/381600000000");
  assert.equal(viberLink("+381600000000"), "viber://chat?number=%2B381600000000");
});

test("a message rides along percent-encoded", () => {
  assert.equal(
    whatsappLink("+381600000000", "Zdravo Ćomi\n1 & 2"),
    "https://wa.me/381600000000?text=Zdravo%20%C4%86omi%0A1%20%26%202",
  );
  assert.equal(
    viberLink("+381600000000", "a b"),
    "viber://chat?number=%2B381600000000&draft=a%20b",
  );
  assert.equal(mailLink("a@b.c", "Vožnja", "x y"), "mailto:a@b.c?subject=Vo%C5%BEnja&body=x%20y");
});
