import { html, raw } from "../html.js";
import { art } from "../art.js";
import { plane } from "../icons.js";

const MENU = ["airport", "routes", "rides", "vehicle", "faq"];

const current = raw('aria-current="page"');

export function header({ site, t, locale, root }) {
  return html`
    ${site.launched ? null : html`<p class="preview">${t.chrome.preview}</p>`}
    <header class="site-header">
      <div class="wrap">
        <a class="wordmark" href="#top" aria-label="${t.chrome.home}">
          <span class="sign" aria-hidden="true"><span class="wordmark-c">c</span>omitrans</span>
        </a>
        <nav class="site-nav" aria-label="${t.chrome.nav}">
          <ul>
            ${MENU.map(
              (key) => html`<li><a href="#${t.anchors[key]}">${t.chrome.menu[key]}</a></li>`,
            )}
          </ul>
        </nav>
        <div class="lang" role="group" aria-label="${t.chrome.language}">
          ${site.locales.map(
            (other) =>
              html`<a
                href="${root + other.path || "./"}"
                lang="${other.lang}"
                hreflang="${other.hreflang}"
                ${other === locale ? current : null}
                >${other.label}<span class="visually-hidden"> ${other.name}</span></a
              >`,
          )}
        </div>
        <a class="btn btn-primary" href="#${t.anchors.booking}">${t.chrome.book}</a>
      </div>
    </header>
  `;
}

export function trip({ site, t }) {
  const route = site.routes.find(({ id }) => id === site.trip.route);
  const stops = site.trip.stops.map(({ id, km }) => ({ name: t.places[id], km }));
  return html`
    <div
      class="trip"
      aria-hidden="true"
      data-trip
      data-stops="${JSON.stringify(stops)}"
      data-unit="${t.units.km}"
    >
      <div class="wrap">
        <span class="trip-end">${site.base.code}</span>
        <div class="trip-track">
          <span class="trip-road"></span>
          <span class="trip-done"></span>
          <svg class="trip-stops" viewBox="0 0 ${route.km} 10" preserveAspectRatio="none">
            ${stops
              .slice(1, -1)
              .map(
                ({ km }) =>
                  html`<line
                    x1="${km}"
                    x2="${km}"
                    y1="3.4"
                    y2="6.6"
                    vector-effect="non-scaling-stroke"
                  />`,
              )}
          </svg>
          <span class="trip-car"
            >${art("car-mark")}<span class="trip-label" data-trip-label></span
          ></span>
        </div>
        <span class="trip-end">${plane()}${route.code}</span>
      </div>
    </div>
  `;
}
