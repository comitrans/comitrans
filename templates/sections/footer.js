import { html } from "../html.js";
import { art } from "../art.js";
import { callLink, viberLink, whatsappLink } from "../../public/js/links.js";

function registered({ site }) {
  if (!site.business) return null;
  return html`<p>${site.business}</p>`;
}

export function footer(context) {
  const { site, t, locale, root } = context;
  const { phone, whatsapp, viber, email } = site.contact;
  const copy = t.footer;
  return html`
    <footer class="site-footer on-asphalt" data-dock-yields>
      <div class="runway" aria-hidden="true" data-arrival>
        ${art("plane-side")}
        <span class="road-dashes"></span>
      </div>
      <div class="wrap">
        <p class="footer-closing">${copy.closing}</p>
        <div class="footer-grid">
          <div>
            <h2>${copy.contact}</h2>
            <ul>
              <li><a href="${callLink(phone.e164)}">${phone[locale.phone]}</a></li>
              <li><a href="${whatsappLink(whatsapp)}">${t.chrome.dock.whatsapp}</a></li>
              <li><a href="${viberLink(viber)}">${t.chrome.dock.viber}</a></li>
              <li hidden>
                <a data-email data-user="${email.user}" data-domain="${email.domain}"></a>
              </li>
            </ul>
          </div>
          <div>
            <h2>${copy.languages}</h2>
            <ul>
              ${site.locales.map(
                (other) =>
                  html`<li>
                    <a
                      href="${root + other.path || "./"}"
                      lang="${other.lang}"
                      hreflang="${other.hreflang}"
                      >${other.name}</a
                    >
                  </li>`,
              )}
            </ul>
          </div>
          <div class="footer-notes">
            <p>${copy.privacy}</p>
            <p>${copy.rights}</p>
            ${registered(context)}
          </div>
        </div>
        <a class="footer-top" href="#top">${copy.top}</a>
      </div>
    </footer>
  `;
}

// One line per other language, shown by the script to a visitor whose browser asks for it.
export function hints({ site, strings, locale, root }) {
  return site.locales
    .filter((other) => other !== locale)
    .map(
      (other) =>
        html`<p
          class="hint"
          lang="${other.lang}"
          data-hint="${other.code}"
          data-speakers="${other.speakers.join(" ")}"
          hidden
        >
          ${strings[other.code].chrome.hint.text}
          <a href="${root + other.path || "./"}" hreflang="${other.hreflang}"
            >${strings[other.code].chrome.hint.action}</a
          >
          <button type="button" data-hint-dismiss>
            ${strings[other.code].chrome.hint.dismiss}
          </button>
        </p>`,
    );
}
