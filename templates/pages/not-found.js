import { html } from "../html.js";
import { art } from "../art.js";
import { page } from "../document.js";

// The host serves this one file for every missing address, in whatever
// language the visitor expected, so it speaks all of them.
export function notFound(context) {
  const { site, strings, t } = context;
  return page(context, {
    title: t.notFound.metaTitle,
    description: t.notFound.text,
    indexed: false,
    styles: ["20-not-found"],
    body: html`
      <main class="lost" id="main">
        <div class="lost-sign">${art("dead-end")}<span class="post"></span></div>
        ${site.locales.map((locale) => {
          const copy = strings[locale.code].notFound;
          return html`<section lang="${locale.lang}">
            <h1>${copy.title}</h1>
            <p>${copy.text}</p>
            <a class="btn btn-primary" href="/${locale.path}">${copy.home}</a>
          </section>`;
        })}
      </main>
    `,
  });
}
