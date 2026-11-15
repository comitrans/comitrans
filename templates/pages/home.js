import { html } from "../html.js";
import { page } from "../document.js";

export function home(context) {
  const { t } = context;
  return page(context, {
    title: t.meta.title,
    description: t.meta.description,
    body: html`<main id="main"></main>`,
  });
}
