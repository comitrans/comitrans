import { html } from "../html.js";
import { art } from "../art.js";
import { icon, plane } from "../icons.js";

const WAYS = ["to", "from"];

const steps = (list) => html`
  <ol class="steps">
    ${list.map(
      ({ title, text }) =>
        html`<li>
          <h4>${title}</h4>
          <p>${text}</p>
        </li>`,
    )}
  </ol>
`;

export function airport({ t }) {
  const copy = t.airport;
  return html`
    <section class="section airport" id="${t.anchors.airport}">
      <div class="wrap">
        <div class="section-head">
          <h2>${copy.title}</h2>
          <p>${copy.lead}</p>
        </div>
        <div class="direction" data-arrival data-direction data-way="to">
          <div class="direction-switch" role="group" aria-label="${copy.direction}" hidden>
            ${WAYS.map(
              (way) =>
                html`<button
                  type="button"
                  data-way-button="${way}"
                  aria-pressed="${String(way === "to")}"
                >
                  ${copy[way].tab}
                </button>`,
            )}
          </div>
          <div class="direction-route" aria-hidden="true">
            <span class="direction-end">${icon("house")}${copy.home}</span>
            <span class="direction-line">${art("car-mark")}</span>
            <span class="direction-end">${plane()}${copy.terminal}</span>
          </div>
          ${WAYS.map(
            (way) =>
              html`<div class="direction-panel" data-way-panel="${way}">
                <h3>${copy[way].tab}</h3>
                ${steps(copy[way].steps)}
              </div>`,
          )}
        </div>
      </div>
    </section>
  `;
}
