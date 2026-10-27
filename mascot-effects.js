/* Beaver Mascot Random Effects — v1.0
   Injects a random beaver mascot with a random animation effect
   at the top of each screen on every page refresh. */
(() => {
  "use strict";

  const MASCOTS = [
    { url: "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/yalltoo-mascot-animated-UgmkGIe3sJES4tKm.gif", alt: "Adam, the YallToo mascot" },
    { url: "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/adam-dam-guide-qtx78bnE5ITfwakV.png", alt: "Adam, the dam guide" },
    { url: "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/wilbert-the-dam-guide-Jv8ovjc6i8PutsiP.png", alt: "Wilbert, the dam guide" },
    { url: "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/operator-moses-NaoYxXNs8PIe8VAq.png", alt: "Moses, GEI support mascot" },
    { url: "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/yalltoo-beaver-p8oCrzuwdz7fwcXd.png", alt: "YallToo beaver" }
  ];

  const EFFECTS = [
    "fade-rise",
    "soft-zoom",
    "drift-left",
    "drift-right",
    "gentle-tilt",
    "float",
    "breathe",
    "glow-pulse",
    "drop-bounce",
    "spin-in",
    "flip-x",
    "swing",
    "blur-focus",
    "pop",
    "shimmer",
    "rock",
    "heartbeat",
    "wave-sway",
    "slide-up-spin",
    "rise-from-water"
  ];

  const SCREENS = ["screen-home", "screen-academy", "screen-portfolio", "screen-support"];
  const DECK_KEY = "gei-mascot-fx-deck-v1";
  const LAST_KEY = "gei-mascot-fx-last-v1";

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function pickFromDeck(items, deckKey, lastKey) {
    let deck;
    try {
      const raw = localStorage.getItem(deckKey);
      deck = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(deck)) deck = [];
      deck = deck.filter(x => items.includes(x));
    } catch { deck = []; }

    let last;
    try { last = localStorage.getItem(lastKey) || ""; } catch { last = ""; }

    if (deck.length === 0) {
      deck = shuffle(items);
      if (deck.length > 1 && deck[0] === last) {
        [deck[0], deck[1]] = [deck[1], deck[0]];
      }
    }

    let pick = deck.shift() || items[0];
    if (pick === last && deck.length > 0) {
      const idx = deck.findIndex(x => x !== last);
      if (idx >= 0) [pick, deck[idx]] = [deck[idx], pick];
    }

    try {
      localStorage.setItem(deckKey, JSON.stringify(deck));
      localStorage.setItem(lastKey, pick);
    } catch {}
    return pick;
  }

  function injectStyles() {
    if (document.getElementById("mascot-effects-styles")) return;
    const style = document.createElement("style");
    style.id = "mascot-effects-styles";
    style.textContent = `
      .mascot-fx-banner {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 12px 16px 4px;
        pointer-events: none;
        overflow: hidden;
      }
      .mascot-fx-img {
        display: block;
        width: 80px;
        height: 80px;
        object-fit: contain;
        will-change: transform, opacity;
        filter: drop-shadow(0 6px 16px rgba(0,0,0,.18));
      }

      /* === ENTRANCE EFFECTS === */
      .mascot-fx-fade-rise        { animation: mfxFadeRise .9s ease-out both; }
      .mascot-fx-soft-zoom        { animation: mfxSoftZoom 1s ease-out both; }
      .mascot-fx-drift-left       { animation: mfxDriftLeft .85s ease-out both; }
      .mascot-fx-drift-right      { animation: mfxDriftRight .85s ease-out both; }
      .mascot-fx-gentle-tilt      { animation: mfxGentleTilt .8s ease-out both; }
      .mascot-fx-float            { animation: mfxFloat 2.8s ease-in-out infinite; }
      .mascot-fx-breathe          { animation: mfxBreathe 2.6s ease-in-out infinite; }
      .mascot-fx-glow-pulse       { animation: mfxGlowPulse 2.4s ease-in-out infinite; }
      .mascot-fx-drop-bounce      { animation: mfxDropBounce .7s cubic-bezier(.2,.8,.3,1.4) both; }
      .mascot-fx-spin-in          { animation: mfxSpinIn .8s ease-out both; }
      .mascot-fx-flip-x           { animation: mfxFlipX .75s ease-out both; }
      .mascot-fx-swing            { animation: mfxSwing 2s ease-in-out infinite; transform-origin: top center; }
      .mascot-fx-blur-focus       { animation: mfxBlurFocus .9s ease-out both; }
      .mascot-fx-pop              { animation: mfxPop .5s cubic-bezier(.2,.8,.2,1.4) both; }
      .mascot-fx-shimmer          { animation: mfxShimmer 2.2s ease-in-out infinite; }
      .mascot-fx-rock             { animation: mfxRock 1.8s ease-in-out infinite; }
      .mascot-fx-heartbeat        { animation: mfxHeartbeat 1.6s ease-in-out infinite; }
      .mascot-fx-wave-sway        { animation: mfxWaveSway 2.5s ease-in-out infinite; }
      .mascot-fx-slide-up-spin    { animation: mfxSlideUpSpin .85s ease-out both; }
      .mascot-fx-rise-from-water  { animation: mfxRiseFromWater 1s ease-out both; }

      @keyframes mfxFadeRise {
        from { opacity: 0; transform: translateY(24px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes mfxSoftZoom {
        from { opacity: 0; transform: scale(.6); }
        to   { opacity: 1; transform: scale(1); }
      }
      @keyframes mfxDriftLeft {
        from { opacity: 0; transform: translateX(60px); }
        to   { opacity: 1; transform: translateX(0); }
      }
      @keyframes mfxDriftRight {
        from { opacity: 0; transform: translateX(-60px); }
        to   { opacity: 1; transform: translateX(0); }
      }
      @keyframes mfxGentleTilt {
        from { opacity: 0; transform: rotate(-12deg) scale(.85); }
        to   { opacity: 1; transform: rotate(0) scale(1); }
      }
      @keyframes mfxFloat {
        0%, 100% { transform: translateY(0); }
        50%      { transform: translateY(-10px); }
      }
      @keyframes mfxBreathe {
        0%, 100% { transform: scale(1); }
        50%      { transform: scale(1.08); }
      }
      @keyframes mfxGlowPulse {
        0%, 100% { filter: drop-shadow(0 6px 16px rgba(0,0,0,.18)) drop-shadow(0 0 0 rgba(47,210,255,0)); }
        50%      { filter: drop-shadow(0 6px 16px rgba(0,0,0,.18)) drop-shadow(0 0 18px rgba(47,210,255,.55)); }
      }
      @keyframes mfxDropBounce {
        0%   { opacity: 0; transform: translateY(-50px) scale(.8); }
        60%  { opacity: 1; transform: translateY(6px) scale(1.05); }
        100% { opacity: 1; transform: translateY(0) scale(1); }
      }
      @keyframes mfxSpinIn {
        from { opacity: 0; transform: rotate(-180deg) scale(.5); }
        to   { opacity: 1; transform: rotate(0) scale(1); }
      }
      @keyframes mfxFlipX {
        from { opacity: 0; transform: perspective(400px) rotateY(90deg); }
        to   { opacity: 1; transform: perspective(400px) rotateY(0); }
      }
      @keyframes mfxSwing {
        0%, 100% { transform: rotate(0); }
        25%      { transform: rotate(8deg); }
        75%      { transform: rotate(-8deg); }
      }
      @keyframes mfxBlurFocus {
        from { opacity: 0; filter: blur(10px) drop-shadow(0 6px 16px rgba(0,0,0,.18)); }
        to   { opacity: 1; filter: blur(0) drop-shadow(0 6px 16px rgba(0,0,0,.18)); }
      }
      @keyframes mfxPop {
        0%   { opacity: 0; transform: scale(0); }
        70%  { opacity: 1; transform: scale(1.15); }
        100% { opacity: 1; transform: scale(1); }
      }
      @keyframes mfxShimmer {
        0%, 100% { filter: drop-shadow(0 6px 16px rgba(0,0,0,.18)) brightness(1); }
        50%      { filter: drop-shadow(0 6px 16px rgba(0,0,0,.18)) brightness(1.25); }
      }
      @keyframes mfxRock {
        0%, 100% { transform: rotate(0); }
        25%      { transform: rotate(5deg); }
        75%      { transform: rotate(-5deg); }
      }
      @keyframes mfxHeartbeat {
        0%, 100% { transform: scale(1); }
        15%      { transform: scale(1.12); }
        30%      { transform: scale(1); }
        45%      { transform: scale(1.08); }
        60%      { transform: scale(1); }
      }
      @keyframes mfxWaveSway {
        0%, 100% { transform: translateX(0) rotate(0); }
        25%      { transform: translateX(8px) rotate(3deg); }
        75%      { transform: translateX(-8px) rotate(-3deg); }
      }
      @keyframes mfxSlideUpSpin {
        from { opacity: 0; transform: translateY(40px) rotate(-90deg); }
        to   { opacity: 1; transform: translateY(0) rotate(0); }
      }
      @keyframes mfxRiseFromWater {
        0%   { opacity: 0; transform: translateY(30px) scaleY(.7); clip-path: inset(60% 0 0 0); }
        50%  { opacity: 1; transform: translateY(4px) scaleY(1); clip-path: inset(20% 0 0 0); }
        100% { opacity: 1; transform: translateY(0) scaleY(1); clip-path: inset(0 0 0 0); }
      }

      @media (prefers-reduced-motion: reduce) {
        .mascot-fx-img { animation: none !important; opacity: 1 !important; transform: none !important; filter: drop-shadow(0 6px 16px rgba(0,0,0,.18)) !important; }
      }
    `;
    document.head.appendChild(style);
  }

  function buildComboIndex() {
    const combos = [];
    for (let m = 0; m < MASCOTS.length; m++) {
      for (let e = 0; e < EFFECTS.length; e++) {
        combos.push(m + ":" + e);
      }
    }
    return combos;
  }

  function init() {
    injectStyles();
    const allCombos = buildComboIndex();

    SCREENS.forEach(screenId => {
      const screen = document.getElementById(screenId);
      if (!screen) return;
      if (screen.querySelector(".mascot-fx-banner")) return;

      const combo = pickFromDeck(
        allCombos,
        DECK_KEY + "-" + screenId,
        LAST_KEY + "-" + screenId
      );
      const [mi, ei] = combo.split(":").map(Number);
      const mascot = MASCOTS[mi] || MASCOTS[0];
      const effect = EFFECTS[ei] || EFFECTS[0];

      const banner = document.createElement("div");
      banner.className = "mascot-fx-banner";
      banner.setAttribute("aria-hidden", "true");

      const img = document.createElement("img");
      img.className = "mascot-fx-img mascot-fx-" + effect;
      img.src = mascot.url;
      img.alt = mascot.alt;
      img.loading = "eager";
      img.decoding = "async";
      img.draggable = false;

      banner.appendChild(img);

      const scroll = screen.querySelector(".screen-scroll");
      if (scroll) {
        scroll.insertBefore(banner, scroll.firstChild);
      } else {
        screen.insertBefore(banner, screen.firstChild);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
