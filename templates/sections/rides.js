import { html } from "../html.js";
import { pointer } from "../icons.js";

// Each kind of ride is signed in the colour roads use for that kind of destination.
const BLADES = [
  { kind: "intercity", plate: "sign-yellow" }, // other towns
  { kind: "events", plate: "sign-white" }, // places in town
  { kind: "trips", plate: "sign-brown" }, // sights
  { kind: "cargo", plate: "sign-blue" }, // services
];

export function rides({ t }) {
  return html`
    <section class="section rides" id="${t.anchors.rides}">
      <div class="wrap">
        <div class="section-head">
          <h2>${t.rides.title}</h2>
          <p>${t.rides.lead}</p>
        </div>
        <ul class="blades">
          ${BLADES.map(({ kind, plate }) => {
            const { sign, title, text } = t.rides.items[kind];
            return html`<li class="blade">
              <span class="sign ${plate} blade-sign" aria-hidden="true">
                <span>${sign.split(", ").map((line) => html`<span>${line}</span>`)}</span
                >${pointer()}
              </span>
              <div class="blade-copy">
                <h3>${title}</h3>
                <p>${text}</p>
              </div>
            </li>`;
          })}
        </ul>
      </div>
    </section>
  `;
}
