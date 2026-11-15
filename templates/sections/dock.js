import { html } from "../html.js";
import { icon } from "../icons.js";
import { callLink, viberLink, whatsappLink } from "../../public/js/links.js";

export function dock({ site, t }) {
  const { phone, whatsapp, viber } = site.contact;
  return html`
    <nav class="dock" aria-label="${t.chrome.dock.label}" data-dock>
      <a href="${callLink(phone.e164)}">${icon("phone")}${t.chrome.dock.call}</a>
      <a href="${whatsappLink(whatsapp)}">${icon("chat")}${t.chrome.dock.whatsapp}</a>
      <a href="${viberLink(viber)}">${icon("bubble")}${t.chrome.dock.viber}</a>
    </nav>
  `;
}
