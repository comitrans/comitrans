const CHANGE = "stepper-change";
const values = new Map();

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export const count = (name) => values.get(name);

// Calls back with a count now, if it has one, and again whenever it changes.
export function onCount(name, listener) {
  addEventListener(CHANGE, ({ detail }) => {
    if (detail === name) listener(values.get(name));
  });
  if (values.has(name)) listener(values.get(name));
}

function show(stepper) {
  const value = values.get(stepper.dataset.stepper);
  stepper.querySelector("[data-stepper-value]").textContent = value;
  stepper.querySelector('[data-step="-1"]').disabled = value <= Number(stepper.dataset.min);
  stepper.querySelector('[data-step="1"]').disabled = value >= Number(stepper.dataset.max);
}

export function init() {
  const steppers = [...document.querySelectorAll("[data-stepper]")];

  for (const stepper of steppers) {
    const { stepper: name, min, max } = stepper.dataset;
    if (!values.has(name)) values.set(name, Number(min));
    stepper.hidden = false;
    show(stepper);

    stepper.addEventListener("click", ({ target }) => {
      const button = target.closest("[data-step]");
      if (!button) return;
      const next = clamp(values.get(name) + Number(button.dataset.step), Number(min), Number(max));
      values.set(name, next);
      for (const peer of steppers) if (peer.dataset.stepper === name) show(peer);
      dispatchEvent(new CustomEvent(CHANGE, { detail: name }));
    });
  }
}
