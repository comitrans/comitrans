import { html } from "../html.js";
import { plane } from "../icons.js";

export function duration(minutes, { hour, minute }) {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return [hours && `${hours} ${hour}`, rest && `${rest} ${minute}`].filter(Boolean).join(" ");
}

function price({ price }, { site, t, locale }) {
  if (price === null) return t.routes.onRequest;
  const amount = new Intl.NumberFormat(locale.lang).format(price);
  return html`${t.routes.from} <strong>${amount} ${site.currency}</strong>`;
}

export function routes(context) {
  const { site, t } = context;
  const { units } = t;
  return html`
    <section class="section routes on-asphalt" id="${t.anchors.routes}">
      <div class="wrap">
        <div class="section-head">
          <h2>${t.routes.title}</h2>
          <p>${t.routes.lead}</p>
        </div>
        <div class="board" data-arrival>
          <ul class="sign board-sign">
            ${site.routes.map((route) => {
              const { city, airport } = t.routes.airports[route.id];
              return html`<li class="board-row">
                ${plane()}
                <span class="board-place">
                  <span class="board-city">${city}</span>
                  <span class="board-airport">${airport}</span>
                </span>
                <span class="board-code">${route.code}</span>
                <span class="board-km">${route.km}<small>${units.km}</small></span>
                <span class="board-time">
                  ${units.about} ${duration(route.minutes, units)}
                  ${route.border ? html`<small>${t.routes.border}</small>` : null}
                </span>
                <span class="board-price">${price(route, context)}</span>
              </li>`;
            })}
          </ul>
          <div class="board-posts" aria-hidden="true">
            <span class="post"></span><span class="post"></span>
          </div>
        </div>
        <p class="routes-other">
          ${t.routes.other} <a href="#${t.anchors.booking}">${t.routes.otherAction}</a>
        </p>
      </div>
    </section>
  `;
}
