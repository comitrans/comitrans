import { html } from "../html.js";
import { stepper } from "../stepper.js";

const SEAT = 52;

// The cabin from above, nose to the right. Passenger seats are numbered in the
// order they fill; the last row is the one that folds into the boot.
const SEATS = [
  { x: 322, y: 143, seat: 1 },
  { x: 222, y: 48, seat: 2 },
  { x: 222, y: 160, seat: 3 },
  { x: 222, y: 104, seat: 4 },
  { x: 126, y: 62, seat: 5, folds: true },
  { x: 126, y: 146, seat: 6, folds: true },
];

function seatmap({ t }) {
  return html`
    <svg viewBox="0 0 520 260" role="img" aria-label="${t.vehicle.map}">
      <rect class="cabin-shell" x="8" y="20" width="504" height="220" rx="70" />
      <path class="cabin-glass" d="M404 44 C436 70 446 104 446 130 C446 156 436 190 404 216 Z" />
      <path class="cabin-glass" d="M52 60 C40 84 36 108 36 130 C36 152 40 176 52 200 Z" />
      <rect class="cabin-boot" x="62" y="46" width="52" height="168" rx="10" />
      <rect class="cabin-boot cabin-boot-more" x="62" y="46" width="150" height="168" rx="10" />
      <text class="cabin-label" x="88" y="130" transform="rotate(-90 88 130)">
        ${t.vehicle.boot}
      </text>
      ${SEATS.map(
        ({ x, y, seat, folds }) =>
          html`<rect
            class="seat ${folds ? "seat-folding" : null}"
            data-seat="${seat}"
            x="${x}"
            y="${y}"
            width="${SEAT}"
            height="${SEAT}"
            rx="12"
          />`,
      )}
      <rect class="seat seat-driver" x="322" y="65" width="${SEAT}" height="${SEAT}" rx="12" />
      <text class="cabin-label cabin-label-driver" x="348" y="96">${t.vehicle.driver}</text>
      <path class="cabin-wheel" d="M388 76 a16 16 0 0 1 0 30" />
    </svg>
  `;
}

export function vehicle(context) {
  const { site, t } = context;
  const copy = t.vehicle;
  return html`
    <section class="section vehicle-section" id="${t.anchors.vehicle}">
      <div class="wrap vehicle-grid">
        <div class="vehicle-copy">
          <div class="section-head">
            <h2>${copy.title}</h2>
            <p>${copy.lead}</p>
          </div>
          ${stepper({
            name: "passengers",
            label: copy.passengers,
            fewer: copy.fewer,
            more: copy.more,
            min: 1,
            max: site.vehicle.passengers,
          })}
          <p class="seats-note" data-seats-note>
            <span data-seats-roomy>${copy.roomy}</span>
            <span data-seats-full>${copy.full}</span>
          </p>
        </div>
        <figure class="seatmap" data-seatmap data-roomy-up-to="${site.vehicle.roomyUpTo}">
          ${seatmap(context)}
        </figure>
      </div>
    </section>
  `;
}
