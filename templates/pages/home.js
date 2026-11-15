import { html } from "../html.js";
import { page } from "../document.js";
import { airport } from "../sections/airport.js";
import { dock } from "../sections/dock.js";
import { header, trip } from "../sections/header.js";
import { hero } from "../sections/hero.js";

export function home(context) {
  const { t } = context;
  return page(context, {
    title: t.meta.title,
    description: t.meta.description,
    body: html`
      <a class="skip" href="#main">${t.chrome.skip}</a>
      ${header(context)} ${trip(context)}
      <main id="main">${hero(context)} ${airport(context)}</main>
      ${dock(context)}
    `,
  });
}
