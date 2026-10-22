(() => {
  "use strict";

  function addDiscoveryCard() {
    const main = document.querySelector("#screen-home .dashboard-main");
    if (!main || main.querySelector(".kc-home-promo")) return;

    const card = document.createElement("a");
    card.className = "kc-home-promo";
    card.href = "ketchup-copper-discovery.html";
    card.setAttribute("aria-label", "Explore the Ketchup and Copper Discovery page");
    card.innerHTML =
      '<span class="kc-home-promo-kicker">NEW DISCOVERY</span>' +
      '<strong class="kc-home-promo-title">Ketchup &amp; Copper</strong>' +
      '<span class="kc-home-promo-desc">Can ketchup clean tarnished copper? Watch the experiment.</span>' +
      '<span class="kc-home-promo-arrow" aria-hidden="true">→</span>';
    main.appendChild(card);
  }

  const style = document.createElement("style");
  style.textContent =
    '.kc-home-promo{display:grid;grid-template-columns:1fr auto;grid-template-rows:auto auto auto;align-items:center;gap:2px 12px;padding:16px 18px;border:1px solid var(--yt-line,#cfe3ef);border-radius:20px;' +
    'background:linear-gradient(135deg,rgba(217,48,37,0.06),rgba(184,115,51,0.06) 60%,rgba(47,210,255,0.04));box-shadow:var(--yt-shadow-soft,0 3px 10px rgba(26,74,104,0.08));text-decoration:none;color:var(--yt-text,#10233f);' +
    'transition:transform 160ms ease,box-shadow 160ms ease}' +
    '.kc-home-promo:hover{transform:translateY(-1px);box-shadow:var(--yt-shadow,0 8px 24px rgba(26,74,104,0.1))}' +
    '.kc-home-promo-kicker{grid-column:1;color:#d93025;font-size:12px;font-weight:900;letter-spacing:.12em;text-transform:uppercase}' +
    '.kc-home-promo-title{grid-column:1;font-size:20px;font-weight:800;line-height:1.15;letter-spacing:-0.01em}' +
    '.kc-home-promo-desc{grid-column:1;font-size:13px;color:var(--yt-muted,#5d7088);line-height:1.35}' +
    '.kc-home-promo-arrow{grid-column:2;grid-row:1/4;display:grid;place-items:center;width:38px;height:38px;border-radius:11px;background:rgba(217,48,37,0.08);color:#d93025;font-size:20px}' +
    '@media(max-width:360px){.kc-home-promo{padding:13px 14px}.kc-home-promo-title{font-size:18px}.kc-home-promo-arrow{width:34px;height:34px;font-size:18px}}';
  document.head.appendChild(style);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", addDiscoveryCard, { once: true });
  } else {
    addDiscoveryCard();
  }
})();
