import { html, raw } from "../html.js";
import { art } from "../art.js";
import { icon, plane } from "../icons.js";
import { callLink } from "../../public/js/links.js";

// A title up to this long sets on one line at the full size; a longer one
// takes a size that still fits it on one.
const ONE_LINE = 24;

export const titleIsLong = (t) => t.hero.title.length > ONE_LINE;

function vehicle({ site, t, root }) {
  const photo = site.heroPhoto;
  if (!photo) return art("vehicle");
  return html`<img
    src="${root}${photo.src}"
    width="${photo.width}"
    height="${photo.height}"
    alt="${t.hero.photo}"
  />`;
}

export function scene(context) {
  const { site, t } = context;
  const route = site.routes.find(({ id }) => id === site.trip.route);
  return html`
    <div class="hero-scene" data-arrival data-drive>
      ${art("skyline-city")} ${art("skyline-airport")}
      <div class="hero-signpost" aria-hidden="true">
        <div class="sign hero-sign">
          ${plane()}
          <span class="hero-sign-names">
            <span lang="sr-Cyrl">${t.hero.sign.cyrillic}</span>
            <span>${t.hero.sign.latin}</span>
          </span>
          <span class="hero-sign-km">${route.km}</span>
        </div>
        <div class="hero-posts"><span class="post"></span><span class="post"></span></div>
      </div>
      <div class="hero-car">${vehicle(context)}</div>
      <div class="road"><span class="road-dashes"></span></div>
    </div>
  `;
}

export function hero(context) {
  const { site, t, locale } = context;
  return html`
    <section class="hero">
      <h1 ${titleIsLong(t) ? raw('class="hero-long"') : null}>${t.hero.title}</h1>
      <p class="hero-lead">${t.hero.lead}</p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="#${t.anchors.booking}">${t.chrome.book}${icon("arrow")}</a>
        <p class="hero-call">
          ${t.hero.call}
          <a href="${callLink(site.contact.phone.e164)}">${site.contact.phone[locale.phone]}</a>
        </p>
      </div>
      ${scene(context)}
      <p class="hero-also">${t.hero.also} <a href="#${t.anchors.routes}">${t.hero.alsoLink}</a></p>
    </section>
  `;
}
