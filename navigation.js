(() => {
  "use strict";

  const NAV_ITEMS = [
    { id: "home", label: "Home", icon: "⌂", target: "screen-home" },
    { id: "academy", label: "Academy", icon: "✦", target: "screen-academy" },
    { id: "portfolio", label: "Portfolio", icon: "▤", target: "screen-portfolio" },
    { id: "video", label: "Video", icon: "▶", target: "screen-video" },
    { id: "support", label: "Support", icon: "?", target: "screen-support" }
  ];

  const GEI_LOGO_URL = "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/gei-logo-gwP3315oRt91xpE8.png";
  const SUPPORT_LINKS = [
    { label: "GoFundMe", detail: "Support the GEI research fundraiser", href: "https://gofund.me/927c07d75", className: "support-gofundme", image: "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/go-fund-me-gei-rQp76i277bWw1w6S.png", imageAlt: "GoFundMe" },
    { label: "Cash App", detail: "Send direct support through Cash App", href: "https://cash.app/$1oh1", className: "support-cashapp", image: "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/cashapp-gei-Kl9CjhEgQiciiucv.png", imageAlt: "Cash App" },
    { label: "PayPal", detail: "Support GEI securely through PayPal", href: "https://www.paypal.com/ncp/payment/YCVQWR87ZEBFJ", className: "support-paypal", image: "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/paypal-gei-8S9OqrMZCaU0iIBk.png", imageAlt: "PayPal" }
  ];

  const MASCOT = window.GEI_MASCOT || {
    url: "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/yalltoo-mascot-animated-UgmkGIe3sJES4tKm.gif",
    alt: "Adam, the YallToo mascot",
    academyLabel: "Open Adam Academy guide"
  };
  const HOME_MASCOT_URL = "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/adam-dam-guide-qtx78bnE5ITfwakV.png";
  const HOME_PRODUCT_URL = "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/inshot_20260808_192709068-u7bYAfdJRGRfnEfC.gif";
  const HOME_STORE_URL = "https://www.yalltoo.com/gei-discovery-guide-";
  const HOME_DAM_URL = "dam-release.html";
  const state = { activeScreen: "home", initialized: false };

  function getNavRoot() { return document.getElementById("bottom-navigation"); }
  function getScreens() { return Array.from(document.querySelectorAll(".app-screen")); }

  function ensureSupportStyles() {
    if (document.getElementById("support-page-styles")) return;
    const style = document.createElement("style");
    style.id = "support-page-styles";
    style.textContent = `
      #screen-support { position:relative;overflow:hidden!important;overscroll-behavior:none;touch-action:none; }
      .support-root { position:absolute;inset:0;width:100%;height:100%;min-height:0;overflow-y:auto!important;overflow-x:hidden!important;box-sizing:border-box;padding:max(10px,env(safe-area-inset-top)) 12px calc(96px + env(safe-area-inset-bottom));display:grid;grid-template-rows:auto auto auto;align-content:start;gap:10px;color:var(--skin-text,#102a43);-webkit-overflow-scrolling:touch;overscroll-behavior:contain; }
      .support-header { display:grid;grid-template-columns:minmax(0,1fr) 70px;align-items:start;gap:8px; }
      .support-kicker { display:block;color:var(--skin-accent,#2fd2ff);font-size:11px;font-weight:900;letter-spacing:.14em;text-transform:uppercase; }
      .support-header h1 { margin:4px 0 3px;font-size:clamp(30px,8vw,40px);line-height:.96;letter-spacing:-.045em; }
      .support-header p { margin:0;max-width:330px;color:var(--skin-muted,#526b82);font-size:14px;line-height:1.28; }
      .support-gei-logo { display:block;width:70px;height:54px;object-fit:contain; }
      .support-content { position:relative;min-height:0;overflow:visible!important;display:grid;align-content:start;gap:10px; }
      .support-moses-trigger { display:grid;grid-template-columns:118px minmax(0,1fr);align-items:center;gap:12px;width:100%;min-height:170px;padding:8px 12px 8px 8px;border:1px solid color-mix(in srgb,var(--skin-accent,#2fd2ff) 35%,transparent);border-radius:22px;background:linear-gradient(135deg,color-mix(in srgb,var(--skin-accent,#2fd2ff) 11%,var(--skin-surface,#fff)),var(--skin-surface,#fff));color:var(--skin-text,#102a43);text-align:left;box-sizing:border-box;cursor:pointer; }
      .support-moses-art { display:grid;place-items:center;width:112px;height:154px;border-radius:17px;background:var(--skin-soft,#f1f4f8);overflow:hidden; }
      .support-moses-art img { display:block;width:100%;height:100%;object-fit:contain;background:transparent!important; }
      .support-moses-copy { display:grid;gap:5px;min-width:0; }
      .support-moses-copy .support-goal-label { margin:0;color:var(--skin-accent,#2fd2ff); }
      .support-moses-copy strong { font-size:25px;line-height:1.03; }
      .support-moses-copy span:last-child { color:var(--skin-muted,#526b82);font-size:13px;line-height:1.25; }
      .support-methods { display:grid;grid-template-columns:1fr;gap:9px; }
      .support-method { display:grid;grid-template-columns:80px minmax(0,1fr) auto;align-items:center;gap:12px;min-height:88px;padding:9px 12px;box-sizing:border-box;border:1px solid color-mix(in srgb,var(--skin-accent,#2fd2ff) 28%,transparent);border-radius:18px;background:var(--skin-surface,#fff);color:inherit;text-decoration:none;touch-action:manipulation; }
      .support-method:focus-visible,.support-moses-trigger:focus-visible { outline:3px solid var(--skin-accent,#2fd2ff);outline-offset:2px; }
      .support-icon { display:grid;place-items:center;width:80px;height:60px;flex:0 0 80px;border-radius:13px;background:var(--skin-soft,#f1f4f8);overflow:hidden; }
      .support-icon img { display:block;width:100%;height:100%;object-fit:contain;object-position:center; }
      .support-method strong { display:block;font-size:20px;line-height:1.05; }
      .support-method span { margin-top:3px;color:var(--skin-muted,#526b82);font-size:13px;line-height:1.2; }
      .support-arrow { color:var(--skin-accent,#2fd2ff);font-size:28px;line-height:1; }
      .support-contact { display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:64px;padding:10px 12px;box-sizing:border-box;border-radius:16px;background:var(--skin-soft,#f1f4f8); }
      .support-contact-copy { min-width:0;flex:1 1 auto; }
      .support-contact-copy strong { display:block;font-size:15px;line-height:1.05; }
      .support-contact-copy span { display:block;margin-top:3px;color:var(--skin-muted,#526b82);font-size:11px;line-height:1.2; }
      .support-email { flex:0 1 auto;min-width:0;max-width:50%;color:var(--skin-accent,#2fd2ff);font-size:12px;font-weight:800;text-decoration:none;overflow-wrap:anywhere;text-align:right;line-height:1.15;touch-action:manipulation; }
      .support-goal-popover { position:fixed;inset:0;z-index:1000;display:grid;place-items:center;padding:18px;background:rgba(4,7,14,.68);backdrop-filter:blur(5px); }
      .support-goal-popover[hidden] { display:none; }
      .support-goal-card { position:relative;width:min(100%,390px);max-height:calc(100dvh - 36px);overflow:auto;padding:20px;border:1px solid color-mix(in srgb,var(--skin-accent,#2fd2ff) 40%,transparent);border-radius:22px;background:var(--skin-surface,#fff);color:var(--skin-text,#102a43);box-shadow:0 28px 70px rgba(0,0,0,.42); }
      .support-goal-card h2 { margin:0 38px 10px 0;font-size:27px;line-height:1.02; }
      .support-goal-card p { margin:0;color:var(--skin-muted,#526b82);font-size:15px;line-height:1.45; }
      .support-goal-close { position:absolute;top:10px;right:10px;width:42px;height:42px;border:1px solid rgba(16,42,67,.14);border-radius:12px;background:var(--skin-soft,#f1f4f8);color:var(--skin-text,#102a43);font-size:27px;line-height:1;cursor:pointer; }
      @media(max-width:360px){
        .support-root { padding-inline:9px;padding-top:8px;padding-bottom:calc(92px + env(safe-area-inset-bottom));gap:8px; }
        .support-header { grid-template-columns:minmax(0,1fr) 58px; }
        .support-kicker { font-size:10px; }
        .support-header h1 { font-size:28px; }
        .support-header p { font-size:11px; }
        .support-gei-logo { width:58px;height:44px; }
        .support-moses-trigger { grid-template-columns:92px minmax(0,1fr);min-height:142px;padding:6px 8px 6px 6px;gap:8px; }
        .support-moses-art { width:86px;height:128px; }
        .support-moses-copy strong { font-size:20px; }
        .support-moses-copy span:last-child { font-size:11px; }
        .support-methods { gap:8px; }
        .support-method { grid-template-columns:70px minmax(0,1fr) auto;min-height:78px;padding:8px 9px;gap:9px; }
        .support-icon { width:70px;height:54px; }
        .support-method strong { font-size:18px; }
        .support-method span { font-size:11px; }
        .support-arrow { font-size:25px; }
        .support-contact { min-height:58px;padding:8px 9px; }
        .support-email { font-size:10px; }
      }
    `;
    document.head.appendChild(style);
  }
  function ensureHomeProductStyles() {
    if (document.getElementById("home-product-styles")) return;
    const style = document.createElement("style");
    style.id = "home-product-styles";
    style.textContent = `
      .home-experience-stack { width:100%;display:grid;gap:10px; }
      .home-dam-card { position:relative;width:100%;height:180px;box-sizing:border-box;overflow:hidden;border:1px solid color-mix(in srgb,var(--skin-accent,#2fd2ff) 34%,transparent);border-radius:22px;background:linear-gradient(135deg,#08101b,#0b0e18);box-shadow:0 12px 30px rgba(0,0,0,.1); }
      .home-dam-label { position:absolute;z-index:2;left:11px;top:8px;padding:4px 8px;border:1px solid rgba(47,210,255,.28);border-radius:999px;background:rgba(3,8,16,.72);color:#eaf9ff;font-size:8px;font-weight:900;letter-spacing:.13em;text-transform:uppercase;pointer-events:none; }
      .home-dam-frame { display:block;width:100%;height:100%;border:0;background:transparent; }
      .home-product-card { position:relative;display:block;width:100%;min-height:112px;box-sizing:border-box;overflow:hidden;border:1px solid color-mix(in srgb,var(--skin-accent,#2fd2ff) 34%,transparent);border-radius:22px;background:linear-gradient(135deg,color-mix(in srgb,var(--skin-accent,#2fd2ff) 10%,var(--skin-surface,#fff)),var(--skin-surface,#fff));box-shadow:0 14px 34px rgba(0,0,0,.08);text-decoration:none;-webkit-tap-highlight-color:transparent; }
      .home-product-card img { display:block;width:100%;height:112px;object-fit:cover;object-position:center; }
      .home-product-card::after { content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 48%,rgba(6,7,13,.78) 100%);pointer-events:none; }
      .home-product-cta { position:absolute;left:14px;right:14px;bottom:11px;z-index:1;display:flex;align-items:center;justify-content:space-between;gap:10px;color:#fff; }
      .home-product-cta span { font-size:10px;font-weight:900;letter-spacing:.12em;text-transform:uppercase; }
      .home-product-cta b { display:grid;place-items:center;width:34px;height:34px;flex:0 0 34px;border-radius:11px;background:rgba(255,255,255,.94);color:#102a43;font-size:19px;box-shadow:0 6px 18px rgba(0,0,0,.18); }
      .home-product-card:hover,.home-product-card:focus-visible { transform:translateY(-1px);box-shadow:0 18px 38px rgba(0,0,0,.12); }
      .home-product-card:focus-visible { outline:3px solid var(--skin-accent,#2fd2ff);outline-offset:2px; }
      @media(max-width:360px){.home-dam-card{height:150px;border-radius:20px}.home-dam-label{left:8px;top:6px;font-size:7px;padding:3px 7px}.home-product-card{min-height:98px;border-radius:20px}.home-product-card img{height:98px}.home-product-cta{left:11px;right:11px;bottom:8px}.home-product-cta span{font-size:8px}.home-product-cta b{width:30px;height:30px;flex-basis:30px;font-size:16px}}
    `;
    document.head.appendChild(style);
  }

  function replaceHomeBlueprint() {
    const screen = document.getElementById("screen-home");
    if (!screen || screen.dataset.productReady === "true") return;
    const blueprint = screen.querySelector(".blueprint-card");
    const cta = screen.querySelector(".academy-cta");
    if (!blueprint) return;
    ensureHomeProductStyles();

    const product = document.createElement("a");
    product.className = "home-product-card";
    product.href = HOME_STORE_URL;
    product.target = "_blank";
    product.rel = "noopener noreferrer";
    product.setAttribute("aria-label", "Open the GEI Discovery Guide store page");
    product.innerHTML = `<img src="${HOME_PRODUCT_URL}" alt="GEI Discovery Guide" loading="eager" decoding="async"><span class="home-product-cta"><span>GET THE GEI DISCOVERY GUIDE</span><b aria-hidden="true">→</b></span>`;

    product.classList.add("home-product-retired");
    product.remove();
    if (blueprint) {
      blueprint.dataset.homeBlueprintRetained = "true";
    }
    if (cta) cta.remove();
    screen.dataset.productReady = "true";
  }

  function renderSupport() {
    const screen = document.getElementById("screen-support");
    if (!screen || screen.dataset.supportRendered === "true") return;
    ensureSupportStyles();
    screen.dataset.supportRendered = "true";
    screen.innerHTML = `
      <div class="support-root">
        <header class="support-header">
          <div>
            <span class="support-kicker">GEI SUPPORT</span>
            <h1>Support the Research</h1>
            <p>Help Genesis Engineered Interpretations grow, build, document and share.</p>
          </div>
          <img class="support-gei-logo" src="${GEI_LOGO_URL}" alt="Genesis Engineered Interpretations" loading="eager" decoding="async" />
        </header>
        <div class="support-content">
          <button class="support-moses-trigger" id="support-moses-open" type="button" aria-label="Open the GEI fundraiser goal message" aria-controls="support-goal-popover">
            <span class="support-moses-art"><img src="https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/operator-moses-NaoYxXNs8PIe8VAq.png" alt="Moses, GEI support mascot" loading="eager" decoding="async" /></span>
            <span class="support-moses-copy">
              <span class="support-goal-label">MEET MOSES</span>
              <strong>Support the GEI Mission.</strong>
              <span>Tap Moses to see what your support helps make possible.</span>
            </span>
          </button>
          <section class="support-methods" aria-label="Ways to support GEI">
            ${SUPPORT_LINKS.map((item) => `<a class="support-method ${item.className}" href="${item.href}" target="_blank" rel="noopener noreferrer"><span class="support-icon"><img src="${item.image}" alt="${item.imageAlt}" loading="lazy" decoding="async" /></span><span><strong>${item.label}</strong><span>${item.detail}</span></span><span class="support-arrow" aria-hidden="true">→</span></a>`).join("")}
          </section>
          <div class="support-contact">
            <div class="support-contact-copy"><strong>Contact GEI</strong><span>Questions, collaboration or research support</span></div>
            <a class="support-email" href="mailto:Contact@yalltoo.com">Contact@yalltoo.com</a>
          </div>
        </div>
      </div>
      <div class="support-goal-popover" id="support-goal-popover" hidden>
        <div class="support-goal-card" role="dialog" aria-modal="true" aria-labelledby="support-goal-title">
          <button class="support-goal-close" id="support-goal-close" type="button" aria-label="Close fundraiser goal message">×</button>
          <span class="support-goal-label">FUNDRAISER GOAL</span>
          <h2 id="support-goal-title">Support the GEI mission.</h2>
          <p>Your support directly funds the research — enabling GEI to develop working prototypes, documents, and share this knowledge freely with communities, students, and innovators worldwide. Every contribution moves GEI closer to a future where this guide is accessible to all.</p>
        </div>
      </div>
    `;

    const open = screen.querySelector("#support-moses-open");
    const popover = screen.querySelector("#support-goal-popover");
    const close = screen.querySelector("#support-goal-close");
    const openGoal = () => {
      popover.hidden = false;
      document.body.classList.add("support-goal-open");
      close?.focus();
    };
    const closeGoal = () => {
      popover.hidden = true;
      document.body.classList.remove("support-goal-open");
      open?.focus();
    };
    open?.addEventListener("click", openGoal);
    close?.addEventListener("click", closeGoal);
    screen.querySelectorAll(".support-method").forEach((link) => {
      link.addEventListener("click", () => window.GEI_SONIC_FX?.iconImmediate?.() || window.GEI_SONIC_FX?.icon?.());
    });
    const escapeHandler = (event) => {
      if (event.key === "Escape" && popover && !popover.hidden) closeGoal();
    };
    popover?.addEventListener("click", (event) => {
      if (event.target === popover) closeGoal();
    });
    document.addEventListener("keydown", escapeHandler);
  }

  function replaceHomeMascot() {
    const orbit = document.querySelector("#screen-home .mascot-orbit");
    if (!orbit || orbit.dataset.mascotReady === "true") return;
    orbit.dataset.mascotReady = "true";
    orbit.setAttribute("aria-label", "Adam mascot");
    orbit.innerHTML = `<button class="home-mascot-button gei-mascot-button gei-mascot-button--interactive" type="button" aria-label="${MASCOT.academyLabel}"><span class="mascot-ring" aria-hidden="true"></span><img class="home-mascot-image gei-mascot-image" src="${HOME_MASCOT_URL}" alt="Adam, the GEI dam guide mascot" /></button>`;
    orbit.querySelector(".home-mascot-button")?.addEventListener("click", () => document.querySelector("#screen-academy .academy-mascot")?.click());
  }

  function renderNavigation() {
    const root = getNavRoot();
    if (!root || root.dataset.rendered === "true") return;
    root.dataset.rendered = "true";
    root.innerHTML = NAV_ITEMS.map((item) => `<button type="button" class="nav-button" data-nav-id="${item.id}" aria-label="${item.label}"><span class="nav-icon" aria-hidden="true">${item.icon}</span><span class="nav-label">${item.label}</span></button>`).join("");
    root.querySelectorAll("[data-nav-id]").forEach((button) => button.addEventListener("click", () => setActiveScreen(button.dataset.navId)));
  }

  function setActiveScreen(id) {
    const item = NAV_ITEMS.find((entry) => entry.id === id) || NAV_ITEMS[0];
    state.activeScreen = item.id;
    getScreens().forEach((screen) => {
      const isActive = screen.id === item.target;
      screen.classList.toggle("active", isActive);
      screen.classList.toggle("is-active", isActive);
      screen.setAttribute("aria-hidden", isActive ? "false" : "true");
    });
    getNavRoot()?.querySelectorAll("[data-nav-id]").forEach((button) => {
      const isActive = button.dataset.navId === item.id;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-current", isActive ? "page" : "false");
    });
    if (item.id === "home") {
      replaceHomeMascot();
      replaceHomeBlueprint();
    }
    if (item.id === "support") renderSupport();
    window.dispatchEvent(new CustomEvent("gei:navigation", { detail: { id: item.id, target: item.target } }));
  }

  function init() {
    if (state.initialized) return;
    state.initialized = true;
    renderNavigation();
    replaceHomeMascot();
    replaceHomeBlueprint();
    renderSupport();
    setActiveScreen(location.hash === "#academy" ? "academy" : "home");
    window.addEventListener("hashchange", () => { if (location.hash === "#academy") setActiveScreen("academy"); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
