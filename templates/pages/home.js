import { html } from "../html.js";
import { page } from "../document.js";
import { about, faq } from "../sections/about.js";
import { airport } from "../sections/airport.js";
import { booking } from "../sections/booking.js";
import { dock } from "../sections/dock.js";
import { footer, hints } from "../sections/footer.js";
import { header, trip } from "../sections/header.js";
import { hero } from "../sections/hero.js";
import { rides } from "../sections/rides.js";
import { routes } from "../sections/routes.js";
import { vehicle } from "../sections/vehicle.js";

export function home(context) {
  const { t } = context;
  return page(context, {
    title: t.meta.title,
    description: t.meta.description,
    body: html`
      <a class="skip" href="#main">${t.chrome.skip}</a>
      ${hints(context)} ${header(context)} ${trip(context)}
      <main id="main">
        ${hero(context)} ${airport(context)} ${routes(context)} ${rides(context)}
        ${vehicle(context)} ${about(context)} ${faq(context)} ${booking(context)}
      </main>
      ${footer(context)} ${dock(context)}
    `,
  });
}
