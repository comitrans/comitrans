import { html } from "../html.js";
import { page } from "../document.js";
import { dock } from "../sections/dock.js";
import { header, trip } from "../sections/header.js";

export function home(context) {
  const { t } = context;
  return page(context, {
    title: t.meta.title,
    description: t.meta.description,
    body: html`
      <a class="skip" href="#main">${t.chrome.skip}</a>
      ${header(context)} ${trip(context)}
      <main id="main"></main>
      ${dock(context)}
    `,
  });
}
