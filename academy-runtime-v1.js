/* GEI Academy Runtime V1.1
   Single-owner Academy rendering.
   Day 1–6 presented as a horizontal game-style celebration carousel.
   Custom card artwork can be added later without changing the state model.
*/
(() => {
  "use strict";
  if (window.GEI_ACADEMY_RUNTIME_V1) return;

  const DAYS = Object.freeze([
    { id: 1, title: "Water & Light", icon: "💧", url: "day-1.html", accent: "DAY 1" },
    { id: 2, title: "The Firmament", icon: "🧱", url: "day-2.html", accent: "DAY 2" },
    { id: 3, title: "Reservoir & Dry Land", icon: "🌊", url: "day-3.html", accent: "DAY 3" },
    { id: 4, title: "The Sluice", icon: "🚪", url: "day-4.html", accent: "DAY 4" },
    { id: 5, title: "The Waterwheel", icon: "⚙️", url: "day-5.html", accent: "DAY 5" },
    { id: 6, title: "The Beast System", icon: "🏗️", url: "day-6.html", accent: "DAY 6" }
  ]);

  const identity = () => window.GEI_IDENTITY;

  function completion() {
    try { return JSON.parse(localStorage.getItem("geiDayCompletionV1") || "{}"); }
    catch (_) { return {}; }
  }

  function completedDays() {
    const state = completion();
    return DAYS.filter((d) => state[d.id]?.completed === true && Number(state[d.id]?.audioPercent || 0) >= 90);
  }

  function xp() {
    return Math.max(0, Number(window.GEI_PROGRESS?.getState?.()?.xp) || 0);
  }

  function esc(value) {
    return String(value ?? "").replace(/[&<>"]/g, (m) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" }[m]));
  }

  function card(day, complete) {
    const mastered = complete.some((d) => d.id === day.id);
    const unlocked = day.id === 1 || complete.some((d) => d.id === day.id - 1);
    const status = mastered ? "MASTERED" : unlocked ? (day.id === 1 ? "READY TO PLAY" : "UNLOCKED") : "LOCKED";

    return `
      <article class="gei-academy-v1-card${unlocked ? "" : " is-locked"}${mastered ? " is-complete" : ""}" data-day="${day.id}" aria-label="Day ${day.id}: ${esc(day.title)}">
        <div class="gei-academy-v1-card-art">
          <div class="gei-academy-v1-placeholder">
            <span class="gei-academy-v1-art-day">DAY ${day.id}</span>
            <strong>${day.icon}</strong>
            <span>ADD CUSTOM ART LATER</span>
          </div>
          <span class="gei-academy-v1-state">${status}</span>
        </div>
        <div class="gei-academy-v1-card-body">
          <div class="gei-academy-v1-card-top"><span>${day.accent}</span><b>${mastered ? "🏆" : unlocked ? "▶" : "🔒"}</b></div>
          <h3>${esc(day.title)}</h3>
          <p>${mastered ? "Stage mastered. Replay whenever you want." : unlocked ? "Your next GEI stage is ready." : "Complete the previous day to unlock this stage."}</p>
          <a class="gei-academy-v1-play" href="${day.url}" aria-disabled="${String(!unlocked)}">${mastered ? "PLAY AGAIN" : unlocked ? "PLAY DAY " + day.id : "LOCKED"} <span>→</span></a>
        </div>
      </article>`;
  }

  function renderStyles() {
    if (document.getElementById("gei-academy-runtime-v1-style")) return;
    const style = document.createElement("style");
    style.id = "gei-academy-runtime-v1-style";
    style.textContent = `
      #screen-academy.gei-academy-v1{display:block!important;visibility:visible!important;opacity:1!important;overflow:hidden!important}
      #screen-academy.gei-academy-v1 .gei-academy-v1-root{width:100%;height:100%;box-sizing:border-box;overflow:auto;padding:12px 0 108px;font-family:Plus Jakarta Sans,Inter,system-ui,sans-serif;color:var(--skin-text,#102a43);background:var(--skin-bg,#f7f9fc)}
      .gei-academy-v1-root *{box-sizing:border-box}
      .gei-academy-v1-head{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:12px;align-items:center;padding:0 12px;margin-bottom:10px}
      .gei-academy-v1-kicker{display:block;font-size:11px;font-weight:900;letter-spacing:.13em;color:var(--skin-accent,#2fd2ff)}
      .gei-academy-v1-head h1{margin:4px 0 0;font-size:clamp(29px,8vw,38px);line-height:1}
      .gei-academy-v1-head p{margin:5px 0 0;color:var(--skin-muted,#526b82);font-size:14px;line-height:1.3}
      .gei-academy-v1-avatar{width:58px;height:58px;border-radius:18px;overflow:hidden;border:2px solid var(--skin-accent,#2fd2ff);background:var(--skin-surface,#fff);padding:0;display:grid;place-items:center}
      .gei-academy-v1-avatar img{width:100%;height:100%;object-fit:cover}
      .gei-academy-v1-hero{display:grid;gap:7px;padding:16px 12px 12px;margin-bottom:11px}
      .gei-academy-v1-hero h2{margin:0;font-size:25px;line-height:1.03}
      .gei-academy-v1-hero p{margin:0;color:var(--skin-muted,#526b82);font-size:14px;line-height:1.35}
      .gei-academy-v1-cta{display:flex;align-items:center;justify-content:space-between;min-height:48px;padding:0 14px;border-radius:14px;background:var(--skin-accent,#2fd2ff);color:#061018;font-weight:900;text-decoration:none}
      .gei-academy-v1-progress{display:grid;grid-template-columns:1fr auto;gap:8px;align-items:center;padding:12px 14px;margin:0 12px 13px;border-radius:17px;background:var(--skin-soft,#f1f4f8)}
      .gei-academy-v1-progress strong{font-size:18px}.gei-academy-v1-progress span{color:var(--skin-muted,#526b82);font-size:12px}
      .gei-academy-v1-track{grid-column:1/-1;height:9px;border-radius:999px;background:rgba(0,0,0,.08);overflow:hidden}
      .gei-academy-v1-fill{height:100%;width:0;background:linear-gradient(90deg,#3d3dea,#2fd2ff)}
      .gei-academy-v1-locked{margin:0 12px 12px;padding:10px 13px;border:1px solid rgba(255,20,147,.28);border-radius:15px;background:rgba(255,20,147,.08);font-size:13px;font-weight:800}
      .gei-academy-v1-carousel-label{padding:0 12px;margin-bottom:7px;display:flex;justify-content:space-between;gap:12px;align-items:end}
      .gei-academy-v1-carousel-label strong{font-size:21px;line-height:1.05}.gei-academy-v1-carousel-label span{color:var(--skin-muted,#526b82);font-size:11px;font-weight:800;letter-spacing:.06em}
      .gei-academy-v1-carousel{width:100%;overflow-x:auto;overflow-y:hidden;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;scrollbar-width:none;padding:2px 12px 12px}
      .gei-academy-v1-carousel::-webkit-scrollbar{display:none}
      .gei-academy-v1-track-cards{display:flex;gap:13px;width:max-content}
      .gei-academy-v1-card{flex:0 0 min(84vw,355px);overflow:hidden;border:1px solid color-mix(in srgb,var(--skin-accent,#2fd2ff) 30%,transparent);border-radius:25px;background:var(--skin-surface,#fff);box-shadow:0 15px 38px rgba(0,0,0,.10);scroll-snap-align:center}
      .gei-academy-v1-card.is-locked{opacity:.55}
      .gei-academy-v1-card.is-complete{border-color:#22c55e}
      .gei-academy-v1-card-art{position:relative;height:225px;background:linear-gradient(145deg,#07111c,#10283a);overflow:hidden}
      .gei-academy-v1-placeholder{height:100%;display:grid;place-items:center;align-content:center;gap:7px;color:#fff;text-align:center}
      .gei-academy-v1-placeholder strong{font-size:74px;line-height:1}
      .gei-academy-v1-art-day{font-size:12px;font-weight:900;letter-spacing:.18em;color:#2fd2ff}
      .gei-academy-v1-placeholder span:last-child{font-size:9px;letter-spacing:.1em;opacity:.65}
      .gei-academy-v1-state{position:absolute;right:10px;top:10px;padding:6px 9px;border-radius:999px;background:rgba(4,8,14,.76);color:#fff;font-size:10px;font-weight:900;letter-spacing:.08em}
      .gei-academy-v1-card.is-complete .gei-academy-v1-state{background:rgba(22,101,52,.90)}
      .gei-academy-v1-card-body{display:grid;gap:7px;padding:15px}
      .gei-academy-v1-card-top{display:flex;justify-content:space-between;gap:10px;font-size:11px;font-weight:900;letter-spacing:.1em;color:var(--skin-accent,#2fd2ff)}
      .gei-academy-v1-card h3{margin:0;font-size:28px;line-height:1.03}
      .gei-academy-v1-card-body p{margin:0;color:var(--skin-muted,#526b82);font-size:14px;line-height:1.3}
      .gei-academy-v1-play{display:flex;align-items:center;justify-content:space-between;min-height:48px;margin-top:3px;padding:0 13px;border-radius:13px;background:var(--skin-soft,#f1f4f8);color:var(--skin-text,#102a43);font-size:12px;font-weight:900;text-decoration:none}
      .gei-academy-v1-card:not(.is-locked) .gei-academy-v1-play{background:var(--skin-accent,#2fd2ff);color:#061018}
      .gei-academy-v1-dots{display:flex;align-items:center;justify-content:center;gap:5px;padding:1px 0 8px}
      .gei-academy-v1-dot{width:7px;height:7px;border-radius:50%;background:rgba(82,107,130,.25)}
      .gei-academy-v1-dot.is-active{width:22px;border-radius:999px;background:var(--skin-accent,#2fd2ff)}
      @media(max-width:360px){
        #screen-academy.gei-academy-v1 .gei-academy-v1-root{padding-bottom:100px}
        .gei-academy-v1-card{flex-basis:87vw}
        .gei-academy-v1-card-art{height:190px}
        .gei-academy-v1-card h3{font-size:24px}
      }
    `;
    document.head.appendChild(style);
  }

  function render() {
    const screen = document.getElementById("screen-academy");
    if (!screen) return;
    renderStyles();

    const hasName = !!identity()?.hasIdentity?.();
    const name = identity()?.getDamName?.() || "";
    const done = completedDays();
    const next = done.length < 6 ? done.length + 1 : 1;

    screen.classList.add("gei-academy-v1");
    screen.setAttribute("aria-hidden", "false");

    if (!hasName) {
      screen.innerHTML = `
        <div class="gei-academy-v1-root" role="region" aria-label="GEI Academy identity gate">
          <div class="gei-academy-v1-head">
            <div><span class="gei-academy-v1-kicker">GEI ACADEMY</span><h1>Enter the Blueprint</h1><p>Set your Dam Name before entering the six-day Academy.</p></div>
          </div>
          <div class="gei-academy-v1-hero">
            <h2>Set your Dam Name.</h2>
            <p>Your Dam Name becomes your learner identity throughout the Academy.</p>
            <label style="font-size:12px;font-weight:900;letter-spacing:.08em">DAM NAME</label>
            <div style="display:grid;grid-template-columns:24px minmax(0,1fr);gap:6px;align-items:center">
              <span style="font-weight:900;color:var(--skin-accent,#2fd2ff)">@</span>
              <input id="gei-academy-v1-name" maxlength="20" autocomplete="nickname" placeholder="WaterArchitect" style="width:100%;min-height:50px;padding:12px;border:1px solid rgba(82,107,130,.3);border-radius:12px;font:inherit;font-size:16px;color:var(--skin-text,#102a43);background:var(--skin-surface,#fff)">
            </div>
            <button id="gei-academy-v1-enter" type="button" class="gei-academy-v1-cta">ENTER ACADEMY <span>→</span></button>
            <small style="color:var(--skin-muted,#526b82);font-size:11px">3–20 characters • letters, numbers, _ or -</small>
            <div id="gei-academy-v1-error" role="alert" hidden style="color:#d10b63;font-size:13px;font-weight:800"></div>
          </div>
        </div>`;
      const input = document.getElementById("gei-academy-v1-name");
      const submit = () => {
        const value = input?.value || "";
        if (!identity()?.setDamName?.(value, "academy-v1")) {
          const clean = value.trim().replace(/^@+/, "");
          const error = document.getElementById("gei-academy-v1-error");
          if (error) { error.hidden = false; error.textContent = clean.length < 3 ? "Dam Name must be at least 3 characters." : "Use 3–20 characters: letters, numbers, _ or -."; }
          return;
        }
        render();
        window.dispatchEvent(new CustomEvent("gei:academy-identity-unlocked", {detail:{damName:identity().getDamName(),source:"academy-runtime-v1"}}));
      };
      document.getElementById("gei-academy-v1-enter")?.addEventListener("click", submit);
      input?.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); submit(); }});
      requestAnimationFrame(() => input?.focus());
      return;
    }

    const artworkMessage = "Custom Day artwork can be added later.";
    screen.innerHTML = `
      <div class="gei-academy-v1-root" role="region" aria-label="GEI Academy">
        <header class="gei-academy-v1-head">
          <div><span class="gei-academy-v1-kicker">GEI ACADEMY • LEARNER</span><h1>${esc("@"+name)}</h1><p>Choose a stage. Play. Master it. Unlock the next.</p></div>
          <div class="gei-academy-v1-avatar" aria-label="Learner avatar">${identity()?.avatarMarkup?.({className:"gei-academy-v1-avatar-image",alt:"GEI learner avatar"}) || "🦫"}</div>
        </header>

        <section class="gei-academy-v1-progress">
          <div><span>BLUEPRINT PROGRESS</span><strong>${done.length} / 6</strong></div>
          <div style="text-align:right"><span>XP</span><strong>${xp()}</strong></div>
          <div class="gei-academy-v1-track"><div class="gei-academy-v1-fill" style="width:${(done.length / 6) * 100}%"></div></div>
        </section>

        <div class="gei-academy-v1-carousel-label">
          <strong>YOUR SIX DAYS</strong>
          <span>${done.length < 6 ? "SWIPE →" : "ALL STAGES UNLOCKED"}</span>
        </div>

        <div class="gei-academy-v1-carousel" id="gei-academy-v1-carousel" aria-label="GEI Academy Day 1 through Day 6 carousel">
          <div class="gei-academy-v1-track-cards">
            ${DAYS.map((day) => card(day, done)).join("")}
          </div>
        </div>
        <div class="gei-academy-v1-dots" id="gei-academy-v1-dots" aria-label="Current Academy stage">
          ${DAYS.map((_, i) => `<i class="gei-academy-v1-dot${i === Math.min(done.length, 5) ? " is-active" : ""}"></i>`).join("")}
        </div>
        ${done.length < 6 ? `<p class="gei-academy-v1-locked">Day ${next} is your next checkpoint. Complete the current stage to unlock it.</p>` : ""}
      </div>`;

    const carousel = document.getElementById("gei-academy-v1-carousel");
    const dots = Array.from(document.querySelectorAll(".gei-academy-v1-dot"));
    const cards = Array.from(screen.querySelectorAll(".gei-academy-v1-card"));

    function focusCard(index) {
      const card = cards[index];
      if (!card || !carousel) return;
      carousel.scrollTo({left: card.offsetLeft - 12, behavior: "smooth"});
      dots.forEach((dot, i) => dot.classList.toggle("is-active", i === index));
    }

    carousel?.addEventListener("scroll", () => {
      const center = carousel.scrollLeft + carousel.clientWidth / 2;
      let closest = 0;
      let distance = Infinity;
      cards.forEach((card, i) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const delta = Math.abs(center - cardCenter);
        if (delta < distance) { distance = delta; closest = i; }
      });
      dots.forEach((dot, i) => dot.classList.toggle("is-active", i === closest));
    }, {passive:true});

    cards.forEach((card) => {
      card.addEventListener("click", (event) => {
        const link = event.target.closest?.(".gei-academy-v1-play");
        if (!link) return;
        const day = Number(card.dataset.day);
        const allowed = day === 1 || done.some((d) => d.id === day - 1);
        if (!allowed) {
          event.preventDefault();
          window.dispatchEvent(new CustomEvent("gei:day-locked", {detail:{day}}));
        }
      });
    });

    const activeIndex = Math.min(done.length, DAYS.length - 1);
    requestAnimationFrame(() => focusCard(activeIndex));
  }

  function init() {
    window.GEI_ACADEMY_RUNTIME_V1 = Object.freeze({version:"1.1", render});
    render();

    ["gei:identity-updated","gei:learner-identity-ready","gei:progress-updated","gei:day-completion","gei:badges-updated","gei:achievement-earned"].forEach((eventName) => {
      window.addEventListener(eventName, render);
    });

    window.addEventListener("gei:navigation", (event) => {
      if (event.detail?.id === "academy") render();
    });

    window.addEventListener("gei:academy-render", render);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, {once:true});
  else init();
})();