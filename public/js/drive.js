import { onScroll, reducedMotion } from "./scroll.js";

// How far the lane marking slides for each pixel the page scrolls.
const MARKING_SPEED = 0.6;

// While the hero is on screen, scrolling drives the vehicle: the wheels turn
// and the road runs under them.
export function init() {
  const scene = document.querySelector("[data-drive]");
  if (!scene || reducedMotion()) return;
  const marking = scene.querySelector(".road-dashes");

  onScroll(() => {
    if (scene.getBoundingClientRect().bottom < 0) return;
    const period = marking.offsetWidth - marking.parentElement.offsetWidth;
    scene.style.setProperty("--drive", String(Math.round(scrollY)));
    scene.style.setProperty("--dash", `${(scrollY * MARKING_SPEED) % period}px`);
  });
}
