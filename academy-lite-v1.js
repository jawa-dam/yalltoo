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
      #screen-academy.gei-academy-lite-screen{
        position:relative!important;display:block!important;overflow:hidden!important;
        box-sizing:border-box;background:var(--skin-bg,#06070d)!important;
      }
      #screen-academy.gei-academy-lite-screen .gei-lite-root{
        position:absolute;inset:0;display:grid;grid-template-rows:auto auto 1fr;
        min-height:0;box-sizing:border-box;padding:14px 12px 88px;
        color:var(--skin-text,#f6f8ff);overflow:hidden;
      }
      .gei-lite-header{
        display:flex;align-items:flex-start;justify-content:space-between;gap:12px;
        min-width:0;
      }
      .gei-lite-eyebrow{
        display:block;font-size:11px;font-weight:900;letter-spacing:.15em;
        color:var(--skin-accent,#2fd2ff);text-transform:uppercase;
      }
      .gei-lite-header h1{
        margin:4px 0 0;font-size:clamp(30px,8.5vw,42px);line-height:.98;
        letter-spacing:-.04em;
      }
      .gei-lite-header p{
        margin:6px 0 0;color:var(--skin-muted,#aeb8cb);font-size:14px;line-height:1.25;
      }
      .gei-lite-chip{
        flex:0 0 auto;display:grid;place-items:center;min-width:76px;padding:9px 10px;
        border:1px solid color-mix(in srgb,var(--skin-accent,#2fd2ff) 42%,transparent);
        border-radius:16px;background:color-mix(in srgb,var(--skin-accent,#2fd2ff) 10%,transparent);
      }
      .gei-lite-chip strong{font-size:19px;line-height:1}
      .gei-lite-chip small{margin-top:3px;font-size:9px;font-weight:900;letter-spacing:.11em}
      .gei-lite-menu{
        margin-top:12px;display:grid;grid-template-columns:1fr;gap:8px;
      }
      .gei-lite-menu-btn{
        display:flex;align-items:center;justify-content:space-between;gap:12px;width:100%;
        min-height:50px;padding:0 14px;border:1px solid color-mix(in srgb,var(--skin-accent,#2fd2ff) 26%,transparent);
        border-radius:15px;background:color-mix(in srgb,var(--skin-surface,#0b0e18) 92%,transparent);
        color:var(--skin-text,#f6f8ff);font:inherit;font-size:14px;font-weight:900;
        text-align:left;cursor:pointer;
      }
      .gei-lite-menu-btn span:last-child{font-size:20px;color:var(--skin-accent,#2fd2ff)}
      .gei-lite-menu-panel{
        display:none;padding:10px;border-radius:15px;
        border:1px solid color-mix(in srgb,var(--skin-accent,#2fd2ff) 22%,transparent);
        background:var(--skin-surface,#0b0e18);
      }
      .gei-lite-menu-panel.is-open{display:grid;gap:7px}
      .gei-lite-menu-panel a{
        display:block;padding:11px 12px;border-radius:11px;color:inherit;
        text-decoration:none;background:color-mix(in srgb,var(--skin-accent,#2fd2ff) 7%,transparent);
        font-size:13px;font-weight:800;
      }
      .gei-lite-carousel-wrap{min-height:0;display:grid;grid-template-rows:auto 1fr auto;gap:8px;margin-top:14px}
      .gei-lite-section-label{font-size:11px;font-weight:900;letter-spacing:.13em;color:var(--skin-accent,#2fd2ff)}
      .gei-lite-carousel{
        min-height:0;overflow-x:auto;overflow-y:hidden;display:flex;gap:12px;
        scroll-snap-type:x mandatory;scrollbar-width:none;overscroll-behavior-x:contain;
        padding:2px 2px 10px;
      }
      .gei-lite-carousel::-webkit-scrollbar{display:none}
      .gei-lite-card{
        flex:0 0 min(82vw,340px);min-height:0;scroll-snap-align:center;display:grid;
        grid-template-rows:auto auto 1fr auto;gap:10px;padding:18px;border-radius:24px;
        border:1px solid color-mix(in srgb,var(--skin-accent,#2fd2ff) 30%,transparent);
        background:linear-gradient(145deg,color-mix(in srgb,var(--skin-accent,#2fd2ff) 11%,var(--skin-surface,#0b0e18)),var(--skin-surface,#0b0e18));
        box-shadow:0 16px 34px rgba(0,0,0,.2);box-sizing:border-box;
      }
      .gei-lite-card.is-complete{
        border-color:rgba(58,220,155,.55);
        box-shadow:0 0 0 1px rgba(58,220,155,.08),0 16px 34px rgba(0,0,0,.2);
      }
      .gei-lite-card-top{display:flex;align-items:center;justify-content:space-between;gap:10px}
      .gei-lite-day{font-size:12px;font-weight:900;letter-spacing:.13em}
      .gei-lite-status{font-size:10px;font-weight:900;letter-spacing:.1em;padding:6px 8px;border-radius:999px;background:rgba(255,255,255,.07)}
      .gei-lite-icon{display:grid;place-items:center;width:74px;height:74px;border-radius:20px;
        background:rgba(255,255,255,.055);font-size:42px}
      .gei-lite-card h2{margin:0;font-size:clamp(27px,7.5vw,36px);line-height:1.02;letter-spacing:-.035em}
      .gei-lite-card p{margin:0;color:var(--skin-muted,#aeb8cb);font-size:15px;line-height:1.4}
      .gei-lite-card a{
        display:flex;align-items:center;justify-content:space-between;min-height:48px;padding:0 14px;
        border-radius:14px;background:var(--skin-accent,#2fd2ff);color:#061018;text-decoration:none;
        font-size:13px;font-weight:1000;letter-spacing:.04em;
      }
      .gei-lite-card a.is-locked{background:rgba(255,255,255,.08);color:var(--skin-muted,#aeb8cb);pointer-events:none}
      .gei-lite-controls{display:flex;align-items:center;justify-content:space-between;gap:10px}
      .gei-lite-arrow{
        width:48px;height:44px;border:1px solid color-mix(in srgb,var(--skin-accent,#2fd2ff) 30%,transparent);
        border-radius:13px;background:var(--skin-surface,#0b0e18);color:inherit;font-size:28px;cursor:pointer;
      }
      .gei-lite-dots{display:flex;justify-content:center;gap:7px;flex:1}
      .gei-lite-dot{width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,.2)}
      .gei-lite-dot.is-active{background:var(--skin-accent,#2fd2ff);transform:scale(1.25)}
      @media(max-width:360px){
        #screen-academy.gei-academy-lite-screen .gei-lite-root{padding-inline:9px}
        .gei-lite-card{flex-basis:88vw;padding:15px}
        .gei-lite-card h2{font-size:26px}
        .gei-lite-card p{font-size:14px}
      }
    `;
    document.head.appendChild(style);
  }

  function menuMarkup() {
    return `
      <div class="gei-lite-menu">
        <button class="gei-lite-menu-btn" type="button" id="gei-lite-menu-btn" aria-expanded="false">
          <span>ACADEMY MENU</span><span>⌄</span>
        </button>
        <div class="gei-lite-menu-panel" id="gei-lite-menu-panel">
          <a href="#academy">Academy Home</a>
          <a href="day-1.html">Day 1 — Water &amp; Light</a>
          <a href="day-2.html">Day 2 — The Firmament</a>
          <a href="day-3.html">Day 3 — Reservoir &amp; Dry Land</a>
          <a href="day-4.html">Day 4 — The Sluice</a>
          <a href="day-5.html">Day 5 — The Waterwheel</a>
          <a href="day-6.html">Day 6 — The Beast System</a>
        </div>
      </div>`;
  }

  function render() {
    const screen = document.getElementById("screen-academy");
    if (!screen) return;
    injectStyles();
    screen.classList.add("gei-academy-lite-screen");
    screen.innerHTML = `
      <div class="gei-lite-root">
        <header class="gei-lite-header">
          <div>
            <span class="gei-lite-eyebrow">GEI ACADEMY</span>
            <h1>Six-Day Water Blueprint</h1>
            <p>Choose a stage. Explore the system.</p>
          </div>
          <div class="gei-lite-chip" aria-label="Blueprint progress">
            <strong data-lite-count>0 / 6</strong>
            <small>DAYS</small>
          </div>
        </header>
        ${menuMarkup()}
        <section class="gei-lite-carousel-wrap" aria-label="Six-day celebration cards">
          <div class="gei-lite-section-label">SIX-DAY CELEBRATION</div>
          <div class="gei-lite-carousel" id="gei-lite-carousel">
            ${DAYS.map(day => {
              const done = completed(day);
              const unlocked = day.id === 1 || completed(DAYS[day.id - 2]);
              return `
                <article class="gei-lite-card${done ? " is-complete" : ""}" data-day="${day.id}">
                  <div class="gei-lite-card-top">
                    <span class="gei-lite-day">DAY ${day.id}</span>
                    <span class="gei-lite-status">${done ? "CELEBRATED" : unlocked ? "READY" : "NEXT"}</span>
                  </div>
                  <div class="gei-lite-icon" aria-hidden="true">${day.icon}</div>
                  <div>
                    <h2>${day.title}</h2>
                    <p>${day.desc}</p>
                  </div>
                  <a class="${unlocked ? "" : "is-locked"}" href="${day.url}">
                    <span>${done ? "REVISIT DAY " + day.id : unlocked ? "ENTER DAY " + day.id : "LOCKED"}</span>
                    <strong>→</strong>
                  </a>
                </article>`;
            }).join("")}
          </div>
          <div class="gei-lite-controls" aria-label="Carousel controls">
            <button class="gei-lite-arrow" type="button" data-dir="-1" aria-label="Previous day">‹</button>
            <div class="gei-lite-dots" aria-hidden="true">
              ${DAYS.map((_,i)=>`<span class="gei-lite-dot${i===0?" is-active":""}"></span>`).join("")}
            </div>
            <button class="gei-lite-arrow" type="button" data-dir="1" aria-label="Next day">›</button>
          </div>
        </section>
      </div>`;

    const carousel = screen.querySelector("#gei-lite-carousel");
    const dots = Array.from(screen.querySelectorAll(".gei-lite-dot"));
    let index = 0;
    const cards = Array.from(screen.querySelectorAll(".gei-lite-card"));
    const go = (next) => {
      index = Math.max(0, Math.min(DAYS.length - 1, next));
      const card = cards[index];
      if (card) carousel.scrollTo({left: card.offsetLeft - 2, behavior: "smooth"});
      dots.forEach((dot,i)=>dot.classList.toggle("is-active",i===index));
    };
    screen.querySelectorAll(".gei-lite-arrow").forEach(btn=>{
      btn.addEventListener("click",()=>go(index + Number(btn.dataset.dir)));
    });
    carousel?.addEventListener("scroll",()=>{
      if(!cards.length)return;
      const center=carousel.scrollLeft + carousel.clientWidth/2;
      let closest=0,best=Infinity;
      cards.forEach((card,i)=>{
        const d=Math.abs(center-(card.offsetLeft+card.offsetWidth/2));
        if(d<best){best=d;closest=i;}
      });
      if(closest!==index){
        index=closest;
        dots.forEach((dot,i)=>dot.classList.toggle("is-active",i===index));
      }
    },{passive:true});

    const menuButton=screen.querySelector("#gei-lite-menu-btn");
    const panel=screen.querySelector("#gei-lite-menu-panel");
    menuButton?.addEventListener("click",()=>{
      const open=panel?.classList.toggle("is-open");
      menuButton.setAttribute("aria-expanded",String(Boolean(open)));
    });

    const count=screen.querySelector("[data-lite-count]");
    if(count)count.textContent=countCompleted()+" / 6";
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