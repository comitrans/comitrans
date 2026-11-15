import { lastStop, progress } from "./route.js";
import { onScroll } from "./scroll.js";

const ARRIVED_AT = 0.995;

export function init() {
  const trip = document.querySelector("[data-trip]");
  if (!trip) return;
  const track = trip.querySelector(".trip-track");
  const car = trip.querySelector(".trip-car");
  const label = trip.querySelector("[data-trip-label]");
  const stops = JSON.parse(trip.dataset.stops);
  const total = stops.at(-1).km;
  let shown = "";
  let width = 0;
  let tallest = 0;

  onScroll(() => {
    // A phone's viewport shrinks whenever its toolbar shows, as it does at the bottom of the
    // page. Measured against the tallest it has been at this width, the end stays the end.
    if (innerWidth !== width) [width, tallest] = [innerWidth, 0];
    tallest = Math.max(tallest, innerHeight);
    const done = progress(scrollY, document.documentElement.scrollHeight, tallest);
    const km = Math.round(done * total);
    const text = `${lastStop(stops, km).name} ${km} ${trip.dataset.unit}`;
    trip.style.setProperty("--trip", done.toFixed(4));
    trip.classList.toggle("is-arrived", done > ARRIVED_AT);
    if (text !== shown) {
      shown = text;
      label.textContent = text;
    }

    // The label rides ahead of the car until the track ahead is too short for it. It keeps the
    // same distance from the car on either side, so its reach is read from where it stands.
    const at = car.getBoundingClientRect().left;
    const { left, right } = label.getBoundingClientRect();
    const reach = trip.classList.contains("is-late") ? at - left : right - at;
    trip.classList.toggle("is-late", at + reach > track.getBoundingClientRect().right);
  });
}
