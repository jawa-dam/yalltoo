(() => {
  "use strict";

  const NAV_ITEMS = [
    { id: "home", label: "Home", icon: "⌂", target: "screen-home" },
    { id: "academy", label: "Academy", icon: "✦", target: "screen-academy" },
    { id: "portfolio", label: "Portfolio", icon: "▤", target: "screen-portfolio" },
    { id: "video", label: "Video", icon: "▶", target: "screen-video" },
    { id: "support", label: "Support", icon: "?", target: "screen-support" }
  ];

  const state = {
    activeScreen: "home",
    initialized: false
  };

  function getNavRoot() {
    return document.getElementById("bottom-navigation");
  }

  function getScreens() {
    return Array.from(document.querySelectorAll(".app-screen"));
  }

  function setActiveScreen(screenId) {
    const target = NAV_ITEMS.find((item) => item.id === screenId) || NAV_ITEMS[0];
    state.activeScreen = target.id;

    document.querySelectorAll("[data-nav-item]").forEach((button) => {
      const isActive = button.dataset.navItem === target.id;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-current", isActive ? "page" : "false");
    });

    getScreens().forEach((screen) => {
      const isActive = screen.id === target.target;
      screen.classList.toggle("is-active", isActive);
      screen.setAttribute("aria-hidden", isActive ? "false" : "true");
    });
  }

  function buildNavigation() {
    const root = getNavRoot();
    if (!root) return;

    root.innerHTML = NAV_ITEMS.map((item) => `
      <button
        class="nav-item${item.id === state.activeScreen ? " is-active" : ""}"
        type="button"
        data-nav-item="${item.id}"
        aria-label="${item.label}"
        aria-current="${item.id === state.activeScreen ? "page" : "false"}"
      >
        <span class="nav-icon" aria-hidden="true">${item.icon}</span>
        <span class="nav-label">${item.label}</span>
      </button>
    `).join("");

    root.querySelectorAll("[data-nav-item]").forEach((button) => {
      button.addEventListener("click", () => {
        setActiveScreen(button.dataset.navItem || "home");
      });
    });
  }

  function init() {
    if (state.initialized) return;
    state.initialized = true;
    buildNavigation();
    setActiveScreen(state.activeScreen);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
