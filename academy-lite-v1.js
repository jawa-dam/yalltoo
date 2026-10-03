/* GEI Academy Lite V1 — isolated six-day celebration carousel.
   Owns only #screen-academy. Navigation remains the existing shell/navigation system.
*/
(() => {
  "use strict";
  if (window.GEI_ACADEMY_LITE_V1) return;
  window.GEI_ACADEMY_LITE_V1 = true;

  /* V1.64 — GEI ACADEMY VISUAL JOURNEY ENGINE
     Single source of truth for the six stages. Images stay on the remote GEI asset host. */
  const IMG = "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/";
  const DAYS = [
    { id: 1, label: "DAY 1", title: "Water & Light", url: "day-1.html",
      image: IMG + "water-and-light-dpqCHDjOwaDPVOqQ.jpg", alt: "GEI illustration of water and light",
      desc: "Observe separation, release, and movement.", tagline: "Begin where the water begins.",
      badge: { id: "day-1", title: "WATER OBSERVER" } },
    { id: 2, label: "DAY 2", title: "The Firmament", url: "day-2.html",
      image: IMG + "the-firmament-KWkSiVPn6VOEOcXI.jpg", alt: "GEI illustration of the firmament",
      desc: "Explore the engineered boundary above the waters.", tagline: "Unlock the next hydraulic stage.",
      badge: { id: "day-2", title: "DAM ENGINEER" } },
    { id: 3, label: "DAY 3", title: "Reservoir & Dry Land", url: "day-3.html",
      image: IMG + "reservoir-and-dry-land-LzuiBQOKSGx1acgN.jpg", alt: "GEI illustration of the reservoir and dry land",
      desc: "Discover containment, storage, and exposed ground.", tagline: "Gather the waters. Reveal the land.",
      badge: { id: "day-3", title: "RESERVOIR BUILDER" } },
    { id: 4, label: "DAY 4", title: "The Sluice", url: "day-4.html",
      image: IMG + "sluice-wRG3Ly2jvYsntJJ9.jpg", alt: "GEI illustration of a hydraulic sluice",
      desc: "Follow controlled water release toward the mill.", tagline: "Control the release.",
      badge: { id: "day-4", title: "GATE OPERATOR" } },
    { id: 5, label: "DAY 5", title: "The Waterwheel", url: "day-5.html",
      image: IMG + "waterwheel-1ovLckjBsg1t6HTO.jpg", alt: "GEI illustration of a waterwheel",
      desc: "Watch flowing water become mechanical motion.", tagline: "Turn flow into work.",
      badge: { id: "day-5", title: "WATERWHEEL ENGINEER" } },
    { id: 6, label: "DAY 6", title: "The Beast System", url: "day-6.html",
      image: IMG + "the-beast-system-n12kVf1mJASxRXjJ.jpg", alt: "GEI illustration of the beast system",
      desc: "Examine the complete engineered water-control system.", tagline: "See the whole system.",
      badge: { id: "day-6", title: "SYSTEM ARCHITECT" } }
  ];

  const completionKey = "geiDayCompletionV1";
  const xpKey = "geiAcademyProgressV1";
  const XP_PER_DAY = 111;
  const pad = n => String(n).padStart(2, "0");

  function readJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      const value = raw ? JSON.parse(raw) : fallback;
      return value && typeof value === "object" ? value : fallback;
    } catch (_) {
      return fallback;
    }
  }

  function completed(day) {
    const ledger = readJSON(completionKey, {});
    return ledger?.[day.id]?.completed === true &&
      Number(ledger?.[day.id]?.audioPercent || 0) >= 90;
  }

  function countCompleted() {
    return DAYS.filter(completed).length;
  }

  const XP_MAX = 666;
  const reducedMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;

  function earnedBadges() {
    try {
      const earned = window.GEI_BADGES?.getState?.()?.earned;
      return new Set(Array.isArray(earned) ? earned : []);
    } catch (_) { return new Set(); }
  }

  function currentXP() {
    try { return Math.min(XP_MAX, Math.max(0, Number(window.GEI_PROGRESS?.getState?.()?.xp) || 0)); }
    catch (_) { return 0; }
  }

  function injectStyles() {
    if (document.getElementById("gei-academy-lite-v1-style")) return;
    const style = document.createElement("style");
    style.id = "gei-academy-lite-v1-style";
    const S = "#screen-academy.gei-academy-lite-screen";
    style.textContent = `
      /* Containment only. The shared .app-screen + navigation.js control visibility. */
      ${S}{
        width:100%!important;height:100%!important;min-width:0!important;min-height:0!important;
        max-width:100%!important;max-height:100%!important;overflow:hidden!important;
        box-sizing:border-box!important;background:var(--skin-bg,#06070d)!important;
        padding:0!important;margin:0!important;touch-action:pan-y!important;
      }
      ${S} > #gei-quick-access{display:none!important}
      ${S} > .gei-lite-root{
        --cyan:#2fd2ff;--indigo:#3d3dea;--magenta:#f310ba;--pink:#ff9df2;--ink:#06070d;
        width:100%!important;height:100%!important;min-width:0!important;max-width:100%!important;
        display:flex!important;flex-direction:column!important;gap:16px!important;
        padding:14px 14px calc(104px + env(safe-area-inset-bottom))!important;margin:0!important;
        box-sizing:border-box!important;overflow-x:hidden!important;overflow-y:auto!important;
        overscroll-behavior-y:contain;-webkit-overflow-scrolling:touch;touch-action:pan-y!important;
        color:#eef4ff!important;
        background:radial-gradient(90% 40% at 85% 0%,rgba(61,61,234,.35),transparent 70%),radial-gradient(70% 35% at 0% 20%,rgba(47,210,255,.16),transparent 70%),linear-gradient(180deg,#0a0d1c 0%,#06070d 60%)!important;
        font-family:Plus Jakarta Sans,Inter,system-ui,sans-serif;
      }
      ${S} .gei-lite-root *{box-sizing:border-box!important;min-width:0}
      ${S} .gei-lite-root > *{flex:0 0 auto}

      /* Intro */
      ${S} .gei-lite-header{display:flex!important;align-items:flex-start!important;justify-content:space-between!important;gap:12px!important}
      ${S} .gei-lite-eyebrow{display:block!important;font-size:11px!important;font-weight:900!important;letter-spacing:.16em!important;color:var(--cyan)!important;text-transform:uppercase!important}
      ${S} .gei-lite-header h1{margin:6px 0 0!important;font-size:clamp(26px,7.6vw,38px)!important;line-height:1.02!important;letter-spacing:-.03em!important;color:#fff!important;text-wrap:balance}
      ${S} .gei-lite-header p{margin:8px 0 0!important;font-size:14px!important;line-height:1.5!important;color:#b9c6dc!important;max-width:60ch}
      ${S} .gei-lite-adam{flex:0 0 58px!important;width:58px!important;height:58px!important;padding:0!important;border-radius:50%!important;border:1.5px solid rgba(47,210,255,.6)!important;background:rgba(255,255,255,.06)!important;box-shadow:0 0 18px rgba(47,210,255,.35)!important;cursor:pointer!important;overflow:hidden!important;-webkit-tap-highlight-color:transparent}
      ${S} .gei-lite-adam img{width:100%!important;height:100%!important;object-fit:cover!important;display:block!important}
      ${S} .gei-lite-adam:focus-visible,${S} .gei-lite-play:focus-visible,${S} .gei-lite-arrow:focus-visible,${S} .gei-lite-card:focus-visible,${S} .gei-lite-guide-close:focus-visible,${S} .gei-lite-guide-go:focus-visible{outline:3px solid #fff!important;outline-offset:3px!important}

      /* Progress panel */
      ${S} .gei-lite-progress{padding:14px!important;border-radius:20px!important;border:1px solid rgba(47,210,255,.28)!important;background:linear-gradient(150deg,rgba(255,255,255,.08),rgba(255,255,255,.03))!important;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);box-shadow:0 14px 34px rgba(0,0,0,.35),inset 0 1px 0 rgba(255,255,255,.1)!important}
      ${S} .gei-lite-progress-top{display:flex!important;justify-content:space-between!important;align-items:flex-end!important;gap:10px!important}
      ${S} .gei-lite-progress-top small{display:block;font-size:10px;font-weight:900;letter-spacing:.14em;color:var(--cyan)}
      ${S} .gei-lite-progress-top strong{display:block;margin-top:3px;font-size:20px;line-height:1;color:#fff;letter-spacing:.01em}
      ${S} .gei-lite-xp-read{font-size:13px!important;font-weight:900!important;color:#ffe08a!important;white-space:nowrap}
      ${S} .gei-lite-segments{display:grid!important;grid-template-columns:repeat(6,1fr)!important;gap:5px!important;margin-top:12px!important}
      ${S} .gei-lite-segments i{height:9px;border-radius:99px;background:rgba(255,255,255,.12)}
      ${S} .gei-lite-segments i.is-done{background:linear-gradient(90deg,var(--cyan),#3ddc97);box-shadow:0 0 10px rgba(47,210,255,.55)}
      ${S} .gei-lite-segments i.is-next{background:rgba(47,210,255,.35);animation:geiLiteBlink 1.8s ease-in-out infinite}
      ${S} .gei-lite-progress-note{margin:10px 0 0!important;font-size:12.5px!important;line-height:1.4!important;color:#b9c6dc!important}

      /* Discover strip */
      ${S} .gei-lite-discover{display:grid!important;grid-template-columns:repeat(3,1fr)!important;gap:0!important;border-radius:16px!important;border:1px solid rgba(255,255,255,.12)!important;background:rgba(255,255,255,.04)!important;overflow:hidden}
      ${S} .gei-lite-discover div{padding:11px 8px!important;text-align:center!important;border-left:1px solid rgba(255,255,255,.1)}
      ${S} .gei-lite-discover div:first-child{border-left:0}
      ${S} .gei-lite-discover b{display:block;font-size:11px;font-weight:900;letter-spacing:.16em;color:#fff}
      ${S} .gei-lite-discover span{display:block;margin-top:4px;font-size:11px;line-height:1.3;color:#9fb0cc}
      ${S} .gei-lite-discover div:nth-child(1) b{color:var(--cyan)}
      ${S} .gei-lite-discover div:nth-child(2) b{color:#8c9bff}
      ${S} .gei-lite-discover div:nth-child(3) b{color:var(--pink)}

      /* Carousel */
      ${S} .gei-lite-carousel-wrap{display:flex!important;flex-direction:column!important;gap:10px!important;min-width:0!important}
      ${S} .gei-lite-section-label{display:flex!important;align-items:center!important;justify-content:space-between!important;font-size:11px!important;font-weight:900!important;letter-spacing:.13em!important;color:var(--cyan)!important}
      ${S} .gei-lite-section-label b{color:#b9c6dc!important;font-weight:800!important}
      ${S} .gei-lite-carousel{--cw:min(80vw,320px);--ih:calc(var(--cw) * .6);width:100%!important;max-width:100%!important;overflow-x:auto!important;overflow-y:hidden!important;display:flex!important;align-items:stretch!important;gap:0!important;scroll-snap-type:x mandatory!important;scrollbar-width:none!important;overscroll-behavior-x:contain!important;touch-action:pan-x pan-y!important;padding:8px calc(50% - var(--cw) / 2) 14px!important;margin:0!important}
      ${S} .gei-lite-carousel::-webkit-scrollbar{display:none!important}

      /* Hydraulic connector between scenes */
      ${S} .gei-lite-flow{flex:0 0 28px!important;height:3px!important;align-self:flex-start!important;margin-top:calc(8px + var(--ih) / 2)!important;border-radius:3px;background:linear-gradient(90deg,rgba(47,210,255,.25),rgba(47,210,255,.9),rgba(47,210,255,.25));background-size:200% 100%;box-shadow:0 0 10px rgba(47,210,255,.6);position:relative;z-index:2;animation:geiLiteFlow 2.4s linear infinite}
      ${S} .gei-lite-flow::after{content:"";position:absolute;right:-3px;top:50%;width:8px;height:8px;margin-top:-4px;border-radius:50%;background:#fff;box-shadow:0 0 10px var(--cyan),0 0 0 3px rgba(47,210,255,.35)}
      ${S} .gei-lite-flow.is-dim{background:linear-gradient(90deg,rgba(255,255,255,.12),rgba(255,255,255,.28),rgba(255,255,255,.12));box-shadow:none;animation:none}
      ${S} .gei-lite-flow.is-dim::after{background:#5b6477;box-shadow:0 0 0 3px rgba(255,255,255,.1)}

      ${S} .gei-lite-card{--lv:#2fd2ff;--lv2:#3d3dea;position:relative!important;overflow:hidden!important;isolation:isolate;flex:0 0 var(--cw)!important;width:var(--cw)!important;scroll-snap-align:center!important;display:flex!important;flex-direction:column!important;padding:0!important;margin:0!important;border-radius:24px!important;border:1.5px solid color-mix(in srgb,var(--lv) 45%,transparent)!important;background:linear-gradient(170deg,#141a33 0%,#0b1020 60%,#080b16 100%)!important;color:#eef4ff!important;box-shadow:0 14px 30px rgba(0,0,0,.4),inset 0 1px 0 rgba(255,255,255,.1)!important;transform:scale(.94);opacity:.78;transition:transform .28s ease,opacity .28s ease,box-shadow .28s ease,border-color .28s ease;-webkit-tap-highlight-color:transparent;cursor:pointer}
      ${S} .gei-lite-card.is-current{transform:none;opacity:1;box-shadow:0 18px 40px rgba(0,0,0,.5),0 0 30px color-mix(in srgb,var(--lv) 38%,transparent),inset 0 1px 0 rgba(255,255,255,.14)!important}
      ${S} .gei-lite-card.is-start.is-current{transform:scale(1.015);border-color:var(--cyan)!important;box-shadow:0 18px 44px rgba(0,0,0,.5),0 0 38px rgba(47,210,255,.55),inset 0 1px 0 rgba(255,255,255,.18)!important}
      ${S} .gei-lite-card.is-complete{--lv:#3ddc97;border-color:rgba(61,220,151,.7)!important;box-shadow:0 14px 30px rgba(0,0,0,.4),0 0 24px rgba(61,220,151,.35),inset 0 1px 0 rgba(255,255,255,.12)!important}
      ${S} .gei-lite-card.is-locked{--lv:#8c9bff}

      @media(hover:hover){
        ${S} .gei-lite-card:not(.is-locked):hover{transform:translateY(-4px);opacity:1;border-color:var(--lv)!important;box-shadow:0 20px 42px rgba(0,0,0,.5),0 0 34px color-mix(in srgb,var(--lv) 55%,transparent)!important}
        ${S} .gei-lite-card:not(.is-locked):hover .gei-lite-img{transform:scale(1.03)}
        ${S} .gei-lite-card:not(.is-locked):hover h2{color:#fff;text-shadow:0 0 14px color-mix(in srgb,var(--lv) 70%,transparent)}
      }
      ${S} .gei-lite-card:not(.is-locked):active{transform:translateY(-2px) scale(.99)}
      ${S} .gei-lite-card.is-discovering{transform:translateY(-6px)!important;opacity:1!important;box-shadow:0 22px 46px rgba(0,0,0,.55),0 0 46px color-mix(in srgb,var(--lv) 80%,transparent)!important}
      ${S} .gei-lite-card.is-discovering .gei-lite-img{transform:scale(1.04)!important}

      /* Image hero */
      ${S} .gei-lite-media{position:relative!important;height:var(--ih)!important;overflow:hidden!important;border-radius:22px 22px 0 0!important;background:linear-gradient(135deg,#16204a,#0a0f20)}
      ${S} .gei-lite-img{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;object-fit:cover!important;display:block!important;transform:scale(1);transition:transform .45s ease,filter .35s ease}
      ${S} .gei-lite-card.is-locked .gei-lite-img{filter:saturate(.55) brightness(.72)}
      ${S} .gei-lite-card.is-complete .gei-lite-img{filter:saturate(1.1) brightness(1.08)}
      ${S} .gei-lite-media::before{content:"";position:absolute;inset:0;z-index:1;background:linear-gradient(180deg,rgba(6,7,13,.55) 0%,rgba(6,7,13,0) 32%,rgba(6,7,13,0) 48%,rgba(6,7,13,.85) 100%);pointer-events:none}
      ${S} .gei-lite-card.is-locked .gei-lite-media::before{background:linear-gradient(180deg,rgba(6,7,13,.6) 0%,rgba(6,7,13,.18) 35%,rgba(6,7,13,.22) 50%,rgba(6,7,13,.88) 100%)}
      ${S} .gei-lite-card.is-start .gei-lite-media::after{content:"";position:absolute;top:0;left:-70%;width:45%;height:100%;z-index:1;background:linear-gradient(100deg,transparent,rgba(160,235,255,.28),transparent);transform:skewX(-14deg);animation:geiLiteShimmer 4.2s ease-in-out infinite;pointer-events:none}
      ${S} .gei-lite-card.is-complete .gei-lite-media{box-shadow:inset 0 0 28px rgba(61,220,151,.45)}
      ${S} .gei-lite-card.is-fresh.is-complete{animation:geiLiteMastery 1.4s ease-out 1}

      ${S} .gei-lite-card-top{position:absolute!important;top:10px!important;left:10px!important;right:10px!important;z-index:2;display:flex!important;align-items:center!important;justify-content:space-between!important;gap:8px!important}
      ${S} .gei-lite-level{display:inline-flex!important;align-items:baseline!important;gap:5px!important;padding:6px 10px!important;border-radius:9px!important;background:rgba(6,7,13,.62)!important;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);border:1px solid color-mix(in srgb,var(--lv) 55%,transparent)!important;color:var(--lv)!important;font-size:10px!important;font-weight:900!important;letter-spacing:.14em!important;line-height:1!important}
      ${S} .gei-lite-level b{color:#fff!important;font-size:14px!important}
      ${S} .gei-lite-status{display:inline-flex;align-items:center;gap:5px;padding:6px 10px!important;border-radius:999px!important;line-height:1!important;font-size:10px!important;font-weight:900!important;letter-spacing:.1em!important;color:#06070d!important;background:var(--cyan)!important}
      ${S} .gei-lite-card.is-complete .gei-lite-status{background:#3ddc97!important}
      ${S} .gei-lite-card.is-locked .gei-lite-status{background:rgba(6,7,13,.7)!important;color:#d6def0!important;border:1px solid rgba(255,255,255,.25)}
      ${S} .gei-lite-card.is-ready:not(.is-start) .gei-lite-status{background:#8c9bff!important}
      ${S} .gei-lite-media h2{position:absolute!important;left:14px!important;right:14px!important;bottom:11px!important;z-index:2;margin:0!important;color:#fff!important;font-size:clamp(22px,6.4vw,27px)!important;line-height:1.05!important;letter-spacing:-.02em!important;text-shadow:0 2px 12px rgba(0,0,0,.7)!important;transition:text-shadow .25s ease}

      /* Card body */
      ${S} .gei-lite-body{display:flex!important;flex-direction:column!important;gap:10px!important;padding:13px 14px 14px!important;flex:1!important}
      ${S} .gei-lite-desc{margin:0!important;color:#d3dcee!important;font-size:13.5px!important;line-height:1.4!important}
      ${S} .gei-lite-tag{margin:0!important;color:var(--lv)!important;font-size:12px!important;font-weight:800!important;letter-spacing:.02em!important;font-style:italic}
      ${S} .gei-lite-reward{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:8px!important;padding:8px 10px!important;border-radius:12px!important;background:rgba(0,0,0,.35)!important;border:1px solid rgba(255,255,255,.1)!important;margin-top:auto!important}
      ${S} .gei-lite-badge{display:flex;align-items:center;gap:7px;font-size:11px;font-weight:900;letter-spacing:.06em;color:#9fb0cc;line-height:1.2}
      ${S} .gei-lite-badge.is-earned{color:#ffe08a}
      ${S} .gei-lite-xp{display:inline-flex;align-items:center;gap:4px;color:#ffe08a;font-size:11px;font-weight:900;letter-spacing:.05em;white-space:nowrap}
      ${S} .gei-lite-play{display:flex!important;align-items:center!important;justify-content:center!important;gap:8px!important;min-height:48px!important;padding:0 14px!important;border-radius:14px!important;background:linear-gradient(180deg,var(--lv),var(--lv2))!important;color:#06070d!important;border:0!important;text-decoration:none!important;font-size:13px!important;font-weight:900!important;letter-spacing:.08em!important;box-shadow:0 4px 0 color-mix(in srgb,var(--lv2) 60%,#000),0 8px 18px color-mix(in srgb,var(--lv) 30%,transparent),inset 0 1px 0 rgba(255,255,255,.45)!important;transition:transform .12s ease,box-shadow .12s ease;touch-action:manipulation;text-align:center}
      ${S} .gei-lite-card.is-start .gei-lite-play{background:linear-gradient(180deg,#5fe0ff,#2fd2ff 55%,#3d7bff)!important;color:#021019!important}
      ${S} .gei-lite-card.is-start.is-current .gei-lite-play{animation:geiLitePulse 2.2s ease-in-out infinite}
      ${S} .gei-lite-play:active{transform:translateY(3px)!important}
      ${S} .gei-lite-play.is-locked{background:rgba(255,255,255,.08)!important;color:#aab4c8!important;box-shadow:inset 0 0 0 1px rgba(255,255,255,.14)!important;pointer-events:none!important;font-size:11px!important;letter-spacing:.06em!important}
      ${S} .gei-lite-card.is-complete .gei-lite-play{background:linear-gradient(180deg,#5fe8b0,#1fa974)!important}

      /* Controls */
      ${S} .gei-lite-controls{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:8px!important}
      ${S} .gei-lite-arrow{width:48px!important;height:44px!important;border-radius:12px!important;cursor:pointer!important;border:1px solid rgba(255,255,255,.16)!important;background:linear-gradient(180deg,#1f2842,#111729)!important;color:#fff!important;font-size:24px!important;line-height:1!important;box-shadow:0 3px 0 #05070d,inset 0 1px 0 rgba(255,255,255,.1)!important}
      ${S} .gei-lite-arrow:active{transform:translateY(2px)}
      ${S} .gei-lite-arrow:disabled{opacity:.35!important;cursor:default!important}
      ${S} .gei-lite-dots{display:flex!important;justify-content:center!important;align-items:center!important;gap:0!important;flex:1!important}
      ${S} .gei-lite-dot{width:24px!important;height:32px!important;padding:0!important;border:0!important;background:transparent!important;cursor:pointer;position:relative;-webkit-tap-highlight-color:transparent}
      ${S} .gei-lite-dot::before{content:"";position:absolute;left:50%;top:50%;width:8px;height:8px;margin:-4px 0 0 -4px;border-radius:3px;transform:rotate(45deg);background:rgba(160,175,200,.4);transition:all .2s ease}
      ${S} .gei-lite-dot.is-done::before{background:#3ddc97}
      ${S} .gei-lite-dot.is-active::before{background:var(--cyan);transform:rotate(45deg) scale(1.4);box-shadow:0 0 8px var(--cyan)}
      ${S} .gei-lite-dot:focus-visible{outline:3px solid #fff;outline-offset:-2px;border-radius:8px}
      ${S} .gei-lite-hint{margin:0!important;text-align:center!important;font-size:10.5px!important;font-weight:900!important;letter-spacing:.14em!important;color:#8fa3c4!important;transition:opacity .4s ease}
      ${S} .gei-lite-hint.is-hidden{opacity:0;pointer-events:none}

      /* Adam guide */
      ${S} .gei-lite-guide{position:fixed;inset:0;z-index:60;display:grid;place-items:end center;padding:16px 16px calc(96px + env(safe-area-inset-bottom))}
      ${S} .gei-lite-guide[hidden]{display:none!important}
      ${S} .gei-lite-guide-backdrop{position:absolute;inset:0;background:rgba(3,4,9,.65);border:0;padding:0;cursor:pointer}
      ${S} .gei-lite-guide-card{position:relative;width:min(100%,420px);display:grid;grid-template-columns:64px 1fr;gap:12px;padding:16px;border-radius:22px;border:1px solid rgba(47,210,255,.5);background:linear-gradient(160deg,#18203a,#0b1020);box-shadow:0 20px 50px rgba(0,0,0,.6),0 0 30px rgba(47,210,255,.25);color:#eef4ff}
      ${S} .gei-lite-guide-card img{width:64px;height:64px;border-radius:50%;object-fit:cover;border:1.5px solid var(--cyan)}
      ${S} .gei-lite-guide-card small{font-size:10px;font-weight:900;letter-spacing:.14em;color:var(--cyan)}
      ${S} .gei-lite-guide-card p{margin:5px 0 12px;font-size:14px;line-height:1.45;color:#d3dcee}
      ${S} .gei-lite-guide-go{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:0 16px;border-radius:12px;background:linear-gradient(180deg,#5fe0ff,#2fd2ff);color:#021019;font-size:12px;font-weight:900;letter-spacing:.08em;text-decoration:none}
      ${S} .gei-lite-guide-close{position:absolute;top:6px;right:6px;width:44px;height:44px;border:0;background:transparent;color:#b9c6dc;font-size:24px;cursor:pointer}

      @keyframes geiLiteFlow{0%{background-position:0 0}100%{background-position:-200% 0}}
      @keyframes geiLiteShimmer{0%,60%{left:-70%}100%{left:140%}}
      @keyframes geiLiteBlink{0%,100%{opacity:.55}50%{opacity:1}}
      @keyframes geiLitePulse{0%,100%{box-shadow:0 4px 0 #1c4fb0,0 8px 18px rgba(47,210,255,.3),0 0 0 0 rgba(47,210,255,.55)}50%{box-shadow:0 4px 0 #1c4fb0,0 8px 18px rgba(47,210,255,.3),0 0 0 7px rgba(47,210,255,0)}}
      @keyframes geiLiteMastery{0%{box-shadow:0 0 0 0 rgba(61,220,151,.9)}100%{box-shadow:0 0 0 22px rgba(61,220,151,0)}}

      @media(min-width:768px){
        ${S} > .gei-lite-root{padding:22px 28px calc(104px + env(safe-area-inset-bottom))!important;gap:20px!important}
        ${S} .gei-lite-carousel{--cw:340px}
        ${S} .gei-lite-header p{font-size:15px!important}
      }
      @media(min-width:1024px){
        ${S} > .gei-lite-root{max-width:1180px!important;margin:0 auto!important}
        ${S} .gei-lite-carousel{--cw:360px}
      }
      @media(max-width:600px){
        ${S} > .gei-lite-root{gap:12px!important;padding-top:12px!important}
        ${S} .gei-lite-header h1{font-size:clamp(23px,6.6vw,30px)!important}
        ${S} .gei-lite-header p{font-size:12.5px!important;line-height:1.42!important;margin-top:6px!important}
        ${S} .gei-lite-adam{flex-basis:50px!important;width:50px!important;height:50px!important}
        ${S} .gei-lite-progress{padding:11px 12px!important}
        ${S} .gei-lite-progress-top strong{font-size:17px!important}
        ${S} .gei-lite-segments{margin-top:9px!important}
        ${S} .gei-lite-progress-note{display:none!important}
      }
      @media(max-width:600px) and (max-height:780px){
        ${S} .gei-lite-header p{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
        ${S} .gei-lite-carousel{--ih:calc(var(--cw) * .5)}
        ${S} .gei-lite-body{gap:8px!important;padding-top:11px!important}
      }
      @media(max-width:380px){
        ${S} > .gei-lite-root{padding-left:10px!important;padding-right:10px!important}
        ${S} .gei-lite-carousel{--cw:min(84vw,320px)}
        ${S} .gei-lite-discover span{font-size:10.5px!important}
        ${S} .gei-lite-reward{flex-wrap:wrap}
      }
      @media(prefers-reduced-motion:reduce){
        ${S} .gei-lite-card,${S} .gei-lite-img,${S} .gei-lite-play,${S} .gei-lite-dot::before,${S} .gei-lite-hint{transition:none!important}
        ${S} .gei-lite-flow,${S} .gei-lite-media::after,${S} .gei-lite-play,${S} .gei-lite-card,${S} .gei-lite-segments i{animation:none!important}
        ${S} .gei-lite-card:hover,${S} .gei-lite-card:hover .gei-lite-img,${S} .gei-lite-card.is-discovering,${S} .gei-lite-card.is-discovering .gei-lite-img{transform:none!important}
      }
    `;
    document.head.appendChild(style);
  }

  const seenMastery = new Set();
  let firstRender = true;

  function cardMarkup(day, ctx) {
    const done = completed(day);
    const unlocked = day.id === 1 || completed(DAYS[day.id - 2]);
    const state = done ? "is-complete" : unlocked ? "is-ready" : "is-locked";
    const start = day.id === 1 && !done && ctx.doneCount === 0;
    const status = done ? "✓ MASTERED" : start ? "START HERE" : unlocked ? "UNLOCKED" : "🔒 LOCKED";
    const cta = done ? `↻ REVIEW DAY ${day.id}`
      : start ? "ENTER DAY 1 →"
      : unlocked ? `ENTER DAY ${day.id} →`
      : `COMPLETE DAY ${day.id - 1} TO UNLOCK`;
    const earned = ctx.badges.has(day.badge.id);
    const fresh = done && !firstRender && !seenMastery.has(day.id);
    if (done) seenMastery.add(day.id);
    const tagline = start ? "Begin where the water begins." : unlocked ? day.tagline : "Unlock the next hydraulic stage.";
    return `
      <article class="gei-lite-card ${state}${start ? " is-start" : ""}${fresh ? " is-fresh" : ""}" data-day="${day.id}" data-unlocked="${unlocked}" aria-label="Day ${day.id}: ${day.title}, ${done ? "mastered" : unlocked ? "unlocked" : "locked"}">
        <div class="gei-lite-media">
          <img class="gei-lite-img" src="${day.image}" alt="${day.alt}" loading="${day.id <= 2 ? "eager" : "lazy"}" decoding="async" draggable="false" />
          <div class="gei-lite-card-top">
            <span class="gei-lite-level">DAY <b>${pad(day.id)}</b></span>
            <span class="gei-lite-status">${status}</span>
          </div>
          <h2>${day.title}</h2>
        </div>
        <div class="gei-lite-body">
          <p class="gei-lite-desc">${day.title} — ${day.desc.charAt(0).toLowerCase() + day.desc.slice(1)}</p>
          <p class="gei-lite-tag">${tagline}</p>
          <div class="gei-lite-reward">
            <span class="gei-lite-badge${earned ? " is-earned" : ""}"><span aria-hidden="true">🏆</span><span>${earned ? day.badge.title : "BADGE LOCKED"}</span></span>
            <span class="gei-lite-xp"><span aria-hidden="true">★</span>+${XP_PER_DAY} XP</span>
          </div>
          <a class="gei-lite-play${unlocked ? "" : " is-locked"}" href="${day.url}"${unlocked ? "" : ' aria-disabled="true" tabindex="-1"'}>${cta}</a>
        </div>
      </article>`;
  }

  function render() {
    const screen = document.getElementById("screen-academy");
    if (!screen) return;
    injectStyles();
    screen.classList.add("gei-academy-lite-screen");
    const keepScroll = screen.querySelector(".gei-lite-root")?.scrollTop || 0;
    const doneCount = countCompleted();
    const firstOpen = Math.min(DAYS.length - 1, doneCount);
    const nextDay = doneCount >= DAYS.length ? 1 : doneCount + 1;
    const xp = currentXP();
    const badges = earnedBadges();
    const ctx = { doneCount, badges };
    const mascot = window.GEI_MASCOT || { url: "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/yalltoo-mascot-animated-UgmkGIe3sJES4tKm.gif", alt: "Adam, the YallToo mascot" };
    const note = doneCount >= DAYS.length ? "Six-day blueprint mastered. Revisit any stage."
      : doneCount === 0 ? "Start with Day 1 — each mastered day unlocks the next stage."
      : `Day ${nextDay} is your next hydraulic checkpoint.`;
    const guideMsg = doneCount >= DAYS.length ? "You completed the full blueprint. Revisit any stage to see the water again."
      : doneCount === 0 ? "Ready to follow the water? Start with Day 1 and I'll guide you through the blueprint."
      : `Day ${nextDay} is your next unlocked stage. Ready to keep following the water?`;
    const flows = (i) => i < DAYS.length - 1
      ? `<span class="gei-lite-flow${completed(DAYS[i]) || i === 0 ? "" : " is-dim"}" aria-hidden="true"></span>` : "";

    screen.innerHTML = `
      <div class="gei-lite-root">
        <header class="gei-lite-header">
          <div class="gei-lite-heading">
            <span class="gei-lite-eyebrow">GEI ACADEMY</span>
            <h1>The Mountain to Ocean Blueprint</h1>
            <p>Follow the water through six engineered stages — from source, separation and containment to controlled release, mechanical motion and the complete system.</p>
          </div>
          <button class="gei-lite-adam" type="button" data-lite-adam aria-label="Open Adam, your GEI guide" aria-expanded="false"><img src="${mascot.url}" alt="" /></button>
        </header>

        <section class="gei-lite-progress" aria-label="Blueprint progress">
          <div class="gei-lite-progress-top">
            <div><small>BLUEPRINT</small><strong data-lite-count>${doneCount} / 6 STAGES</strong></div>
            <span class="gei-lite-xp-read" data-lite-xp>${xp} / ${XP_MAX} XP</span>
          </div>
          <div class="gei-lite-segments" role="progressbar" aria-label="Stages mastered" aria-valuemin="0" aria-valuemax="6" aria-valuenow="${doneCount}">
            ${DAYS.map((d, i) => `<i class="${i < doneCount ? "is-done" : i === doneCount ? "is-next" : ""}"></i>`).join("")}
          </div>
          <p class="gei-lite-progress-note">${note}</p>
        </section>

        <section class="gei-lite-carousel-wrap" aria-label="Six GEI Academy stages">
          <div class="gei-lite-section-label"><span>YOUR HYDRAULIC JOURNEY</span><b data-lite-pos>DAY 1 OF 6</b></div>
          <div class="gei-lite-carousel" id="gei-lite-carousel" role="group" aria-label="Stage carousel. Use left and right arrow keys to browse stages." tabindex="0">
            ${DAYS.map((d, i) => cardMarkup(d, ctx) + flows(i)).join("")}
          </div>
          <div class="gei-lite-controls" aria-label="Carousel controls">
            <button class="gei-lite-arrow" type="button" data-dir="-1" aria-label="Previous stage">‹</button>
            <div class="gei-lite-dots">
              ${DAYS.map((d, i) => `<button type="button" class="gei-lite-dot${completed(d) ? " is-done" : ""}" data-go="${i}" aria-label="Go to Day ${d.id}: ${d.title}"></button>`).join("")}
            </div>
            <button class="gei-lite-arrow" type="button" data-dir="1" aria-label="Next stage">›</button>
          </div>
          <p class="gei-lite-hint" data-lite-hint>SWIPE TO EXPLORE THE BLUEPRINT →</p>
        </section>

        <section class="gei-lite-discover" aria-label="What you will discover">
          <div><b>WATER</b><span>Source &amp; separation</span></div>
          <div><b>STRUCTURE</b><span>Containment &amp; control</span></div>
          <div><b>MOTION</b><span>Flow into work</span></div>
        </section>

        <div class="gei-lite-guide" data-lite-guide hidden>
          <button class="gei-lite-guide-backdrop" type="button" data-lite-guide-close aria-label="Close Adam guide"></button>
          <section class="gei-lite-guide-card" role="dialog" aria-modal="true" aria-labelledby="gei-lite-guide-title">
            <button class="gei-lite-guide-close" type="button" data-lite-guide-close aria-label="Close Adam guide">×</button>
            <img src="${mascot.url}" alt="${mascot.alt || "Adam, the YallToo mascot"}" />
            <div>
              <small id="gei-lite-guide-title">ADAM • YOUR GEI GUIDE</small>
              <p>${guideMsg}</p>
              <a class="gei-lite-guide-go" href="day-${nextDay}.html">${doneCount >= DAYS.length ? "REVIEW DAY 1" : `CONTINUE DAY ${nextDay}`} →</a>
            </div>
          </section>
        </div>
      </div>`;

    firstRender = false;
    const root = screen.querySelector(".gei-lite-root");
    if (root && keepScroll) root.scrollTop = keepScroll;
    const carousel = screen.querySelector("#gei-lite-carousel");
    const dots = Array.from(screen.querySelectorAll(".gei-lite-dot"));
    const cards = Array.from(screen.querySelectorAll(".gei-lite-card"));
    const arrows = Array.from(screen.querySelectorAll(".gei-lite-arrow"));
    const pos = screen.querySelector("[data-lite-pos]");
    const hint = screen.querySelector("[data-lite-hint]");
    let index = -1;

    const mark = (i) => {
      if (i === index) return;
      index = i;
      cards.forEach((c, n) => c.classList.toggle("is-current", n === i));
      dots.forEach((d, n) => {
        d.classList.toggle("is-active", n === i);
        if (n === i) d.setAttribute("aria-current", "true"); else d.removeAttribute("aria-current");
      });
      if (pos) pos.textContent = `DAY ${i + 1} OF ${DAYS.length}`;
      if (arrows[0]) arrows[0].disabled = i === 0;
      if (arrows[1]) arrows[1].disabled = i === DAYS.length - 1;
    };

    const scrollToCard = (i, smooth) => {
      const card = cards[i];
      if (!card || !carousel) return;
      const left = card.offsetLeft - (carousel.clientWidth - card.offsetWidth) / 2;
      carousel.scrollTo({ left: Math.max(0, left), behavior: smooth && !reducedMotion() ? "smooth" : "auto" });
    };
    const go = (i) => {
      const next = Math.max(0, Math.min(DAYS.length - 1, i));
      mark(next);
      scrollToCard(next, true);
    };

    arrows.forEach(btn => btn.addEventListener("click", () => go(index + Number(btn.dataset.dir))));
    dots.forEach(dot => dot.addEventListener("click", () => go(Number(dot.dataset.go))));
    carousel?.addEventListener("keydown", (e) => {
      if (e.target !== carousel) return;
      if (e.key === "ArrowRight") { e.preventDefault(); go(index + 1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); go(index - 1); }
      else if (e.key === "Home") { e.preventDefault(); go(0); }
      else if (e.key === "End") { e.preventDefault(); go(DAYS.length - 1); }
    });

    let userScrolled = false;
    carousel?.addEventListener("scroll", () => {
      const center = carousel.scrollLeft + carousel.clientWidth / 2;
      let closest = 0, best = Infinity;
      cards.forEach((card, i) => {
        const d = Math.abs(center - (card.offsetLeft + card.offsetWidth / 2));
        if (d < best) { best = d; closest = i; }
      });
      mark(closest);
      if (userScrolled && hint) hint.classList.add("is-hidden");
    }, { passive: true });
    carousel?.addEventListener("pointerdown", () => { userScrolled = true; }, { once: true });
    if (doneCount > 0) hint?.classList.add("is-hidden");

    // Discover: lift + zoom + glow, then navigate shortly after. Locked stages never navigate.
    cards.forEach(card => {
      card.addEventListener("click", (e) => {
        if (card.dataset.unlocked !== "true") { e.preventDefault(); return; }
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button > 0) return;
        const link = card.querySelector(".gei-lite-play");
        const href = link?.getAttribute("href");
        if (!href) return;
        e.preventDefault();
        if (reducedMotion()) { location.href = href; return; }
        card.classList.add("is-discovering");
        setTimeout(() => { location.href = href; }, 170);
      });
    });

    // Adam guide
    const guide = screen.querySelector("[data-lite-guide]");
    const adam = screen.querySelector("[data-lite-adam]");
    let prevFocus = null;
    const closeGuide = () => {
      if (!guide || guide.hidden) return;
      guide.hidden = true;
      adam?.setAttribute("aria-expanded", "false");
      prevFocus?.focus?.();
      prevFocus = null;
    };
    const openGuide = () => {
      if (!guide) return;
      prevFocus = document.activeElement;
      guide.hidden = false;
      adam?.setAttribute("aria-expanded", "true");
      guide.querySelector(".gei-lite-guide-go")?.focus();
    };
    adam?.addEventListener("click", openGuide);
    guide?.querySelectorAll("[data-lite-guide-close]").forEach(b => b.addEventListener("click", closeGuide));
    guide?.addEventListener("keydown", (e) => { if (e.key === "Escape") closeGuide(); });

    mark(firstOpen);
    requestAnimationFrame(() => scrollToCard(firstOpen, false));
  }

  function init() {
    window.addEventListener("gei:navigation", e => {
      if (e.detail?.id === "academy") render();
    });
    ["gei:progress-updated","gei:badges-updated","gei:badges-ready"].forEach(n => window.addEventListener(n, render));
    window.addEventListener("gei:day-completion", render);
    window.addEventListener("storage", render);
    if (location.hash === "#academy" || document.getElementById("screen-academy")?.classList.contains("is-active")) render();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, {once:true});
  else init();
})();