import { html, raw } from "./html.js";
import { scene, titleIsLong } from "./sections/hero.js";

const STYLE = `
  html { font-size: 16px; }
  body { position: relative; width: 1200px; height: 630px; overflow: hidden; }
  * { animation: none !important; }
  .wordmark { position: absolute; top: 52px; left: 72px; font-size: 42px; }
  h1 { position: absolute; top: 150px; right: 72px; left: 72px; font-size: 128px; line-height: 0.86; }
  .card-long h1 { font-size: 112px; }
  .hero-scene { --road: 96px; position: absolute; inset: auto 0 0; height: 340px; margin: 0; }
  .hero-signpost { right: 72px; font-size: 40px; }
  .hero-posts { height: 112px; }
  .hero-car { left: 72px; width: 560px; }
  .skyline { height: 124px; }
`;

const STYLES = ["01-base", "03-signs", "04-header", "05-hero"];

// The link preview: the hero's own scene under the headline, drawn at the
// size scrapers expect. \`assets\` is where the site's files are read from.
export function card(context, assets) {
  const { t, locale } = context;
  return html`<!doctype html>
    <html lang="${locale.lang}">
      <head>
        <meta charset="utf-8" />
        ${STYLES.map((name) => html`<link rel="stylesheet" href="${assets}css/${name}.css" />`)}
        <style>
          ${raw(STYLE)}
        </style>
      </head>
      <body ${titleIsLong(t) ? raw('class="card-long"') : null}>
        <span class="wordmark">
          <span class="sign"><span class="wordmark-c">c</span>omitrans</span>
        </span>
        <h1>${t.hero.title}</h1>
        ${scene(context)}
      </body>
    </html>`;
}
