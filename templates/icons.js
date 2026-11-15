import { html, raw } from "./html.js";

const PATHS = {
  arrow: "M5 12h14M13 6l6 6-6 6",
  phone:
    "M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16.5 16.5 0 0 1 4.5 5.5a2 2 0 0 1 2-2z",
  chat: "M4 5h16v11H10l-5 4v-4H4z",
  bubble:
    "M12 4a8 7.5 0 0 1 0 15c-1 0-2-.15-2.9-.4L5 20.5l.9-3.3A7.4 7.4 0 0 1 4 11.5 8 7.5 0 0 1 12 4z",
  mail: "M3.5 6h17v12h-17zM3.5 7l8.5 6.5L20.5 7",
  copy: "M9 9h10v11H9zM5 15V4h10",
  chevron: "M6 9l6 6 6-6",
  minus: "M6 12h12",
  plus: "M12 6v12M6 12h12",
  house: "M4 11.5 12 5l8 6.5M6.5 10v9h11v-9M10 19v-5h4v5",
};

export const icon = (name) =>
  html`<svg class="icon icon-${name}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="${PATHS[name]}" />
  </svg>`;

// The airport pictogram as roads sign it: an airliner seen from above, nose up.
export const plane = () =>
  raw(
    `<svg class="pictogram" viewBox="0 0 48 48" aria-hidden="true" focusable="false"><path d="M24 2C25.7 2 27 4.5 27 8V18L45 29V33L27 28V38L32 42V45L24 43L16 45V42L21 38V28L3 33V29L21 18V8C21 4.5 22.3 2 24 2Z" /></svg>`,
  );

// The block arrow a direction sign points with.
export const pointer = () =>
  raw(
    `<svg class="pictogram" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M2 9H13V4L22 12L13 20V15H2Z" /></svg>`,
  );
