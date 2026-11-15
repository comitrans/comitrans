import { test } from "node:test";
import assert from "node:assert/strict";

import { html, raw } from "../../templates/html.js";

test("interpolated text is escaped", () => {
  assert.equal(
    String(html`<p>${'<b title="x">A & B</b>'}</p>`),
    "<p>&lt;b title=&quot;x&quot;&gt;A &amp; B&lt;/b&gt;</p>",
  );
});

test("markup passes through unescaped, nested or in a list", () => {
  const item = (text) => html`<b>${text}</b>`;
  assert.equal(String(html`<p>${["a", "b"].map(item)}</p>`), "<p><b>a</b><b>b</b></p>");
  assert.equal(String(html`<p>${raw("<br />")}</p>`), "<p><br /></p>");
});

test("an absent value renders as nothing", () => {
  assert.equal(String(html`<p>${null}${undefined}${false}${true}${0}</p>`), "<p>0</p>");
});
