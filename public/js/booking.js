import { mailLink, viberLink, whatsappLink } from "./links.js";
import { buildMessage } from "./message.js";
import { count, onCount } from "./stepper.js";

const today = () => {
  const now = new Date();
  return new Date(now - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
};

export function init() {
  const form = document.querySelector("[data-composer]");
  if (!form) return;
  const composer = form.closest(".composer");
  const { strings, routes, contact } = JSON.parse(
    document.querySelector("[data-composer-data]").textContent,
  );
  const preview = composer.querySelector("[data-composer-preview]");
  const message = composer.querySelector("[data-composer-message]");
  const status = composer.querySelector("[data-composer-status]");
  const send = Object.fromEntries(
    [...composer.querySelectorAll("[data-send]")].map((control) => [control.dataset.send, control]),
  );
  const address = contact.email.join("@");

  function trip() {
    const fields = Object.fromEntries(
      [...new FormData(form)].map(([name, value]) => [name, value.trim()]),
    );
    const airport = fields.route !== "other";
    return {
      ...fields,
      destination: airport ? "" : fields.destination,
      flight: airport ? fields.flight : "",
      passengers: count("passengers"),
      luggage: count("luggage"),
    };
  }

  function update() {
    const airport = form.elements.route.value !== "other";
    for (const part of form.querySelectorAll("[data-only]"))
      part.hidden = (part.dataset.only === "airport") !== airport;
    const text = buildMessage(trip(), strings, routes);
    message.textContent = text;
    send.whatsapp.href = whatsappLink(contact.whatsapp, text);
    send.viber.href = viberLink(contact.viber, text);
    send.email.href = mailLink(address, strings.subject, text);
  }

  async function copy(note) {
    try {
      await navigator.clipboard.writeText(message.textContent);
      status.textContent = note;
    } catch {
      status.textContent = "";
    }
  }

  form.elements.date.min = today();
  for (const part of [form, preview, send.email, send.copy]) part.hidden = false;

  form.addEventListener("input", update);
  form.addEventListener("submit", (event) => event.preventDefault());
  onCount("passengers", update);
  onCount("luggage", update);
  send.copy.addEventListener("click", () => copy(strings.copied));
  send.viber.addEventListener("click", () => copy(strings.viber));
  update();
}
