/* GEI Academy Clean Runtime V1
   Single owner for #screen-academy.
   Preserves existing identity, XP, completion, and Day 1–6 URLs.
*/
(() => {
  "use strict";
  if (window.GEI_ACADEMY_CLEAN_V1) return;

  const DAYS = [
    { id: 1, title: "Water & Light", icon: "💧", url: "day-1.html", desc: "Separate the waters and begin the hydraulic blueprint." },
    { id: 2, title: "The Firmament", icon: "🧱", url: "day-2.html", desc: "Build the separating wall—the dam structure." },
    { id: 3, title: "Reservoir & Dry Land", icon: "🌊", url: "day-3.html", desc: "Gather the waters and reveal the dry land." },
    { id: 4, title: "The Sluice", icon: "🚪", url: "day-4.html", desc: "Control the release of water toward the mill." },
    { id: 5, title: "The Waterwheel", icon: "⚙️", url: "day-5.html", desc: "Turn flowing water into useful work." },
    { id: 6, title: "The Beast System", icon: "🏗️", url: "day-6.html", desc: "Complete the six-stage engineered system." }
  ];

  const identity = () => window.GEI_IDENTITY;

  function getCompletion() {
    try { return JSON.parse(localStorage.getItem("geiDayCompletionV1") || "{}"); }
    catch (_) { return {}; }
  }

  function completed() {
    const state = getCompletion();
    return DAYS.filter(d => state[d.id]?.completed === true &&
      Number(state[d.id]?.audioPercent || 0) >= 90);
  }

  function getXP() {
    return Math.max(0, Number(window.GEI_PROGRESS?.getState?.()?.xp) || 0);
  }

  function esc(v) {
    return String(v ?? "").replace(/[&<>"]/g, m => ({
      "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"
    }[m]));
  }

  function injectStyles() {
    if (document.getElementById("gei-academy-clean-v1-style")) return;
    const s = document.createElement("style");
    s.id = "gei-academy-clean-v1-style";
    s.textContent = `
      #screen-academy.gei-academy-clean-v1{
        display:block!important;visibility:visible!important;opacity:1!important;
        overflow:hidden!important;background:var(--skin-bg,#f7f9fc)!important;
      }
      .gei-clean-root{
        width:100%;height:100%;overflow:auto;box-sizing:border-box;
        padding:14px 12px 104px;color:var(--skin-text,#102a43);
        font-family:Plus Jakarta Sans,Inter,system-ui,sans-serif;
      }
      .gei-clean-root *{box-sizing:border-box}
      .gei-clean-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}
      .gei-clean-kicker{font-size:11px;font-weight:900;letter-spacing:.14em;color:var(--skin-accent,#2fd2ff)}
      .gei-clean-head h1{margin:4px 0 0;font-size:clamp(28px,8vw,38px);line-height:1}
      .gei-clean-head p{margin:6px 0 0;font-size:14px;line-height:1.35;color:var(--skin-muted,#526b82)}
      .gei-clean-avatar{width:56px;height:56px;flex:none;border-radius:17px;overflow:hidden;border:2px solid var(--skin-accent,#2fd2ff);background:var(--skin-surface,#fff);display:grid;place-items:center}
      .gei-clean-avatar img{width:100%;height:100%;object-fit:cover}
      .gei-clean-progress{padding:13px 14px;border-radius:18px;background:var(--skin-soft,#f1f4f8);margin-bottom:14px}
      .gei-clean-progress-top{display:flex;justify-content:space-between;gap:8px}
      .gei-clean-progress span{display:block;font-size:11px;color:var(--skin-muted,#526b82);font-weight:800}
      .gei-clean-progress strong{display:block;margin-top:2px;font-size:18px}
      .gei-clean-track{height:9px;margin-top:10px;border-radius:999px;background:rgba(0,0,0,.08);overflow:hidden}
      .gei-clean-fill{height:100%;width:0;background:linear-gradient(90deg,#3d3dea,#2fd2ff)}
      .gei-clean-section{display:flex;justify-content:space-between;align-items:flex-end;gap:10px;margin-bottom:8px}
      .gei-clean-section strong{font-size:22px;line-height:1.05}
      .gei-clean-section span{font-size:11px;font-weight:900;letter-spacing:.06em;color:var(--skin-muted,#526b82)}
      .gei-clean-carousel{width:100%;overflow-x:auto;overflow-y:hidden;scroll-snap-type:x mandatory;scrollbar-width:none;padding:2px 0 12px}
      .gei-clean-carousel::-webkit-scrollbar{display:none}
      .gei-clean-track{display:flex;gap:13px;width:max-content}
      .gei-clean-card{
        flex:0 0 min(84vw,360px);overflow:hidden;scroll-snap-align:center;
        border:1px solid rgba(47,210,255,.30);border-radius:24px;
        background:var(--skin-surface,#fff);box-shadow:0 15px 38px rgba(0,0,0,.10);
      }
      .gei-clean-art{height:220px;position:relative;display:grid;place-items:center;overflow:hidden;background:linear-gradient(145deg,#07111c,#12334b)}
      .gei-clean-art-symbol{font-size:80px;line-height:1}
      .gei-clean-art-day{position:absolute;left:12px;top:11px;font-size:12px;font-weight:900;letter-spacing:.16em;color:#2fd2ff}
      .gei-clean-status{position:absolute;right:10px;top:10px;padding:6px 9px;border-radius:999px;background:rgba(3,7,12,.78);color:#fff;font-size:10px;font-weight:900;letter-spacing:.08em}
      .gei-clean-card.is-locked{opacity:.54}
      .gei-clean-card.is-complete{border-color:#22c55e}
      .gei-clean-card.is-complete .gei-clean-status{background:rgba(22,101,52,.92)}
      .gei-clean-body{display:grid;gap:8px;padding:15px}
      .gei-clean-body h2{margin:0;font-size:28px;line-height:1.04}
      .gei-clean-body p{margin:0;color:var(--skin-muted,#526b82);font-size:14px;line-height:1.35}
      .gei-clean-button{display:flex;align-items:center;justify-content:space-between;min-height:48px;padding:0 13px;border-radius:13px;background:var(--skin-soft,#f1f4f8);color:var(--skin-text,#102a43);font-size:12px;font-weight:900;text-decoration:none}
      .gei-clean-card:not(.is-locked) .gei-clean-button{background:var(--skin-accent,#2fd2ff);color:#061018}
      .gei-clean-dots{display:flex;align-items:center;justify-content:center;gap:5px;margin-bottom:10px}
      .gei-clean-dot{width:7px;height:7px;border-radius:99px;background:rgba(82,107,130,.26)}
      .gei-clean-dot.is-active{width:22px;background:var(--skin-accent,#2fd2ff)}
      .gei-clean-note{margin:0;padding:10px 12px;border-radius:15px;background:rgba(255,20,147,.08);border:1px solid rgba(255,20,147,.24);font-size:13px;font-weight:800}
      .gei-clean-gate{display:grid;gap:12px;max-width:520px;margin:0 auto;padding:14px}
      .gei-clean-gate-card{display:grid;gap:10px;padding:18px;border-radius:22px;background:var(--skin-surface,#fff);border:1px solid rgba(47,210,255,.30)}
      .gei-clean-gate-card h2{margin:0;font-size:28px}
      .gei-clean-gate-card p{margin:0;font-size:14px;line-height:1.4;color:var(--skin-muted,#526b82)}
      .gei-clean-input{width:100%;min-height:52px;padding:12px;border:1px solid rgba(82,107,130,.30);border-radius:13px;background:var(--skin-surface,#fff);color:var(--skin-text,#102a43);font:inherit;font-size:17px}
      .gei-clean-enter{min-height:50px;border:0;border-radius:14px;background:var(--skin-accent,#2fd2ff);color:#061018;font:inherit;font-weight:900}
      .gei-clean-error{font-size:13px;font-weight:800;color:#d10b63}
      @media(max-width:360px){
        .gei-clean-card{flex-basis:87vw}
        .gei-clean-art{height:190px}
        .gei-clean-body h2{font-size:24px}
      }
    `;
    document.head.appendChild(s);
  }

  function card(day, done) {
    const isComplete = done.some(d => d.id === day.id);
    const isUnlocked = day.id === 1 || done.some(d => d.id === day.id - 1);
    const status = isComplete ? "MASTERED" : isUnlocked ? "UNLOCKED" : "LOCKED";
    return `
      <article class="gei-clean-card${isUnlocked ? "" : " is-locked"}${isComplete ? " is-complete" : ""}" data-day="${day.id}">
        <div class="gei-clean-art">
          <span class="gei-clean-art-day">DAY ${day.id}</span>
          <span class="gei-clean-art-symbol" aria-hidden="true">${day.icon}</span>
          <span class="gei-clean-status">${status}</span>
        </div>
        <div class="gei-clean-body">
          <h2>${esc(day.title)}</h2>
          <p>${esc(day.desc)}</p>
          <a class="gei-clean-button" href="${day.url}" data-day-link="${day.id}" aria-disabled="${String(!isUnlocked)}">
            <span>${isUnlocked ? "PLAY DAY " + day.id : "LOCKED"}</span><span>→</span>
          </a>
        </div>
      </article>`;
  }

  function showGate(screen) {
    screen.innerHTML = `
      <div class="gei-clean-root">
        <div class="gei-clean-gate">
          <span class="gei-clean-kicker">GEI ACADEMY • LEARNER IDENTITY</span>
          <div class="gei-clean-gate-card">
            <h2>Set your Dam Name.</h2>
            <p>Your Dam Name becomes your learner identity throughout the Academy.</p>
            <label for="gei-clean-name" style="font-size:12px;font-weight:900;letter-spacing:.08em">DAM NAME</label>
            <input id="gei-clean-name" class="gei-clean-input" maxlength="20" autocomplete="nickname" placeholder="WaterArchitect" spellcheck="false">
            <button id="gei-clean-enter" class="gei-clean-enter" type="button">ENTER ACADEMY →</button>
            <small style="font-size:11px;color:var(--skin-muted,#526b82)">3–20 characters • letters, numbers, _ or -</small>
            <div id="gei-clean-error" class="gei-clean-error" hidden></div>
          </div>
        </div>
      </div>`;
    const input = screen.querySelector("#gei-clean-name");
    const save = () => {
      const raw = input?.value || "";
      if (!identity()?.setDamName?.(raw,"academy-clean-v1")) {
        const clean = raw.trim().replace(/^@+/,"");
        const err = screen.querySelector("#gei-clean-error");
        if (err) { err.hidden=false; err.textContent = clean.length < 3 ? "Dam Name must be at least 3 characters." : "Use 3–20 characters: letters, numbers, _ or -."; }
        return;
      }
      render();
      window.dispatchEvent(new CustomEvent("gei:academy-identity-unlocked",{detail:{damName:identity()?.getDamName?.(),source:"academy-clean-v1"}}));
    };
    screen.querySelector("#gei-clean-enter")?.addEventListener("click",save);
    input?.addEventListener("keydown",e=>{ if(e.key==="Enter"){e.preventDefault();save();} });
    requestAnimationFrame(()=>input?.focus());
  }

  function render() {
    const screen = document.getElementById("screen-academy");
    if (!screen) return;
    injectStyles();
    screen.classList.add("gei-academy-clean-v1");
    screen.setAttribute("aria-hidden","false");

    if (!identity()?.hasIdentity?.()) {
      showGate(screen);
      return;
    }

    const name = identity()?.getDamName?.() || "Learner";
    const done = completed();
    const activeIndex = Math.min(done.length, DAYS.length - 1);
    const nextDay = done.length < DAYS.length ? done.length + 1 : 1;

    screen.innerHTML = `
      <div class="gei-clean-root">
        <header class="gei-clean-head">
          <div>
            <span class="gei-clean-kicker">GEI ACADEMY • LEARNER</span>
            <h1>@${esc(name)}</h1>
            <p>Six days. Six stages. One engineered blueprint.</p>
          </div>
          <div class="gei-clean-avatar">🦫</div>
        </header>

        <section class="gei-clean-progress">
          <div class="gei-clean-progress-top">
            <div><span>BLUEPRINT PROGRESS</span><strong>${done.length} / 6</strong></div>
            <div style="text-align:right"><span>XP</span><strong>${getXP()}</strong></div>
          </div>
          <div class="gei-clean-track"><div class="gei-clean-fill" style="width:${(done.length/6)*100}%"></div></div>
        </section>

        <div class="gei-clean-section">
          <strong>YOUR SIX DAYS</strong>
          <span>SWIPE →</span>
        </div>

        <div class="gei-clean-carousel" id="gei-clean-carousel" aria-label="GEI Academy six-day carousel">
          <div class="gei-clean-track">
            ${DAYS.map(day => card(day,done)).join("")}
          </div>
        </div>

        <div class="gei-clean-dots" id="gei-clean-dots">
          ${DAYS.map((_,i)=>`<i class="gei-clean-dot${i===activeIndex?" is-active":""}"></i>`).join("")}
        </div>

        ${done.length < 6 ? `<p class="gei-clean-note">Day ${nextDay} is the next checkpoint. Complete the current stage to unlock it.</p>` : ""}
      </div>`;

    const carousel = screen.querySelector("#gei-clean-carousel");
    const cards = Array.from(screen.querySelectorAll(".gei-clean-card"));
    const dots = Array.from(screen.querySelectorAll(".gei-clean-dot"));

    const centerCard = (index) => {
      const item = cards[index];
      if (!item || !carousel) return;
      carousel.scrollTo({left:item.offsetLeft - 12,behavior:"smooth"});
      dots.forEach((d,i)=>d.classList.toggle("is-active",i===index));
    };

    carousel?.addEventListener("scroll",()=>{
      const center = carousel.scrollLeft + carousel.clientWidth/2;
      let closest=0,best=Infinity;
      cards.forEach((item,i)=>{
        const c=item.offsetLeft + item.offsetWidth/2;
        const dist=Math.abs(center-c);
        if(dist<best){best=dist;closest=i;}
      });
      dots.forEach((d,i)=>d.classList.toggle("is-active",i===closest));
    },{passive:true});

    cards.forEach(item=>{
      item.querySelector("[data-day-link]")?.addEventListener("click",e=>{
        const day=Number(item.dataset.day);
        const allowed=day===1 || done.some(d=>d.id===day-1);
        if(!allowed){e.preventDefault();window.dispatchEvent(new CustomEvent("gei:day-locked",{detail:{day}}));}
      });
    });

    requestAnimationFrame(()=>centerCard(activeIndex));
  }

  function init() {
    window.GEI_ACADEMY_CLEAN_V1 = Object.freeze({version:"1.0",render});
    render();
    ["gei:identity-updated","gei:learner-identity-ready","gei:progress-updated","gei:day-completion","gei:badges-updated"].forEach(n=>window.addEventListener(n,render));
    window.addEventListener("gei:navigation",e=>{ if(e.detail?.id==="academy") render(); });
    window.addEventListener("gei:academy-render",render);
  }

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();