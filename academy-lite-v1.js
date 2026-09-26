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
        box-sizing:border-box!important;
        background:var(--skin-bg,#f7f9fc)!important;
        padding:0!important;margin:0!important;
      }
      ${S} > #gei-quick-access{display:none!important}
      ${S} > .gei-lite-root{
        width:100%!important;height:100%!important;
        min-width:0!important;min-height:0!important;max-width:100%!important;max-height:100%!important;
        display:grid!important;grid-template-rows:auto minmax(0,1fr)!important;
        gap:0!important;padding:12px 12px calc(96px + env(safe-area-inset-bottom))!important;margin:0!important;
        box-sizing:border-box!important;overflow:hidden!important;
        color:var(--skin-text,#102a43)!important;background:transparent!important;
      }
      ${S} .gei-lite-root *{box-sizing:border-box!important;min-width:0}

      ${S} .gei-lite-header{display:flex!important;align-items:flex-start!important;justify-content:space-between!important;gap:10px!important;overflow:hidden!important}
      ${S} .gei-lite-heading{min-width:0;max-width:calc(100% - 82px)!important}
      ${S} .gei-lite-heading h1{display:block!important;margin:4px 0 0!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;font-size:clamp(30px,8vw,38px)!important;line-height:1!important;letter-spacing:-.035em!important}
      ${S} .gei-lite-header p{margin:5px 0 0!important;font-size:14px!important;line-height:1.25!important;color:var(--skin-muted,#526b82)!important}
      ${S} .gei-lite-eyebrow{display:block!important;font-size:10px!important;font-weight:900!important;letter-spacing:.14em!important;color:var(--skin-accent,#007ea3)!important;text-transform:uppercase!important}
      ${S} .gei-lite-chip{flex:0 0 72px!important;display:grid!important;place-items:center!important;padding:8px 6px!important;border-radius:14px!important;border:1px solid rgba(255,209,102,.45)!important;background:linear-gradient(160deg,#1b2238,#0c1120)!important;color:#ffe6a3!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.08),0 6px 16px rgba(0,0,0,.25)!important}
      ${S} .gei-lite-chip strong{font-size:18px!important;line-height:1!important;color:#fff!important}
      ${S} .gei-lite-chip small{margin-top:3px!important;font-size:8px!important;font-weight:900!important;letter-spacing:.12em!important}

      ${S} .gei-lite-carousel-wrap{min-height:0!important;display:grid!important;grid-template-rows:auto minmax(0,1fr) auto!important;gap:8px!important;margin-top:14px!important;overflow:hidden!important}
      ${S} .gei-lite-section-label{display:flex!important;align-items:center!important;justify-content:space-between!important;font-size:10px!important;font-weight:900!important;letter-spacing:.13em!important;color:var(--skin-accent,#007ea3)!important}
      ${S} .gei-lite-section-label b{color:var(--skin-muted,#526b82)!important;font-weight:800!important}
      ${S} .gei-lite-carousel{min-height:0!important;width:100%!important;max-width:100%!important;overflow-x:auto!important;overflow-y:hidden!important;display:flex!important;gap:12px!important;scroll-snap-type:x mandatory!important;scrollbar-width:none!important;overscroll-behavior-x:contain!important;padding:4px 2px 10px!important;margin:0!important}
      ${S} .gei-lite-carousel::-webkit-scrollbar{display:none!important}

      ${S} .gei-lite-card{--lv:#35d0ff;--lv2:#1a7dff;position:relative!important;overflow:hidden!important;isolation:isolate;flex:0 0 min(80vw,300px)!important;width:min(80vw,300px)!important;height:100%!important;min-height:0!important;max-height:100%!important;scroll-snap-align:center!important;display:grid!important;grid-template-rows:auto auto auto minmax(0,1fr) auto auto!important;justify-items:stretch!important;gap:10px!important;padding:14px!important;margin:0!important;border-radius:24px!important;border:1.5px solid color-mix(in srgb,var(--lv) 55%,transparent)!important;background:radial-gradient(120% 70% at 50% 0%,color-mix(in srgb,var(--lv) 30%,transparent) 0%,transparent 60%),linear-gradient(170deg,#18203a 0%,#0d1326 55%,#080c18 100%)!important;color:#eef4ff!important;box-shadow:0 14px 30px rgba(0,0,0,.35),inset 0 1px 0 rgba(255,255,255,.10),0 0 0 1px rgba(0,0,0,.25)!important;transform:scale(.95);opacity:.72;transition:transform .28s ease,opacity .28s ease,box-shadow .28s ease}
      ${S} .gei-lite-card.is-current{transform:none;opacity:1;box-shadow:0 18px 40px rgba(0,0,0,.42),0 0 26px color-mix(in srgb,var(--lv) 35%,transparent),inset 0 1px 0 rgba(255,255,255,.12)!important}
      ${S} .gei-lite-card::before{content:"";position:absolute;z-index:-1;top:-40%;left:-60%;width:40%;height:180%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.10),transparent);transform:rotate(18deg);pointer-events:none}
      ${S} .gei-lite-card.is-current::before{animation:geiLiteShine 4.5s ease-in-out infinite}
      ${S} .gei-lite-card::after{content:"";position:absolute;inset:0;z-index:-2;pointer-events:none;opacity:.55;background:repeating-linear-gradient(0deg,rgba(255,255,255,.035) 0 1px,transparent 1px 22px),repeating-linear-gradient(90deg,rgba(255,255,255,.035) 0 1px,transparent 1px 22px);-webkit-mask-image:linear-gradient(180deg,#000 0%,transparent 75%);mask-image:linear-gradient(180deg,#000 0%,transparent 75%)}
      @keyframes geiLiteShine{0%,55%{left:-60%}100%{left:130%}}
      @keyframes geiLiteFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
      @keyframes geiLitePulse{0%,100%{box-shadow:0 6px 16px rgba(0,0,0,.35),0 0 0 0 color-mix(in srgb,var(--lv) 55%,transparent)}50%{box-shadow:0 6px 16px rgba(0,0,0,.35),0 0 0 6px transparent}}
      ${S} .gei-lite-card[data-day="1"]{--lv:#35d0ff;--lv2:#1a7dff}
      ${S} .gei-lite-card[data-day="2"]{--lv:#ffa94d;--lv2:#e8590c}
      ${S} .gei-lite-card[data-day="3"]{--lv:#3ddc97;--lv2:#0ca678}
      ${S} .gei-lite-card[data-day="4"]{--lv:#8c9bff;--lv2:#5c3dff}
      ${S} .gei-lite-card[data-day="5"]{--lv:#ffd43b;--lv2:#f08c00}
      ${S} .gei-lite-card[data-day="6"]{--lv:#ff6bb0;--lv2:#c2255c}

      ${S} .gei-lite-card-top{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:8px!important}
      ${S} .gei-lite-level{display:inline-flex!important;align-items:baseline!important;gap:5px!important;padding:5px 9px!important;border-radius:9px!important;background:rgba(0,0,0,.35)!important;border:1px solid color-mix(in srgb,var(--lv) 45%,transparent)!important;color:var(--lv)!important;font-size:10px!important;font-weight:900!important;letter-spacing:.14em!important;line-height:1!important}
      ${S} .gei-lite-level b{color:#fff!important;font-size:14px!important;letter-spacing:.02em!important}
      ${S} .gei-lite-status{padding:5px 8px!important;border-radius:999px!important;line-height:1!important;font-size:9px!important;font-weight:900!important;letter-spacing:.1em!important;color:#0b1020!important;background:var(--lv)!important}
      ${S} .gei-lite-card.is-complete .gei-lite-status{background:#ffd43b!important}
      ${S} .gei-lite-card.is-locked .gei-lite-status{background:rgba(255,255,255,.14)!important;color:#c6d0e4!important}

      ${S} .gei-lite-medal{position:relative!important;justify-self:center!important;display:grid!important;place-items:center!important;width:clamp(72px,24vw,96px)!important;aspect-ratio:1!important;border-radius:50%!important;background:radial-gradient(circle at 50% 38%,rgba(255,255,255,.22),transparent 58%),radial-gradient(circle,color-mix(in srgb,var(--lv) 40%,#0b1020) 0%,#0b1020 72%)!important;border:3px solid var(--lv)!important;box-shadow:0 0 0 5px rgba(0,0,0,.35),0 0 0 6px color-mix(in srgb,var(--lv) 40%,transparent),0 0 28px color-mix(in srgb,var(--lv) 45%,transparent),inset 0 -8px 16px rgba(0,0,0,.45)!important}
      ${S} .gei-lite-card.is-current .gei-lite-medal-icon{animation:geiLiteFloat 3s ease-in-out infinite}
      ${S} .gei-lite-medal-icon{display:block;font-size:clamp(34px,11vw,46px)!important;line-height:1!important;filter:drop-shadow(0 4px 6px rgba(0,0,0,.45))}
      ${S} .gei-lite-medal-num{position:absolute!important;right:-6px!important;bottom:-2px!important;display:grid!important;place-items:center!important;width:28px!important;height:28px!important;border-radius:50%!important;background:linear-gradient(160deg,var(--lv),var(--lv2))!important;color:#0b1020!important;border:2px solid #0b1020!important;font-size:13px!important;font-weight:900!important;line-height:1!important}
      ${S} .gei-lite-card.is-locked .gei-lite-medal{filter:grayscale(.85) brightness(.7)}
      ${S} .gei-lite-card.is-locked .gei-lite-medal-num{background:#5b6477!important;color:#fff!important}
      ${S} .gei-lite-card h2{margin:0!important;text-align:center!important;color:#fff!important;font-size:clamp(21px,6.2vw,27px)!important;line-height:1.05!important;letter-spacing:-.02em!important;text-shadow:0 2px 10px rgba(0,0,0,.45)!important}
      ${S} .gei-lite-card p{margin:0!important;align-self:start!important;text-align:center!important;color:#b9c6dc!important;font-size:13px!important;line-height:1.38!important;overflow:hidden!important}

      ${S} .gei-lite-reward{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:8px!important;padding:7px 10px!important;border-radius:12px!important;background:rgba(0,0,0,.32)!important;border:1px solid rgba(255,255,255,.08)!important}
      ${S} .gei-lite-xp{display:inline-flex!important;align-items:center!important;gap:5px!important;color:#ffe08a!important;font-size:11px!important;font-weight:900!important;letter-spacing:.06em!important}
      ${S} .gei-lite-xp i{display:inline-grid;place-items:center;width:16px;height:16px;border-radius:50%;font-style:normal;background:radial-gradient(circle at 35% 35%,#fff3bf,#fab005 60%,#e67700);color:#7a4a00;font-size:9px;box-shadow:0 0 8px rgba(250,176,5,.6)}
      ${S} .gei-lite-stars{display:inline-flex!important;gap:3px!important;font-size:15px!important;line-height:1!important;letter-spacing:0!important}
      ${S} .gei-lite-stars span{color:rgba(255,255,255,.18)!important}
      ${S} .gei-lite-card.is-complete .gei-lite-stars span{color:#ffd43b!important;text-shadow:0 0 8px rgba(255,212,59,.7)!important}

      ${S} .gei-lite-play{display:flex!important;align-items:center!important;justify-content:center!important;gap:8px!important;min-height:48px!important;padding:0 14px!important;border-radius:14px!important;background:linear-gradient(180deg,var(--lv),var(--lv2))!important;color:#0b1020!important;border:0!important;text-decoration:none!important;font-size:13px!important;font-weight:900!important;letter-spacing:.08em!important;box-shadow:0 4px 0 color-mix(in srgb,var(--lv2) 60%,#000),0 8px 18px color-mix(in srgb,var(--lv) 35%,transparent),inset 0 1px 0 rgba(255,255,255,.45)!important;transition:transform .12s ease,box-shadow .12s ease;-webkit-tap-highlight-color:transparent;touch-action:manipulation}
      ${S} .gei-lite-card.is-current .gei-lite-play:not(.is-locked){animation:geiLitePulse 2.2s ease-in-out infinite}
      ${S} .gei-lite-play:active{transform:translateY(3px)!important;box-shadow:0 1px 0 color-mix(in srgb,var(--lv2) 60%,#000),0 4px 10px rgba(0,0,0,.3)!important}
      ${S} .gei-lite-play:focus-visible{outline:3px solid #fff!important;outline-offset:3px!important}
      ${S} .gei-lite-play.is-locked{background:rgba(255,255,255,.08)!important;color:#aab4c8!important;box-shadow:inset 0 0 0 1px rgba(255,255,255,.12)!important;pointer-events:none!important;font-size:11px!important;letter-spacing:.06em!important}

      ${S} .gei-lite-controls{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:8px!important}
      ${S} .gei-lite-arrow{width:44px!important;height:40px!important;border-radius:12px!important;cursor:pointer!important;border:1px solid rgba(255,255,255,.14)!important;background:linear-gradient(180deg,#1f2842,#111729)!important;color:#fff!important;font-size:24px!important;line-height:1!important;box-shadow:0 3px 0 #05070d,inset 0 1px 0 rgba(255,255,255,.1)!important}
      ${S} .gei-lite-arrow:active{transform:translateY(2px)}
      ${S} .gei-lite-arrow:disabled{opacity:.35!important;cursor:default!important}
      ${S} .gei-lite-dots{display:flex!important;justify-content:center!important;align-items:center!important;gap:6px!important;flex:1!important}
      ${S} .gei-lite-dot{width:8px!important;height:8px!important;border-radius:3px!important;transform:rotate(45deg);background:rgba(127,140,165,.4)!important;transition:all .2s ease}
      ${S} .gei-lite-dot.is-done{background:#ffd43b!important}
      ${S} .gei-lite-dot.is-active{background:var(--skin-accent,#2fd2ff)!important;transform:rotate(45deg) scale(1.35);box-shadow:0 0 8px var(--skin-accent,#2fd2ff)!important}

      @media(max-width:360px){
        ${S} > .gei-lite-root{padding:10px 9px calc(92px + env(safe-area-inset-bottom))!important}
        ${S} .gei-lite-card{flex-basis:84vw!important;width:84vw!important;padding:12px!important;gap:8px!important}
      }
      @media(max-height:700px){
        ${S} .gei-lite-card{gap:7px!important;padding:12px!important}
        ${S} .gei-lite-medal{width:64px!important}
        ${S} .gei-lite-medal-icon{font-size:30px!important}
        ${S} .gei-lite-medal-num{width:22px!important;height:22px!important;font-size:11px!important}
        ${S} .gei-lite-card h2{font-size:20px!important}
        ${S} .gei-lite-card p{font-size:12px!important;line-height:1.3!important}
        ${S} .gei-lite-reward{padding:5px 9px!important}
        ${S} .gei-lite-play{min-height:42px!important}
      }
      @media(min-height:760px){
        ${S} .gei-lite-card{gap:14px!important;padding:16px!important}
        ${S} .gei-lite-medal{width:124px!important;margin-top:10px!important}
        ${S} .gei-lite-medal-icon{font-size:58px!important}
        ${S} .gei-lite-medal-num{width:34px!important;height:34px!important;font-size:15px!important}
        ${S} .gei-lite-card h2{font-size:29px!important;margin-top:6px!important}
        ${S} .gei-lite-card p{font-size:14.5px!important}
      }
      @media(prefers-reduced-motion:reduce){
        ${S} .gei-lite-card,${S} .gei-lite-play,${S} .gei-lite-dot{transition:none!important}
        ${S} .gei-lite-card::before,${S} .gei-lite-medal-icon,${S} .gei-lite-play{animation:none!important}
      }
    `;
    document.head.appendChild(style);
  }

  function cardMarkup(day) {
    const done = completed(day);
    const unlocked = day.id === 1 || completed(DAYS[day.id - 2]);
    const state = done ? "is-complete" : unlocked ? "is-ready" : "is-locked";
    const status = done ? "★ CLEARED" : unlocked ? "READY" : "🔒 LOCKED";
    const cta = done ? `↻ REPLAY DAY ${day.id}` : unlocked ? `▶ PLAY DAY ${day.id}` : `CLEAR DAY ${day.id - 1} TO UNLOCK`;
    return `
      <article class="gei-lite-card ${state}" data-day="${day.id}" aria-label="Day ${day.id}: ${day.title}, ${done ? "cleared" : unlocked ? "ready" : "locked"}">
        <div class="gei-lite-card-top">
          <span class="gei-lite-level">DAY <b>${pad(day.id)}</b></span>
          <span class="gei-lite-status">${status}</span>
        </div>
        <div class="gei-lite-medal" aria-hidden="true">
          <span class="gei-lite-medal-icon">${day.icon}</span>
          <span class="gei-lite-medal-num">${day.id}</span>
        </div>
        <h2>${day.title}</h2>
        <p>${day.desc}</p>
        <div class="gei-lite-reward">
          <span class="gei-lite-xp"><i aria-hidden="true">★</i>+${XP_PER_DAY} XP</span>
          <span class="gei-lite-stars" aria-label="${done ? "3 of 3 stars" : "0 of 3 stars"}"><span>★</span><span>★</span><span>★</span></span>
        </div>
        <a class="gei-lite-play${unlocked ? "" : " is-locked"}" href="${day.url}"${unlocked ? "" : ' aria-disabled="true" tabindex="-1"'}>${cta}</a>
      </article>`;
  }

  function render() {
    const screen = document.getElementById("screen-academy");
    if (!screen) return;
    injectStyles();
    screen.classList.add("gei-academy-lite-screen");
    const doneCount = countCompleted();
    const firstOpen = Math.min(DAYS.length - 1, doneCount);
    screen.innerHTML = `
      <div class="gei-lite-root">
        <header class="gei-lite-header">
          <div class="gei-lite-heading">
            <span class="gei-lite-eyebrow">GEI ACADEMY</span>
            <h1>Academy</h1>
            <p>Choose a stage. Explore the system.</p>
          </div>
          <div class="gei-lite-chip" aria-label="Blueprint progress">
            <strong data-lite-count>${doneCount} / 6</strong>
            <small>DAYS</small>
          </div>
        </header>
        <section class="gei-lite-carousel-wrap" aria-label="Six-day celebration cards">
          <div class="gei-lite-section-label"><span>SIX-DAY CELEBRATION</span><b data-lite-pos>DAY 1 OF 6</b></div>
          <div class="gei-lite-carousel" id="gei-lite-carousel">
            ${DAYS.map(cardMarkup).join("")}
          </div>
          <div class="gei-lite-controls" aria-label="Carousel controls">
            <button class="gei-lite-arrow" type="button" data-dir="-1" aria-label="Previous day">‹</button>
            <div class="gei-lite-dots" aria-hidden="true">
              ${DAYS.map(d=>`<span class="gei-lite-dot${completed(d)?" is-done":""}"></span>`).join("")}
            </div>
            <button class="gei-lite-arrow" type="button" data-dir="1" aria-label="Next day">›</button>
          </div>
        </section>
      </div>`;

    const carousel = screen.querySelector("#gei-lite-carousel");
    const dots = Array.from(screen.querySelectorAll(".gei-lite-dot"));
    const cards = Array.from(screen.querySelectorAll(".gei-lite-card"));
    const arrows = Array.from(screen.querySelectorAll(".gei-lite-arrow"));
    const pos = screen.querySelector("[data-lite-pos]");
    let index = -1;

    const mark = (i) => {
      if (i === index) return;
      index = i;
      cards.forEach((c,n)=>c.classList.toggle("is-current",n===i));
      dots.forEach((d,n)=>d.classList.toggle("is-active",n===i));
      if (pos) pos.textContent = `DAY ${i + 1} OF ${DAYS.length}`;
      if (arrows[0]) arrows[0].disabled = i === 0;
      if (arrows[1]) arrows[1].disabled = i === DAYS.length - 1;
    };

    const scrollToCard = (i, smooth) => {
      const card = cards[i];
      if (!card || !carousel) return;
      const left = card.offsetLeft - (carousel.clientWidth - card.offsetWidth) / 2;
      carousel.scrollTo({left: Math.max(0, left), behavior: smooth ? "smooth" : "auto"});
    };

    arrows.forEach(btn=>{
      btn.addEventListener("click",()=>{
        const next = Math.max(0, Math.min(DAYS.length - 1, index + Number(btn.dataset.dir)));
        mark(next);
        scrollToCard(next, true);
      });
    });

    carousel?.addEventListener("scroll",()=>{
      const center = carousel.scrollLeft + carousel.clientWidth / 2;
      let closest = 0, best = Infinity;
      cards.forEach((card,i)=>{
        const d = Math.abs(center - (card.offsetLeft + card.offsetWidth / 2));
        if (d < best) { best = d; closest = i; }
      });
      mark(closest);
    },{passive:true});

    mark(firstOpen);
    requestAnimationFrame(() => scrollToCard(firstOpen, false));
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