import { onCount } from "./stepper.js";

export function init() {
  const map = document.querySelector("[data-seatmap]");
  if (!map) return;
  const seats = [...map.querySelectorAll("[data-seat]")];

  onCount("passengers", (passengers) => {
    for (const seat of seats)
      seat.classList.toggle("is-taken", Number(seat.dataset.seat) <= passengers);
  });
}
