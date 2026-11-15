// How much of a scene has to be on screen before what arrives in it sets off.
const SEEN_AT = 0.35;

export function init() {
  const watcher = new IntersectionObserver(
    (entries) => {
      for (const { target, isIntersecting } of entries) {
        if (!isIntersecting) continue;
        target.classList.add("is-seen");
        watcher.unobserve(target);
      }
    },
    { threshold: SEEN_AT },
  );
  for (const scene of document.querySelectorAll("[data-arrival]")) watcher.observe(scene);
}
