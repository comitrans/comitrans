import { html } from "../html.js";
import { icon } from "../icons.js";

export function about({ site, t }) {
  return html`
    <section class="section about" id="${t.anchors.about}">
      <div class="wrap about-grid">
        <div class="about-copy">
          <h2>${t.about.title}</h2>
          ${t.about.text.map((paragraph) => html`<p>${paragraph}</p>`)}
        </div>
        <div class="plate" role="img" aria-label="${t.about.plate}">
          <span class="plate-band">${site.plate.country}</span>
          <span class="plate-text"
            >${site.base.code}<span class="plate-dot"></span>${site.plate.text}</span
          >
        </div>
      </div>
    </section>
  `;
}

export function faq({ t }) {
  return html`
    <section class="section faq" id="${t.anchors.faq}">
      <div class="wrap faq-grid">
        <div class="section-head"><h2>${t.faq.title}</h2></div>
        <div class="faq-list">
          ${t.faq.items.map(
            ({ q, a }) =>
              html`<details>
                <summary>
                  <h3>${q}</h3>
                  ${icon("chevron")}
                </summary>
                <p>${a}</p>
              </details>`,
          )}
        </div>
      </div>
    </section>
  `;
}
