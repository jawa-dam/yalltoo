/* GEI Academy Lite V1 — isolated six-day celebration carousel.
   Owns only #screen-academy. Navigation remains the existing shell/navigation system.
*/
(() => {
  "use strict";
  if (window.GEI_ACADEMY_LITE_V1) return;
  window.GEI_ACADEMY_LITE_V1 = true;

  const DAYS = [
    { id: 1, title: "Water & Light", icon: "💧", desc: "Separate the waters and begin the hydraulic blueprint.", url: "day-1.html" },
    { id: 2, title: "The Firmament", icon: "🧱", desc: "Build the separating wall—the dam structure.", url: "day-2.html" },
    { id: 3, title: "Reservoir & Dry Land", icon: "🌊", desc: "Gather the waters and reveal the dry land.", url: "day-3.html" },
    { id: 4, title: "The Sluice", icon: "🚪", desc: "Control the release of water toward the mill.", url: "day-4.html" },
    { id: 5, title: "The Waterwheel", icon: "⚙️", desc: "Turn flowing water into useful work.", url: "day-5.html" },
    { id: 6, title: "The Beast System", icon: "🏗️", desc: "Complete the six-stage engineered system.", url: "day-6.html" }
  ];

  const completionKey = "geiDayCompletionV1";
  const xpKey = "geiAcademyProgressV1";

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

  function xp() {
    const state = readJSON(xpKey, {});
    return Math.max(0, Number(state?.xp) || 0);
  }

  function countCompleted() {
    return DAYS.filter(completed).length;
  }

  function injectStyles() {
    if (document.getElementById("gei-academy-lite-v1-style")) return;
    const style = document.createElement("style");
    style.id = "gei-academy-lite-v1-style";
    style.textContent = `
      /* Containment only. The shared .app-screen + navigation.js control visibility. */
      #screen-academy.gei-academy-lite-screen{
        width:100%!important;height:100%!important;min-width:0!important;min-height:0!important;
        max-width:100%!important;max-height:100%!important;overflow:hidden!important;
        box-sizing:border-box!important;
        background:var(--skin-bg,#f7f9fc)!important;
        padding:0!important;margin:0!important;
      }
      #screen-academy.gei-academy-lite-screen > #gei-quick-access{display:none!important}
      #screen-academy.gei-academy-lite-screen > .gei-lite-root{
        width:100%!important;height:100%!important;
        min-width:0!important;min-height:0!important;max-width:100%!important;max-height:100%!important;
        display:grid!important;grid-template-rows:auto auto minmax(0,1fr)!important;
        gap:0!important;padding:12px 12px calc(96px + env(safe-area-inset-bottom))!important;margin:0!important;
        box-sizing:border-box!important;overflow:hidden!important;
        color:var(--skin-text,#102a43)!important;background:transparent!important;
      }
      /* Neutralize legacy Academy selector families while Lite is active. */
      /* Lite does not create any legacy .academy-* nodes. No global reset is needed. */
      #screen-academy.gei-academy-lite-screen .gei-lite-header,
      #screen-academy.gei-academy-lite-screen .gei-lite-menu,
      #screen-academy.gei-academy-lite-screen .gei-lite-carousel-wrap,
      #screen-academy.gei-academy-lite-screen .gei-lite-card,
      #screen-academy.gei-academy-lite-screen .gei-lite-card *{
        box-sizing:border-box!important;min-width:0!important;
      }
      #screen-academy.gei-academy-lite-screen .gei-lite-header{
        display:flex!important;align-items:flex-start!important;justify-content:space-between!important;
        gap:10px!important;overflow:hidden!important;
      }
      #screen-academy.gei-academy-lite-screen .gei-lite-header h1{
        margin:4px 0 0!important;font-size:clamp(27px,7.7vw,38px)!important;
        line-height:1!important;letter-spacing:-.035em!important;overflow-wrap:anywhere!important;
      }
      #screen-academy.gei-academy-lite-screen .gei-lite-heading{min-width:0;max-width:calc(100% - 82px)!important}
      #screen-academy.gei-academy-lite-screen .gei-lite-heading h1{
        display:block!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;
        font-size:clamp(30px,8vw,38px)!important;line-height:1!important;
      }
      #screen-academy.gei-academy-lite-screen .gei-lite-header p{
        margin:5px 0 0!important;font-size:14px!important;line-height:1.25!important;
        color:var(--skin-muted,#526b82)!important;
      }
      #screen-academy.gei-academy-lite-screen .gei-lite-eyebrow{
        display:block!important;font-size:10px!important;font-weight:900!important;letter-spacing:.14em!important;
        color:var(--skin-accent,#007ea3)!important;text-transform:uppercase!important;
      }
      #screen-academy.gei-academy-lite-screen .gei-lite-chip{
        flex:0 0 72px!important;display:grid!important;place-items:center!important;min-width:72px!important;
        padding:8px!important;border:1px solid rgba(0,126,163,.25)!important;border-radius:14px!important;
        background:rgba(255,255,255,.76)!important;color:var(--skin-text,#102a43)!important;
      }
      #screen-academy.gei-academy-lite-screen .gei-lite-chip strong{font-size:18px!important;line-height:1!important}
      #screen-academy.gei-academy-lite-screen .gei-lite-chip small{margin-top:3px!important;font-size:8px!important;font-weight:900!important;letter-spacing:.1em!important}
      #screen-academy.gei-academy-lite-screen .gei-lite-menu{
        margin-top:10px!important;display:block!important;overflow:visible!important;
      }
      #screen-academy.gei-academy-lite-screen .gei-lite-menu-btn{
        display:flex!important;align-items:center!important;justify-content:space-between!important;width:100%!important;
        min-height:46px!important;padding:0 13px!important;margin:0!important;
        border:1px solid rgba(0,126,163,.25)!important;border-radius:15px!important;
        background:rgba(255,255,255,.88)!important;color:var(--skin-text,#102a43)!important;
        font:inherit!important;font-size:14px!important;font-weight:900!important;text-align:left!important;cursor:pointer!important;
      }
      #screen-academy.gei-academy-lite-screen .gei-lite-menu-panel{
        display:none!important;max-height:38vh!important;overflow:auto!important;
        margin-top:6px!important;padding:8px!important;border-radius:14px!important;
        border:1px solid rgba(0,126,163,.18)!important;background:rgba(255,255,255,.98)!important;
        box-shadow:0 12px 30px rgba(16,42,67,.12)!important;
      }
      #screen-academy.gei-academy-lite-screen .gei-lite-menu-panel.is-open{
        display:grid!important;gap:6px!important;
      }
      #screen-academy.gei-academy-lite-screen .gei-lite-menu-panel a{
        display:block!important;padding:10px!important;border-radius:10px!important;
        color:var(--skin-text,#102a43)!important;text-decoration:none!important;
        background:rgba(0,126,163,.06)!important;font-size:12px!important;font-weight:800!important;
      }
      #screen-academy.gei-academy-lite-screen .gei-lite-carousel-wrap{
        min-height:0!important;display:grid!important;grid-template-rows:auto minmax(0,1fr) auto!important;
        gap:7px!important;margin-top:11px!important;overflow:hidden!important;
      }
      #screen-academy.gei-academy-lite-screen .gei-lite-section-label{
        font-size:10px!important;font-weight:900!important;letter-spacing:.13em!important;
        color:var(--skin-accent,#007ea3)!important;
      }
      #screen-academy.gei-academy-lite-screen .gei-lite-carousel{
        min-height:0!important;width:100%!important;max-width:100%!important;
        overflow-x:auto!important;overflow-y:hidden!important;display:flex!important;gap:10px!important;
        scroll-snap-type:x mandatory!important;scrollbar-width:none!important;overscroll-behavior-x:contain!important;
        padding:2px 2px 8px!important;margin:0!important;
      }
      #screen-academy.gei-academy-lite-screen .gei-lite-carousel::-webkit-scrollbar{display:none!important}
      #screen-academy.gei-academy-lite-screen .gei-lite-card{
        flex:0 0 min(80vw,300px)!important;width:min(80vw,300px)!important;min-height:0!important;height:100%!important;
        max-height:100%!important;scroll-snap-align:center!important;display:grid!important;
        grid-template-rows:auto auto minmax(0,1fr) auto!important;gap:8px!important;padding:15px!important;margin:0!important;
        border-radius:22px!important;border:1px solid rgba(0,126,163,.24)!important;
        background:linear-gradient(145deg,rgba(255,255,255,.98),rgba(239,247,251,.98))!important;
        color:var(--skin-text,#102a43)!important;box-shadow:0 10px 26px rgba(16,42,67,.11)!important;
      }
      #screen-academy.gei-academy-lite-screen .gei-lite-card.is-complete{
        border-color:rgba(21,140,95,.42)!important;
      }
      #screen-academy.gei-academy-lite-screen .gei-lite-card-top{
        display:flex!important;align-items:center!important;justify-content:space-between!important;gap:8px!important;
      }
      #screen-academy.gei-academy-lite-screen .gei-lite-day{font-size:11px!important;font-weight:900!important;letter-spacing:.12em!important}
      #screen-academy.gei-academy-lite-screen .gei-lite-status{
        font-size:8px!important;font-weight:900!important;letter-spacing:.08em!important;
        padding:5px 7px!important;border-radius:999px!important;background:rgba(0,126,163,.07)!important;
      }
      #screen-academy.gei-academy-lite-screen .gei-lite-icon{
        display:grid!important;place-items:center!important;width:64px!important;height:64px!important;
        border-radius:17px!important;background:rgba(0,126,163,.07)!important;font-size:35px!important;
      }
      #screen-academy.gei-academy-lite-screen .gei-lite-card h2{
        margin:0!important;font-size:clamp(24px,6.8vw,31px)!important;line-height:1.03!important;
        letter-spacing:-.03em!important;color:var(--skin-text,#102a43)!important;
      }
      #screen-academy.gei-academy-lite-screen .gei-lite-card p{
        margin:6px 0 0!important;color:var(--skin-muted,#526b82)!important;
        font-size:13px!important;line-height:1.35!important;
      }
      #screen-academy.gei-academy-lite-screen .gei-lite-card a{
        display:flex!important;align-items:center!important;justify-content:space-between!important;min-height:46px!important;
        padding:0 13px!important;border-radius:13px!important;background:var(--skin-accent,#007ea3)!important;
        color:#fff!important;text-decoration:none!important;font-size:11px!important;font-weight:900!important;
        letter-spacing:.04em!important;
      }
      #screen-academy.gei-academy-lite-screen .gei-lite-card a.is-locked{
        background:rgba(16,42,67,.07)!important;color:var(--skin-muted,#526b82)!important;pointer-events:none!important;
      }
      #screen-academy.gei-academy-lite-screen .gei-lite-controls{
        display:flex!important;align-items:center!important;justify-content:space-between!important;gap:8px!important;
      }
      #screen-academy.gei-academy-lite-screen .gei-lite-arrow{
        width:44px!important;height:40px!important;border:1px solid rgba(0,126,163,.22)!important;
        border-radius:12px!important;background:#fff!important;color:var(--skin-text,#102a43)!important;
        font-size:25px!important;cursor:pointer!important;
      }
      #screen-academy.gei-academy-lite-screen .gei-lite-dots{
        display:flex!important;justify-content:center!important;gap:6px!important;flex:1!important;
      }
      #screen-academy.gei-academy-lite-screen .gei-lite-dot{
        width:7px!important;height:7px!important;border-radius:50%!important;background:rgba(16,42,67,.2)!important;
      }
      #screen-academy.gei-academy-lite-screen .gei-lite-dot.is-active{
        background:var(--skin-accent,#007ea3)!important;transform:scale(1.22)!important;
      }
      @media(max-width:360px){
        #screen-academy.gei-academy-lite-screen > .gei-lite-root{padding:10px 9px 84px!important}
        #screen-academy.gei-academy-lite-screen .gei-lite-card{flex-basis:86vw!important;width:86vw!important;padding:13px!important}
      }
    `;
    document.head.appendChild(style);
  }

  function menuMarkup() {
    return "";
  }

    function init() {
    window.addEventListener("gei:navigation", e => {
      if (e.detail?.id === "academy") render();
    });
    window.addEventListener("gei:progress-updated", render);
    window.addEventListener("gei:day-completion", render);
    window.addEventListener("storage", render);
    if (location.hash === "#academy" || document.getElementById("screen-academy")?.classList.contains("is-active")) render();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, {once:true});
  else init();
})();