(() => {
  "use strict";

  /* ===== CONSTANTS ===== */
  const COMPLETION_KEY = "geiDayCompletionV1";
  const AUDIO_PROGRESS_KEY = "geiDayAudioProgressV1";
  const DECK_STORAGE_KEY = "gei-splash-image-deck-v1";
  const LAST_IMAGE_KEY = "gei-splash-last-image-v1";
  const MSG_DECK_KEY = "gei-splash-msg-deck-v1";
  const LAST_MSG_KEY = "gei-splash-last-msg-v1";
  const AUDIO_THRESHOLD = 90;
  const SPLASH_TIMEOUT = 10000;
  const TOTAL_DAYS = 6;

  const SPLASH_IMAGES = [
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/y-all-too-god-is-a-mountain-z7efLdbRpVLTxHbD.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/start-here-gei-ZAxHC3CvlzNVXcDh.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/gei-starts-here-orQtAS63EOlGh6HB.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/god-the-mountain-7zeFS6ZCAEhfcma0.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/wilbert-bouie-jr-discovery-Bufo9iokjpWT3r8v.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/yalltoo-WPvyPpmEq4qJVmwx.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/yalltoo-gei-G8MnWLUJs9kGKc5Q.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/what-is-the-firmament-9qGyGNtuv6VKsvqB.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/is-the-bible-real-0Xht5ES8D0XVi2KC.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/god-is-mountain-BCHRDwrxTxtsDi2F.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/god-is-mountains-ump3wrcconXNYMf4.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/was-god-a-person-30Ad9rLKpXzTsdei.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/was-jesus-a-real-person-2BGifdWrS3mblK6X.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/who-decoded-the-bible-2024-l8NULnPzNsNcIBgh.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/water-is-light-wlDWMVCH8EKVKAJP.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/proof-jesus-was-fake-dBKfTDd5wVtoOovy.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/gei-start-here-qluUrUkE6U9tZiWA.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/dewight-mann-god-uBIUgOBZcAygqaqS.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/bible-god-3R68v7GEGZYWcUxD.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/yall-too-support-xgGSevqqnPG0ltF3.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/ocean-god-ErC0y8rj8GUvAE9v.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/y-all-too-decoded-genesis-H1sNYNwF1sEEkhE3.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/wilbert-bouie-jr-gei-oWhYiGHWJRjLUSlW.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/mountain-water-god-8e1Afrt45iPrD0w1.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/read-the-bible-like-wilbert-bouie-jr-VKE1Tnftzc8CWmjH.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/read-genesis-like-wilbert-bouie-jr-MXtcTdXhBbJcFseb.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/the-bible-was-decoded-by-wilbert-bouie-jr-2024-P4Qcl006njMicqwS.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/how-to-read-the-bible-2026-f3BOSOm8smvOuAx6.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/adam-is-a-damn-dam-2RJWUW3JKL00BOR1.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/god-dam-KH6xrnqjXrb3F0sN.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/goddam-7dbUavbnAipNRplN.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/dam-god-RNsM6TxmZqlBV7Tn.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/halloween-is-for-dam-kids-IzkcYSwHxZ6lUmQa.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/god-dam-halloween-JgCMhACu1DGT9lGS.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/mountain-water-oXbBFLXIrLrVcuwC.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/god-water-goZafyA6Z3BfGLhk.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/water-god-E8FZy2xp6vyXZYnt.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/mountain-god-water-11wb1RD5v8B7qm3N.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/wilbert-bouie-jr-gei-diy-EmDGZZuTLk6Rgoa8.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/wilbert-bouie-jr-gei-bible-rH9jpp3TqM7ieGn2.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/wilbert-bouie-jr-gei-genesis-BSHTsUBjt1JXgHUM.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/wilbert-bouie-jr-gei-y-all-too-WNMWb3MfHDWZOOZM.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/wilbert-bouie-jr-gei-yalltoo-9PkrnzHRxefvCGy1.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/wilbert-bouie-jr-gei-genesis-engineered-interpretations-kwSWnKWRiZVB9aDt.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/wilbert-bouie-jr-gei-yall-too-eikvukiQnLbrcW6t.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/doctor-god-ZFQq7gu0Uds2K8xg.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/guitar-god-PnQfaNx4157O1KXf.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/pirate-god-DOkoFBGTq5dMjWIr.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/astronaut-god-eRqNNpho8vDZWJ82.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/god-is-a-mountain-y-all-too-dot-com-hi3CNgf9RV4SqjHx.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/gei-wet-floor-VORHZm8eHpZLzJTv.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/god-is-a-mountain-CPg0kfsb2vuhcbmr.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/adam-is-truly-a-dam-LoNJOtQnPpJJkvLE.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/is-adam-a-dam-XNxj1Mv7wdYN3QFy.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/is-god-a-mountain-qpO2TwmncF0id7wH.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/what-is-a-firmament-8OqgupuTJ7iOMMvU.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/where-is-heaven-JJtSPQddL4C3zxCR.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/where-is-god-HGAWbh9COdS8Igzx.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/god-mountain-3GVTuyelzk091MC0.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/mountain-god-37hJGSo2SKtV6PAk.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/realisticly-is-adam-a-dam-V3TsRHeymHSe1x1z.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/adam-is-the-dam-woGOC54OPUZPg4pW.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/is-god-real-AFMs1G46Tv592OJr.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/what-is-heaven-WmwgtXzhgrGSNQsQ.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/yall-too-contact-god-npiW7DVvPGZGTbqO.png"
  ];

  const WELCOME_MESSAGES = [
    "Explore the Blueprint. Follow the Flow.",
    "Water tells the story. Engineering reveals the structure.",
    "Six days. One system. Begin the journey.",
    "What if Genesis described something built?",
    "The water moves. The structure speaks.",
    "From source to system — follow the flow.",
    "Separation. Containment. Release. Discovery.",
    "Read the water. See the engineering.",
    "An ancient text. A hydraulic reading.",
    "Begin where the water begins.",
    "The dam holds. The wheel turns. The system works.",
    "Every day builds on the last.",
    "Genesis explored through water and engineering.",
    "Listen. Observe. Discover.",
    "The blueprint has always been there."
  ];

  const RESEARCH_WORKS = [
    { title: "Decoding Genesis through Literary Mechanics", source: "SSRN", url: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5792302" },
    { title: "A Methodological Framework for Decoding Ancient Sacred Texts as Technical Manuals", source: "SSRN", url: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5789382" },
    { title: "Reconstructing an Antediluvian Mill and Power-Generation System from Genesis 1 Symbolism", source: "SSRN", url: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5789342" },
    { title: "Symbolic Hydrology: Reclassifying Biblical Characters as Natural and Mechanical Elements", source: "SSRN", url: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5789322" },
    { title: "The Semicolon in Genesis 1:1–2: A Linguistic Marker of Hydraulic Sequencing", source: "SSRN", url: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5789263" },
    { title: "The Firmament as a Hydraulic Partition Wall: Reinterpreting Genesis 1:6-8", source: "SSRN", url: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5789102" },
    { title: "Badal, Raqia, and Miqveh: Water Control Terminology in the Hebrew of Genesis 1", source: "SSRN", url: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=6077590" },
    { title: "A Systems-Oriented Interpretation of Water, Storage, and Flow Terminology in Genesis 1", source: "Zenodo", url: "https://zenodo.org/records/18269802" }
  ];

  /* ===== UTILITIES ===== */

  function readJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      const val = raw ? JSON.parse(raw) : fallback;
      return val && typeof val === "object" ? val : fallback;
    } catch { return fallback; }
  }

  function writeJSON(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  }

  function lsGet(key) {
    try { return localStorage.getItem(key) || ""; } catch { return ""; }
  }

  function lsSet(key, val) {
    try { localStorage.setItem(key, val); } catch {}
  }

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
      const raw = lsGet(deckKey);
      deck = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(deck)) deck = [];
      deck = deck.filter(x => items.includes(x));
    } catch { deck = []; }

    const last = lsGet(lastKey);

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

    lsSet(deckKey, JSON.stringify(deck));
    lsSet(lastKey, pick);
    return pick;
  }

  function isDayComplete(dayNum) {
    const ledger = readJSON(COMPLETION_KEY, {});
    const rec = ledger[dayNum];
    return rec?.completed === true && Number(rec.audioPercent || 0) >= AUDIO_THRESHOLD;
  }

  function countCompleted() {
    let n = 0;
    for (let d = 1; d <= TOTAL_DAYS; d++) { if (isDayComplete(d)) n++; }
    return n;
  }

  function markDayComplete(dayNum, pct) {
    const ledger = readJSON(COMPLETION_KEY, {});
    if (ledger[dayNum]?.completed) return;
    ledger[dayNum] = {
      completed: true,
      audioPercent: Math.round(Math.max(AUDIO_THRESHOLD, pct)),
      completedAt: new Date().toISOString()
    };
    writeJSON(COMPLETION_KEY, ledger);
    window.dispatchEvent(new CustomEvent("gei:day-completion", { detail: { day: dayNum, completion: ledger } }));
  }

  /* ===== SPLASH ===== */

  function initSplash() {
    const overlay = document.getElementById("splash-overlay");
    const img = document.getElementById("splash-image");
    const msg = document.getElementById("splash-message");
    const btn = document.getElementById("splash-enter");
    const bar = document.getElementById("splash-bar-fill");
    if (!overlay) return;

    if (location.hash === "#academy" || location.hash === "#portfolio" || location.hash === "#support") {
      overlay.classList.add("is-hidden");
      overlay.setAttribute("aria-hidden", "true");
      return;
    }

    const selectedImage = pickFromDeck(SPLASH_IMAGES, DECK_STORAGE_KEY, LAST_IMAGE_KEY);
    const selectedMsg = pickFromDeck(WELCOME_MESSAGES, MSG_DECK_KEY, LAST_MSG_KEY);

    img.src = selectedImage;
    img.onerror = () => { img.src = SPLASH_IMAGES[0]; };
    msg.textContent = selectedMsg;

    let done = false;
    function dismiss() {
      if (done) return;
      done = true;
      overlay.classList.add("is-hidden");
      setTimeout(() => overlay.setAttribute("aria-hidden", "true"), 600);
    }

    btn.addEventListener("click", dismiss);
    document.addEventListener("keydown", e => {
      if (!done && e.key === "Enter") { e.preventDefault(); dismiss(); }
    });

    const start = performance.now();
    function tick(now) {
      if (done) return;
      const p = Math.min((now - start) / SPLASH_TIMEOUT, 1);
      bar.style.width = (p * 100) + "%";
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    setTimeout(dismiss, SPLASH_TIMEOUT);
  }

  /* ===== NAVIGATION ===== */

  const SCREEN_IDS = ["home", "academy", "portfolio", "support"];
  let activeScreen = "home";

  function setScreen(id) {
    if (!SCREEN_IDS.includes(id)) id = "home";
    activeScreen = id;

    SCREEN_IDS.forEach(sid => {
      const el = document.getElementById("screen-" + sid);
      if (!el) return;
      const active = sid === id;
      el.classList.toggle("is-active", active);
      el.hidden = !active;
      el.setAttribute("aria-hidden", active ? "false" : "true");
    });

    document.querySelectorAll(".nav-btn").forEach(btn => {
      const active = btn.dataset.screen === id;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-current", active ? "page" : "false");
    });

    const scroll = document.querySelector("#screen-" + id + " .screen-scroll");
    if (scroll) scroll.scrollTop = 0;

    if (id === "academy") updateAcademy();
    updateProgress();
  }

  function initNav() {
    document.querySelectorAll(".nav-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const target = btn.dataset.screen;
        setScreen(target);
        history.replaceState(null, "", "#" + target);
      });
    });

    document.querySelectorAll("[data-nav]").forEach(el => {
      el.addEventListener("click", e => {
        e.preventDefault();
        const target = el.dataset.nav;
        setScreen(target);
        history.replaceState(null, "", "#" + target);
      });
    });

    window.addEventListener("hashchange", () => {
      const h = location.hash.replace("#", "");
      if (SCREEN_IDS.includes(h)) setScreen(h);
    });

    const initial = location.hash.replace("#", "");
    if (SCREEN_IDS.includes(initial)) setScreen(initial);
  }

  /* ===== PROGRESS (Home + Academy) ===== */

  function updateProgress() {
    const count = countCompleted();

    const journeyCount = document.getElementById("journey-count");
    if (journeyCount) journeyCount.textContent = count + " of 6 lessons completed";

    const journeyFill = document.getElementById("journey-fill");
    if (journeyFill) journeyFill.style.width = ((count / TOTAL_DAYS) * 100) + "%";

    const stages = document.getElementById("journey-stages");
    if (stages && !stages.dataset.rendered) {
      stages.dataset.rendered = "true";
      let html = "";
      for (let d = 1; d <= TOTAL_DAYS; d++) {
        if (d > 1) html += '<span class="journey-connector"></span>';
        html += '<span class="journey-stage" data-day="' + d + '"></span>';
      }
      stages.innerHTML = html;
    }
    if (stages) {
      stages.querySelectorAll(".journey-stage").forEach(dot => {
        const d = Number(dot.dataset.day);
        const complete = isDayComplete(d);
        const current = !complete && (d === 1 || isDayComplete(d - 1));
        dot.classList.toggle("is-complete", complete);
        dot.classList.toggle("is-current", current);
      });
    }

    const acadCount = document.getElementById("acad-count");
    if (acadCount) acadCount.textContent = count;

    const acadFill = document.getElementById("acad-fill");
    if (acadFill) acadFill.style.width = ((count / TOTAL_DAYS) * 100) + "%";
  }

  /* ===== ACADEMY ===== */

  const audioMaxPct = {};

  function updateAcademy() {
    const cards = document.querySelectorAll(".lesson-card");
    const count = countCompleted();

    cards.forEach(card => {
      const d = Number(card.dataset.day);
      const complete = isDayComplete(d);
      const unlocked = d === 1 || isDayComplete(d - 1);
      const current = unlocked && !complete;

      card.classList.toggle("is-complete", complete);
      card.classList.toggle("is-current", current);
      card.classList.toggle("is-locked", !unlocked && !complete);

      const status = card.querySelector(".lesson-status");
      if (status) {
        if (complete) {
          status.textContent = "COMPLETE";
          status.className = "lesson-status is-done";
        } else if (current) {
          status.textContent = "CURRENT";
          status.className = "lesson-status is-current";
        } else if (!unlocked) {
          status.textContent = "LOCKED";
          status.className = "lesson-status is-locked";
        } else {
          status.textContent = "";
          status.className = "lesson-status";
        }
      }

      const audio = card.querySelector("audio");
      if (audio && !unlocked && !complete) {
        audio.removeAttribute("controls");
        audio.style.display = "none";
      } else if (audio && (unlocked || complete)) {
        audio.setAttribute("controls", "");
        audio.style.display = "";
      }
    });

    const completeScreen = document.getElementById("academy-complete");
    if (completeScreen) completeScreen.hidden = count < TOTAL_DAYS;
  }

  function initAcademyAudio() {
    document.querySelectorAll(".lesson-card").forEach(card => {
      const d = Number(card.dataset.day);
      const audio = card.querySelector("audio");
      if (!audio) return;

      audioMaxPct[d] = audioMaxPct[d] || 0;

      audio.addEventListener("timeupdate", () => {
        if (!audio.duration || !isFinite(audio.duration)) return;
        const pct = (audio.currentTime / audio.duration) * 100;
        audioMaxPct[d] = Math.max(audioMaxPct[d], pct);

        const progress = readJSON(AUDIO_PROGRESS_KEY, {});
        progress[d] = Math.max(Number(progress[d] || 0), pct);
        writeJSON(AUDIO_PROGRESS_KEY, progress);

        if (audioMaxPct[d] >= AUDIO_THRESHOLD && !isDayComplete(d)) {
          markDayComplete(d, audioMaxPct[d]);
          updateAcademy();
          updateProgress();
        }
      });

      audio.addEventListener("ended", () => {
        audioMaxPct[d] = 100;
        const progress = readJSON(AUDIO_PROGRESS_KEY, {});
        progress[d] = 100;
        writeJSON(AUDIO_PROGRESS_KEY, progress);

        if (!isDayComplete(d)) {
          markDayComplete(d, 100);
          updateAcademy();
          updateProgress();
        }
      });
    });

    const replayBtn = document.getElementById("replay-btn");
    if (replayBtn) {
      replayBtn.addEventListener("click", () => {
        const completeScreen = document.getElementById("academy-complete");
        if (completeScreen) completeScreen.hidden = true;
        const first = document.querySelector('.lesson-card[data-day="1"]');
        if (first) first.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }

  /* ===== PORTFOLIO (Research list) ===== */

  function initPortfolio() {
    const container = document.getElementById("research-items");
    if (!container || container.dataset.rendered) return;
    container.dataset.rendered = "true";

    container.innerHTML = RESEARCH_WORKS.map(w =>
      '<a class="research-item" href="' + w.url + '" target="_blank" rel="noopener noreferrer">' +
        '<span class="kicker">' + w.source + '</span>' +
        '<h3>' + w.title + '</h3>' +
        '<span class="research-item-action">Read paper ↗</span>' +
      '</a>'
    ).join("");
  }

  /* ===== EXTERNAL COMPLETION EVENTS ===== */

  function initExternalSync() {
    window.addEventListener("storage", e => {
      if (e.key === COMPLETION_KEY || e.key === AUDIO_PROGRESS_KEY) {
        updateAcademy();
        updateProgress();
      }
    });

    window.addEventListener("gei:day-completion", () => {
      updateAcademy();
      updateProgress();
    });

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        updateAcademy();
        updateProgress();
      }
    });
  }

  /* ===== INIT ===== */

  function init() {
    initSplash();
    initNav();
    initPortfolio();
    initAcademyAudio();
    updateAcademy();
    updateProgress();
    initExternalSync();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
