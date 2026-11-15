export function init() {
  for (const group of document.querySelectorAll("[data-direction]")) {
    const buttons = [...group.querySelectorAll("[data-way-button]")];
    group.querySelector(".direction-switch").hidden = false;
    group.classList.add("is-switchable");

    for (const button of buttons)
      button.addEventListener("click", () => {
        group.dataset.way = button.dataset.wayButton;
        for (const other of buttons) other.setAttribute("aria-pressed", String(other === button));
      });
  }
}
