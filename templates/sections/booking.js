import { html, raw } from "../html.js";
import { icon } from "../icons.js";
import { stepper } from "../stepper.js";
import { callLink, viberLink, whatsappLink } from "../../public/js/links.js";

const airportName = (route, { t }) => {
  const name = t.booking.message.airport.replace("{city}", t.routes.airports[route.id].city);
  return `${name} (${route.code})`;
};

const field = (label, control, { hint = null, wide = false, only = null } = {}) => html`
  <label class="field ${wide ? "field-wide" : null}" ${only ? raw(`data-only="${only}"`) : null}>
    <span class="field-label">${label}${hint ? html` <small>${hint}</small>` : null}</span>
    ${control}
  </label>
`;

// What the composer reads at runtime. The address is kept in parts so it
// never appears whole in the page source.
function data(context) {
  const { site, t } = context;
  const { whatsapp, viber, email } = site.contact;
  return raw(
    JSON.stringify({
      strings: { ...t.booking.message, ...t.booking.status },
      routes: Object.fromEntries(
        site.routes.map((route) => [route.id, airportName(route, context)]),
      ),
      contact: { whatsapp, viber, email: [email.user, email.domain] },
    }).replaceAll("<", "\\u003c"),
  );
}

function form(context) {
  const { site, t } = context;
  const f = t.booking.fields;
  return html`
    <form class="composer-form" data-composer novalidate hidden>
      ${field(
        f.route,
        html`<select name="route">
          ${site.routes.map(
            (route) => html`<option value="${route.id}">${airportName(route, context)}</option>`,
          )}
          <option value="other">${f.other}</option>
        </select>`,
      )}
      <fieldset class="field segmented" data-only="airport">
        <legend class="field-label">${f.direction}</legend>
        <label
          ><input type="radio" name="direction" value="to" checked /><span>${f.to}</span></label
        >
        <label><input type="radio" name="direction" value="from" /><span>${f.from}</span></label>
      </fieldset>
      ${field(f.date, html`<input type="date" name="date" />`)}
      ${field(f.time, html`<input type="time" name="time" />`, { hint: f.timeHint })}
      ${field(
        f.address,
        html`<input
          type="text"
          name="address"
          autocomplete="street-address"
          placeholder="${f.addressHint}"
        />`,
        { wide: true },
      )}
      ${field(f.destination, html`<input type="text" name="destination" />`, {
        wide: true,
        only: "other",
      })}
      ${stepper({
        name: "passengers",
        label: f.passengers,
        fewer: f.fewer,
        more: f.more,
        min: 1,
        max: site.vehicle.passengers,
      })}
      ${stepper({
        name: "luggage",
        label: f.luggage,
        fewer: f.fewer,
        more: f.more,
        min: 0,
        max: site.vehicle.luggageMax,
      })}
      ${field(
        f.flight,
        html`<input
          type="text"
          name="flight"
          autocapitalize="characters"
          autocomplete="off"
          spellcheck="false"
        />`,
        { hint: f.optional, only: "airport" },
      )}
      ${field(f.name, html`<input type="text" name="name" autocomplete="name" />`)}
      ${field(f.note, html`<textarea name="note" rows="2"></textarea>`, {
        hint: f.optional,
        wide: true,
      })}
    </form>
  `;
}

export function booking(context) {
  const { site, t, locale } = context;
  const { phone, whatsapp, viber } = site.contact;
  const copy = t.booking;
  return html`
    <section class="section booking" id="${t.anchors.booking}" data-dock-yields>
      <div class="wrap">
        <div class="section-head">
          <h2>${copy.title}</h2>
          <p>${copy.lead}</p>
        </div>
        <div class="composer">
          ${form(context)}
          <div class="composer-side">
            <div class="composer-preview" data-composer-preview hidden>
              <h3>${copy.preview}</h3>
              <p class="composer-message" data-composer-message></p>
            </div>
            <noscript><p class="composer-noscript">${copy.noscript}</p></noscript>
            <div class="composer-send">
              <a class="btn btn-primary" href="${whatsappLink(whatsapp)}" data-send="whatsapp"
                >${icon("chat")}${copy.send.whatsapp}</a
              >
              <a class="btn btn-outline" href="${viberLink(viber)}" data-send="viber"
                >${icon("bubble")}${copy.send.viber}</a
              >
              <a class="btn btn-outline" data-send="email" hidden
                >${icon("mail")}${copy.send.email}</a
              >
              <button class="btn btn-outline" type="button" data-send="copy" hidden>
                ${icon("copy")}${copy.send.copy}
              </button>
            </div>
            <p class="composer-call">
              ${copy.send.call} <a href="${callLink(phone.e164)}">${phone[locale.phone]}</a>
            </p>
            <p class="composer-status" role="status" data-composer-status></p>
            <p class="composer-privacy">${copy.privacy}</p>
          </div>
        </div>
        <script type="application/json" data-composer-data>
          ${data(context)}
        </script>
      </div>
    </section>
  `;
}
