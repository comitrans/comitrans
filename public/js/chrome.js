import { suggestion } from "./language.js";

const DISMISSED = "language-hint-dismissed";

const speakers = (element) => element.dataset.speakers.split(" ");

function remembered() {
  try {
    return localStorage.getItem(DISMISSED) === "1";
  } catch {
    return false;
  }
}

function remember() {
  try {
    localStorage.setItem(DISMISSED, "1");
  } catch {
    // a visitor who blocks storage sees the hint again next time
  }
}

function hint() {
  const hints = [...document.querySelectorAll("[data-hint]")];
  if (!hints.length || remembered()) return;
  const preferred = (navigator.languages?.[0] ?? navigator.language ?? "").toLowerCase();
  const { locale, fallback } = document.body.dataset;
  const code = suggestion(
    preferred.split("-")[0],
    { code: locale, speakers: speakers(document.body) },
    hints.map((element) => ({ code: element.dataset.hint, speakers: speakers(element) })),
    fallback,
  );
  const shown = hints.find((element) => element.dataset.hint === code);
  if (!shown) return;
  shown.hidden = false;
  shown.querySelector("[data-hint-dismiss]").addEventListener("click", () => {
    shown.hidden = true;
    remember();
  });
}

// The address is joined here so that it never stands whole in the page source.
function email() {
  for (const link of document.querySelectorAll("[data-email]")) {
    const address = `${link.dataset.user}@${link.dataset.domain}`;
    link.href = `mailto:${address}`;
    link.textContent = address;
    link.closest("[hidden]")?.removeAttribute("hidden");
  }
}

// The dock steps aside where the page offers the same contacts itself.
function dock() {
  const bar = document.querySelector("[data-dock]");
  if (!bar) return;
  const showing = new Set();
  const watcher = new IntersectionObserver((entries) => {
    for (const { target, isIntersecting } of entries) {
      if (isIntersecting) showing.add(target);
      else showing.delete(target);
    }
    bar.classList.toggle("is-away", showing.size > 0);
  });
  for (const section of document.querySelectorAll("[data-dock-yields]")) watcher.observe(section);
}

export function init() {
  hint();
  email();
  dock();
}
