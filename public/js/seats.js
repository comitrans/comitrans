import { onCount } from "./stepper.js";

export function init() {
  const map = document.querySelector("[data-seatmap]");
  if (!map) return;
  const note = document.querySelector("[data-seats-note]");
  const seats = [...map.querySelectorAll("[data-seat]")];
  const roomyUpTo = Number(map.dataset.roomyUpTo);

  onCount("passengers", (passengers) => {
    const roomy = passengers <= roomyUpTo;
    for (const seat of seats)
      seat.classList.toggle("is-taken", Number(seat.dataset.seat) <= passengers);
    map.classList.toggle("is-roomy", roomy);
    note.dataset.state = roomy ? "roomy" : "full";
  });
}
