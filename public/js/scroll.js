const listeners = new Set();
let frame = 0;

function run() {
  frame = 0;
  for (const listener of listeners) listener();
}

function request() {
  frame ||= requestAnimationFrame(run);
}

// One scroll handler for the page: every listener runs once a frame, and once when it joins.
export function onScroll(listener) {
  if (!listeners.size) {
    addEventListener("scroll", request, { passive: true });
    addEventListener("resize", request);
  }
  listeners.add(listener);
  listener();
}

export const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
