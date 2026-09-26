/* GEI Academy Runtime V1
   Single-owner Academy rendering.
   Keeps identity + presentation in one state flow.
*/
(() => {
  "use strict";
  if (window.GEI_ACADEMY_RUNTIME_V1) return;

  const DAYS = Object.freeze([
    { id: 1, title: "Water & Light", icon: "💧", url: "day-1.html" },
    { id: 2, title: "The Firmament", icon: "🧱", url: "day-2.html" },
    { id: 3, title: "Reservoir & Dry Land", icon: "🌊", url: "day-3.html" },
    { id: 4, title: "The Sluice", icon: "🚪", url: "day-4.html" },
    { id: 5, title: "The Waterwheel", icon: "⚙️", url: "day-5.html" },
    { id: 6, title: "The Beast System", icon: "🏗️", url: "day-6.html" }
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
    const unlocked = day.id === 1 || complete.some((d) => d.id === day.id - 1);
    const status = complete.some((d) => d.id === day.id) ? "MASTERED" : unlocked ? (day.id === 1 ? "START HERE" : "UNLOCKED") : "LOCKED";
    return `
      <a class="gei-academy-v1-card ${unlocked ? "" : "is-locked"} ${status === "MASTERED" ? "is-complete" : ""}"
         data-day="${day.id}" href="${day.url}" aria-disabled="${String(!unlocked)}">
        <span class="gei-academy-v1-card-top"><span>DAY ${day.id}</span><b>${status}</b></span>
        <span class="gei-academy-v1-card-icon" aria-hidden="true">${day.icon}</span>
        <strong>${esc(day.title)}</strong>
        <span class="gei-academy-v1-card-note">${unlocked ? "Enter this stage" : "Complete the previous stage"}</span>
      </a>`;
  }

  function renderStyles() {
    if (document.getElementById("gei-academy-runtime-v1-style")) return;
    const style = document.createElement("style");
    style.id = "gei-academy-runtime-v1-style";
    style.textContent = `
      #screen-academy.gei-academy-v1 { display:block!important; visibility:visible!important; opacity:1!important; overflow:hidden!important; }
      #screen-academy.gei-academy-v1 .gei-academy-v1-root { width:100%; height:100%; box-sizing:border-box; overflow:auto; padding:12px 12px 110px; font-family:Plus Jakarta Sans,Inter,system-ui,sans-serif; color:var(--skin-text,#102a43); background:var(--skin-bg,#f7f9fc); }
      .gei-academy-v1-root * { box-sizing:border-box; }
      .gei-academy-v1-head { display:grid; grid-template-columns:minmax(0,1fr) auto; gap:12px; align-items:center; margin-bottom:12px; }
      .gei-academy-v1-kicker { font-size:11px; font-weight:900; letter-spacing:.12em; color:var(--skin-accent,#2fd2ff); }
      .gei-academy-v1-head h1 { margin:5px 0 0; font-size:clamp(28px,8vw,38px); line-height:1; }
      .gei-academy-v1-head p { margin:6px 0 0; color:var(--skin-muted,#526b82); font-size:14px; line-height:1.35; }
      .gei-academy-v1-avatar { width:58px; height:58px; border-radius:18px; overflow:hidden; border:2px solid var(--skin-accent,#2fd2ff); background:var(--skin-surface,#fff); padding:0; }
      .gei-academy-v1-avatar img { width:100%; height:100%; object-fit:cover; }
      .gei-academy-v1-hero { display:grid; gap:10px; padding:16px; margin-bottom:12px; border:1px solid color-mix(in srgb,var(--skin-accent,#2fd2ff) 32%,transparent); border-radius:22px; background:var(--skin-surface,#fff); }
      .gei-academy-v1-hero h2 { margin:0; font-size:24px; line-height:1.05; }
      .gei-academy-v1-hero p { margin:0; color:var(--skin-muted,#526b82); font-size:15px; line-height:1.4; }
      .gei-academy-v1-cta { display:flex; align-items:center; justify-content:space-between; min-height:50px; padding:0 14px; border-radius:14px; background:var(--skin-accent,#2fd2ff); color:#061018; font-weight:900; text-decoration:none; }
      .gei-academy-v1-progress { display:grid; grid-template-columns:1fr auto; gap:8px; align-items:center; padding:12px 14px; border-radius:16px; background:var(--skin-soft,#f1f4f8); }
      .gei-academy-v1-progress strong { font-size:19px; }
      .gei-academy-v1-progress span { color:var(--skin-muted,#526b82); font-size:12px; }
      .gei-academy-v1-track { grid-column:1/-1; height:9px; border-radius:999px; background:rgba(0,0,0,.08); overflow:hidden; }
      .gei-academy-v1-fill { height:100%; width:0; background:linear-gradient(90deg,#3d3dea,#2fd2ff); }
      .gei-academy-v1-grid { display:grid; gap:10px; }
      .gei-academy-v1-card { display:grid; gap:7px; min-height:168px; padding:15px; border:1px solid color-mix(in srgb,var(--skin-accent,#2fd2ff) 24%,transparent); border-radius:20px; background:var(--skin-surface,#fff); color:inherit; text-decoration:none; }
      .gei-academy-v1-card-top { display:flex; justify-content:space-between; gap:8px; font-size:11px; font-weight:900; letter-spacing:.08em; }
      .gei-academy-v1-card-top b { color:var(--skin-accent,#2fd2ff); }
      .gei-academy-v1-card-icon { font-size:40px; }
      .gei-academy-v1-card strong { font-size:25px; line-height:1.05; }
      .gei-academy-v1-card-note { color:var(--skin-muted,#526b82); font-size:13px; }
      .gei-academy-v1-card.is-locked { opacity:.48; pointer-events:auto; }
      .gei-academy-v1-card.is-complete { border-color:#22c55e; }
      .gei-academy-v1-locked { margin:0 0 12px; padding:11px 13px; border:1px solid rgba(255,20,147,.28); border-radius:15px; background:rgba(255,20,147,.08); color:var(--skin-text,#102a43); font-size:13px; font-weight:800; }
      .gei-academy-v1-name { color:var(--skin-accent,#2fd2ff); }
      @media(max-width:360px){
        #screen-academy.gei-academy-v1 .gei-academy-v1-root{padding:9px 9px 102px}
        .gei-academy-v1-card{min-height:145px;padding:13px}
        .gei-academy-v1-card strong{font-size:22px}
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

    screen.innerHTML = `
      <div class="gei-academy-v1-root" role="region" aria-label="GEI Academy">
        <header class="gei-academy-v1-head">
          <div><span class="gei-academy-v1-kicker">GEI ACADEMY • LEARNER</span><h1>${esc(name ? "@" + name : "GEI Academy")}</h1><p>6-Day Water Blueprint · Water, Engineering & Interpretation</p></div>
          <div class="gei-academy-v1-avatar" aria-label="Learner avatar">${identity()?.avatarMarkup?.({className:"gei-academy-v1-avatar-image",alt:"GEI learner avatar"}) || "🦫"}</div>
        </header>
        <section class="gei-academy-v1-hero">
          <h2>Explore the Water Blueprint.</h2>
          <p>Move through six hydraulic stages, one day at a time.</p>
          <a class="gei-academy-v1-cta" href="day-${next}.html"><span>CONTINUE DAY ${next}</span><span>→</span></a>
        </section>
        <section class="gei-academy-v1-progress">
          <div><span>BLUEPRINT PROGRESS</span><strong>${done.length} / 6</strong></div>
          <div style="text-align:right"><span>XP</span><strong>${xp()}</strong></div>
          <div class="gei-academy-v1-track"><div class="gei-academy-v1-fill" style="width:${(done.length / 6) * 100}%"></div></div>
        </section>
        ${done.length < 6 ? `<p class="gei-academy-v1-locked">Next stage: Day ${next}. Complete each lesson's audio requirement before the following stage unlocks.</p>` : ""}
        <section class="gei-academy-v1-grid" aria-label="Six-day Academy stages">
          ${DAYS.map((day) => card(day, done)).join("")}
        </section>
      </div>`;

    screen.querySelectorAll(".gei-academy-v1-card").forEach((link) => {
      link.addEventListener("click", (event) => {
        if (link.classList.contains("is-locked")) {
          event.preventDefault();
          window.dispatchEvent(new CustomEvent("gei:day-locked", { detail: { day: Number(link.dataset.day) } }));
        }
      });
    });
  }

  function init() {
    window.GEI_ACADEMY_RUNTIME_V1 = Object.freeze({ version:"1.0", render });
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