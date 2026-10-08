/* YallToo — one brand, no skins.
   The visual system lives in yalltoo-theme.css. This script has three small
   jobs and no UI of its own:
     1. Retire the legacy skin preference. Old installs may still carry a saved
        skin; it is deleted and never read, so no old look can come back.
     2. Strip any stale data-skin attribute from the document.
     3. Build the Home logo lockup (this lived in the old skin script). */
(() => {
  "use strict";

  const GEI_LOGO_URL = "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/gei-logo-gwP3315oRt91xpE8.png";
  const LEGACY_KEYS = ["gei-academy-skin-v1", "skin", "theme", "selectedSkin"];

  function retireLegacySkin() {
    try {
      LEGACY_KEYS.forEach((key) => window.localStorage.removeItem(key));
    } catch {
      // Storage unavailable: nothing to clean, and nothing reads it anyway.
    }
    document.documentElement.removeAttribute("data-skin");
    document.body?.removeAttribute("data-skin");
  }

  function buildHomeBrand() {
    const title = document.querySelector("#screen-home .dashboard-header h1");
    if (!title || title.querySelector(".home-gei-logo")) return;

    title.replaceChildren();
    const logo = document.createElement("img");
    logo.className = "home-gei-logo";
    logo.src = GEI_LOGO_URL;
    logo.alt = "Genesis Engineered Interpretations";
    logo.loading = "eager";
    logo.decoding = "async";
    title.appendChild(logo);
  }

  function init() {
    retireLegacySkin();
    buildHomeBrand();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
