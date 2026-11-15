import { html } from "./html.js";
import { icon } from "./icons.js";

// A count with a button either side. Steppers that share a name keep one
// value between them, wherever on the page they stand.
export function stepper({ name, label, fewer, more, min, max, value = min }) {
  return html`
    <div
      class="stepper"
      role="group"
      aria-label="${label}"
      data-stepper="${name}"
      data-min="${min}"
      data-max="${max}"
      hidden
    >
      <span class="stepper-label">${label}</span>
      <button type="button" data-step="-1" aria-label="${fewer}">${icon("minus")}</button>
      <output data-stepper-value>${value}</output>
      <button type="button" data-step="1" aria-label="${more}">${icon("plus")}</button>
    </div>
  `;
}
