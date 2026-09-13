(() => {
  "use strict";

  const APP_FRAME_ID = "app-frame";
  const SPLASH_ACTIVE = "SPLASH_ACTIVE";
  const SPLASH_COMPLETE = "SPLASH_COMPLETE";
  const TIMEOUT_MS = 10_000;
  const GEI_LOGO_URL = "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/gei-logo-gwP3315oRt91xpE8.png";

  const SPLASH_IMAGES = [
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/y-all-too-god-is-a-mountain-z7efLdbRpVLTxHbD.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/start-here-gei-ZAxHC3CvlzNVXcDh.png"
  ];

  const FALLBACK_IMAGE = SPLASH_IMAGES[0];
  let state = SPLASH_ACTIVE;
  let completionScheduled = false;
  let timeoutId = null;

  function chooseImage() {
    return SPLASH_IMAGES[Math.floor(Math.random() * SPLASH_IMAGES.length)] || FALLBACK_IMAGE;
  }

  function installSplashMarkup(frame) {
    const layer = document.createElement("section");
    layer.className = "splash-layer";
    layer.setAttribute("aria-label", "GEI Academy splash screen");
    layer.innerHTML = `
      <img class="splash-artwork" alt="" decoding="async" fetchpriority="high">
      <div class="splash-scrim" aria-hidden="true"></div>
      <div class="splash-content">
        <div class="splash-brand" aria-label="Genesis Engineered Interpretations">
          <img class="splash-brand-logo" src="${GEI_LOGO_URL}" alt="G.E.I. logo" decoding="async">
        </div>
        <p class="splash-kicker">Genesis Engineered Interpretations</p>
        <h1 class="splash-title">Enter the discovery.</h1>
        <p class="splash-subtitle">Learn to observe, question &amp; discover through water, engineering and interpretation.</p>
        <div class="splash-meta"><span>Water • Engineering • Discovery</span><span class="splash-meta-dot" aria-hidden="true"></span><span id="splash-status">Loading experience</span></div>
      </div>
      <div class="splash-controls">
        <div class="splash-progress" aria-hidden="true"><span id="splash-progress-bar"></span></div>
        <button class="splash-button splash-enter" id="splash-enter" type="button">Enter Academy</button>
        <button class="splash-button splash-skip" id="splash-skip" type="button">Skip</button>
      </div>
    `;
    frame.insertBefore(layer, frame.firstChild);
    return layer;
  }

  function completeSplash(reason) {
    if (state === SPLASH_COMPLETE || completionScheduled) return;
    completionScheduled = true;
    state = SPLASH_COMPLETE;
    if (timeoutId) window.clearTimeout(timeoutId);
    const frame = document.getElementById(APP_FRAME_ID);
    if (!frame) return;
    frame.classList.add("splash-done");
    frame.dataset.splashExit = reason;
    window.setTimeout(() => {
      const layer = frame.querySelector(".splash-layer");
      if (layer) layer.setAttribute("aria-hidden", "true");
    }, 540);
  }

  function init() {
    const frame = document.getElementById(APP_FRAME_ID);
    if (!frame) return;
    const splash = frame.querySelector(".splash-layer") || installSplashMarkup(frame);
    const artwork = splash.querySelector(".splash-artwork");
    const enter = splash.querySelector("#splash-enter");
    const skip = splash.querySelector("#splash-skip");
    const status = splash.querySelector("#splash-status");
    const progressBar = splash.querySelector("#splash-progress-bar");

    artwork.src = chooseImage();
    artwork.onerror = () => {
      if (artwork.dataset.fallbackApplied === "true") return;
      artwork.dataset.fallbackApplied = "true";
      artwork.src = FALLBACK_IMAGE;
      if (status) status.textContent = "Using fallback artwork";
    };
    artwork.onload = () => {
      if (status) status.textContent = "Ready to enter";
    };

    enter.addEventListener("click", () => completeSplash("enter"));
    skip.addEventListener("click", () => completeSplash("skip"));
    document.addEventListener("keydown", (event) => {
      if (state !== SPLASH_ACTIVE) return;
      if (event.key === "Enter" || event.key === "Escape") {
        event.preventDefault();
        completeSplash(event.key === "Enter" ? "keyboard-enter" : "keyboard-skip");
      }
    });

    const start = performance.now();
    const tick = (now) => {
      if (state !== SPLASH_ACTIVE) return;
      const progress = Math.min((now - start) / TIMEOUT_MS, 1);
      progressBar.style.width = `${progress * 100}%`;
      if (progress < 1) window.requestAnimationFrame(tick);
    };
    timeoutId = window.setTimeout(() => completeSplash("timeout"), TIMEOUT_MS);
    window.requestAnimationFrame(tick);
  }

  init();
})();
