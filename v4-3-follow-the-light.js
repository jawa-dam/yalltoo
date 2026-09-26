(() => {
  "use strict";

  if (window.GEI_FOLLOW_THE_LIGHT) return;

  const root = document.querySelector(".day-app[data-gei-day]");
  if (!root) return;

  const DAY = Number(root.dataset.geiDay);
  if (!Number.isInteger(DAY) || DAY < 1 || DAY > 6) return;

  const XP_PER_OBJECTIVE = 37;
  const XP_PER_DAY = 111;
  const THRESHOLD = 90;
  const OBJECTIVES = 3;

  const DAY_CONFIG = Object.freeze({
    1: {
      title: "Water & Light",
      question: "What is light?",
      accent: "#2fd2ff",
      accent2: "#3d3dea",
      stage: "SEPARATION BEGINS",
      prompt: "Start with the sequence. What is present before light appears, and what changes when light enters the story?",
      guideTitle: "WHAT IS LIGHT?",
      guide: "Follow the sequence before choosing an answer. Day 1 asks you to observe what is present first and what changes when light enters the story.",
      effects: ["light-burst", "glow-pulse", "ripple", "float-glow", "flash-reveal"]
    },
    2: {
      title: "The Firmament",
      question: "What is the firmament?",
      accent: "#ffb020",
      accent2: "#ff7a18",
      stage: "THE STRUCTURE RISES",
      prompt: "Look for the boundary. What does it separate, and why does that matter?",
      guideTitle: "THE FIRMAMENT",
      guide: "Today we examine the separating structure described in the text and ask what role that boundary plays in the GEI model.",
      effects: ["bounce", "heavy-landing", "shake", "wall-pulse"]
    },
    3: {
      title: "Reservoir & Dry Land",
      question: "Where did the waters go?",
      accent: "#22e3b0",
      accent2: "#0fa3a3",
      stage: "THE WATERS GATHER",
      prompt: "Track the waters. Where do they gather, and what is revealed when they do?",
      guideTitle: "THE WATERS",
      guide: "Today we follow the movement and gathering of the waters and examine what appears when they are gathered.",
      effects: ["wave", "ripple", "splash", "float"]
    },
    4: {
      title: "The Sluice",
      question: "How does the water move?",
      accent: "#8c7bff",
      accent2: "#5b3dff",
      stage: "THE FLOW IS CONTROLLED",
      prompt: "Follow the flow. What decides when and where the water moves next?",
      guideTitle: "CONTROLLED FLOW",
      guide: "Today we investigate movement, release, timing, and the path toward the next engineered stage.",
      effects: ["gate-rotate", "sweep", "flow"]
    },
    5: {
      title: "The Waterwheel",
      question: "What makes the wheel turn?",
      accent: "#ffd43b",
      accent2: "#f59f00",
      stage: "THE SYSTEM MOVES",
      prompt: "Follow the motion. How does moving water become useful work?",
      guideTitle: "THE WATERWHEEL",
      guide: "Today we follow moving water into mechanical activity and examine how motion becomes useful work in the GEI model.",
      effects: ["gear-spin", "spin", "mech-pulse"]
    },
    6: {
      title: "The Beast System",
      question: "What is the Beast System?",
      accent: "#ff3ea5",
      accent2: "#ff1493",
      stage: "THE SYSTEM IS COMPLETE",
      prompt: "Connect all six stages. How do the parts operate as one complete system?",
      guideTitle: "THE BEAST SYSTEM",
      guide: "Today we connect the six stages and examine how the individual components function as a complete system.",
      effects: ["power-pulse", "surge", "activate"]
    }
  });

  const cfg = DAY_CONFIG[DAY];

  if (!window.GEI_MASCOT) {
    const src = root.querySelector("img.day-mascot")?.getAttribute("src");
    if (src) {
      window.GEI_MASCOT = Object.freeze({
        name: "Adam",
        url: src,
        alt: "Adam, the GEI dam guide",
        academyLabel: "Open Adam GEI guide"
      });
    }
  }

  const readJSON = (key, fallback) => {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "null");
      return value && typeof value === "object" ? value : fallback;
    } catch (_) {
      return fallback;
    }
  };

  const masteryFor = (day) => {
    const data = readJSON("geiAdamObjectiveMasteryV1", { mastered: [] });
    return (Array.isArray(data.mastered) ? data.mastered.map(String) : [])
      .filter((key) => key.startsWith(day + "-")).length;
  };

  const audioFor = (day) => {
    const data = readJSON("geiDayAudioProgressV1", {});
    return Math.max(0, Math.min(100, Number(data[day] || 0)));
  };

  const completionFor = (day) => {
    const data = readJSON("geiDayCompletionV1", {});
    return data[day];
  };

  const dayDone = (day) => {
    const record = completionFor(day);
    return !!record &&
      record.completed === true &&
      Number(record.audioPercent || 0) >= THRESHOLD &&
      masteryFor(day) >= OBJECTIVES;
  };

  const unlocked = (day) => day === 1 || completionFor(day - 1)?.completed === true;

  const state = () => {
    const audio = audioFor(DAY);
    const mastered = Math.min(OBJECTIVES, masteryFor(DAY));
    const done = dayDone(DAY);
    const progress = typeof window.GEI_PROGRESS?.getState === "function"
      ? window.GEI_PROGRESS.getState()
      : readJSON("geiAcademyProgressV1", {});
    return {
      audio,
      mastered,
      done,
      listened: audio >= THRESHOLD,
      challenged: mastered >= OBJECTIVES,
      xp: Math.max(0, Number(progress?.xp || 0))
    };
  };

  const esc = (value) => String(value).replace(/[&<>"]/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;"
  }[char]));

  const reduceMotion = () =>
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;

  const el = (tag, cls, html) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (html != null) node.innerHTML = html;
    return node;
  };

  const ensureAdamButton = () => {
    const existingButton = root.querySelector("#gei-day-avatar-button");
    if (existingButton) return existingButton;

    const image = root.querySelector("img.day-mascot");
    if (!image) return null;

    const button = document.createElement("button");
    button.type = "button";
    button.id = "gei-day-avatar-button";
    button.className = "gei-avatar-button";
    button.setAttribute("aria-label", "Open Adam GEI guide");

    image.replaceWith(button);
    button.appendChild(image);
    return button;
  };

  const build = () => {
    if (root.classList.contains("ftl-day")) return;

    document.documentElement.classList.add("ftl");
    root.classList.add("ftl-day");
    root.style.setProperty("--ftl-accent", cfg.accent);
    root.style.setProperty("--ftl-accent-2", cfg.accent2);

    const back = root.querySelector(".day-back");
    const avatar = ensureAdamButton() || root.querySelector(".day-mascot");
    const audioCard = root.querySelector(".audio-card");
    const masteryRoot = root.querySelector("#day-objective-mastery-root");
    const completion = root.querySelector(".completion");

    [
      root.querySelector(".day-kicker")?.closest("section"),
      root.querySelector(".day-hero"),
      root.querySelector(".day-nav"),
      root.querySelector(".day-footer"),
      root.querySelector(".day-top")
    ].forEach((node) => node?.classList.add("ftl-legacy"));

    const top = el("div", "ftl-top");
    if (back) {
      back.textContent = "← Academy";
      top.appendChild(back);
    }
    top.appendChild(el("span", "ftl-xp", '<i aria-hidden="true">⚡</i><b data-ftl-xp>0</b> XP'));

    const hero = el("header", "ftl-hero");
    hero.innerHTML = `
      <div class="ftl-hero-copy">
        <span class="ftl-stage">STAGE ${DAY} OF 6 · ${esc(cfg.stage)}</span>
        <h1 class="ftl-brand"><span>FOLLOW</span><span>THE LIGHT</span></h1>
        <span class="ftl-kicker">GEI ACADEMY • DAY ${DAY}</span>
      </div>
      <div class="ftl-adam" data-fx="">
        <span class="ftl-adam-fx" aria-hidden="true"><i></i><i></i><i></i></span>
        <span class="ftl-adam-stage"></span>
        <span class="ftl-adam-hint" aria-hidden="true">TAP ME</span>
      </div>
      <div class="ftl-question">
        <h2>${esc(cfg.question)}</h2>
        <span>Day ${DAY} · ${esc(cfg.title)}</span>
      </div>`;

    if (avatar) hero.querySelector(".ftl-adam-stage").appendChild(avatar);

    const effect = cfg.effects[Math.floor(Math.random() * cfg.effects.length)];
    hero.querySelector(".ftl-adam").dataset.fx = effect;
    root.dataset.ftlFx = effect;

    const path = el("nav", "ftl-path");
    path.setAttribute("aria-label", "Follow the Light — six-day path");

    const quest = el("div", "ftl-quest");
    const step = (number, key, icon, label) => {
      const section = el("section", "ftl-step");
      section.dataset.step = key;
      section.appendChild(el(
        "div",
        "ftl-step-head",
        `<span class="ftl-step-num">${String(number).padStart(2, "0")}</span><span class="ftl-step-icon" aria-hidden="true">${icon}</span><span class="ftl-step-label">${label}</span><span class="ftl-step-state" data-ftl-state></span>`
      ));
      quest.appendChild(section);
      return section;
    };

    const listen = step(1, "listen", "🎧", "LISTEN");

    if (audioCard) {
      const heading = audioCard.querySelector("h3");
      if (heading) heading.textContent = "FOLLOW THE LIGHT — LISTEN";

      audioCard.querySelector(".audio-meta")?.classList.add("ftl-legacy");

      const meter = el("div", "ftl-audio-meter", `
        <div class="ftl-audio-row"><span>AUDIO PROGRESS</span><b data-ftl-audio>0%</b></div>
        <div class="ftl-lesson">
          <span data-ftl-chip="listen">🎧 Listen 90%</span>
          <span data-ftl-chip="challenge">🧠 0 / 3</span>
          <span data-ftl-chip="master">✨ Master</span>
        </div>`);
      audioCard.appendChild(meter);
      listen.appendChild(audioCard);
    }

    const discover = step(2, "discover", "💡", "DISCOVER");
    discover.appendChild(el(
      "div",
      "ftl-card ftl-discover",
      `<span class="ftl-discover-q">“${esc(cfg.question.replace(/\?$/, ""))}?”</span><p>${esc(cfg.prompt)}</p><button type="button" class="ftl-clue">💬 Ask Adam for a clue</button>`
    ));

    const challenge = step(3, "challenge", "🧠", `DAY ${DAY} CHALLENGE`);
    challenge.appendChild(el(
      "div",
      "ftl-card ftl-challenge-head",
      `<div><span class="ftl-mini">FOLLOW THE LIGHT — CHALLENGE</span><strong data-ftl-checkline>0 / 3 MASTERED</strong></div><span class="ftl-xp-chip" data-ftl-xpchip>+${XP_PER_OBJECTIVE} XP EACH</span>`
    ));
    if (masteryRoot) challenge.appendChild(masteryRoot);

    const master = step(4, "master", "✨", `MASTER · +${XP_PER_DAY} XP`);
    if (completion) {
      completion.appendChild(el("div", "ftl-celebrate"));
      master.appendChild(completion);
    }

    root.prepend(top, hero, path, quest);

    renderPath();
    update();
  };

  const renderPath = () => {
    const path = root.querySelector(".ftl-path");
    if (!path) return;

    path.innerHTML = [1, 2, 3, 4, 5, 6].map((day) => {
      const dayCfg = DAY_CONFIG[day];
      const done = dayDone(day);
      const open = unlocked(day);
      const current = day === DAY;
      const cls = `ftl-node${done ? " is-done" : ""}${current ? " is-current" : ""}${open ? "" : " is-locked"}`;
      const inner = `<b>${done ? "✓" : open ? day : "🔒"}</b>`;
      const style = `style="--node:${dayCfg.accent}"`;
      const label = `Day ${day}: ${dayCfg.title}${done ? ", mastered" : open ? "" : ", locked"}`;

      if (current) {
        return `<span class="${cls}" ${style} aria-current="step" aria-label="${esc(label)}">${inner}</span>`;
      }
      if (open) {
        return `<a class="${cls}" ${style} href="day-${day}.html" aria-label="${esc(label)}">${inner}</a>`;
      }
      return `<span class="${cls}" ${style} aria-label="${esc(label)}">${inner}</span>`;
    }).join('<i class="ftl-link" aria-hidden="true"></i>');
  };

  let lastDone = false;

  const renderCelebration = (fresh) => {
    const box = root.querySelector(".ftl-celebrate");
    if (!box) return;

    const next = DAY < 6 ? DAY + 1 : null;
    const freshClass = !!fresh && !reduceMotion();
    const nextText = next
      ? `FOLLOW THE LIGHT → DAY ${next}`
      : "SIX-DAY BLUEPRINT COMPLETE";

    box.classList.toggle("is-fresh", freshClass);
    box.innerHTML = `
      <span class="ftl-burst" aria-hidden="true"></span>
      <span class="ftl-cele-kicker">✨ DAY ${DAY} MASTERED</span>
      <strong>${next ? "FOLLOW THE LIGHT CONTINUES" : "YOU FOLLOWED THE LIGHT"}</strong>
      <span class="ftl-cele-xp">+${XP_PER_DAY} XP</span>
      <a class="ftl-next" href="${next ? `day-${next}.html` : "index.html#academy"}">
        <span>${nextText}</span>
        <small>${esc(next ? DAY_CONFIG[next].question : "Return to the Academy")}</small>
      </a>
      <a class="ftl-cele-academy" href="index.html#academy">View Academy progress</a>`;
    box.setAttribute("role", "status");
  };

  const update = () => {
    if (!root.classList.contains("ftl-day")) return;

    const current = state();
    const set = (selector, fn) => root.querySelectorAll(selector).forEach(fn);

    set("[data-ftl-xp]", (node) => node.textContent = String(current.xp));
    set("[data-ftl-audio]", (node) => node.textContent = Math.round(current.audio) + "%");

    set('[data-ftl-chip="listen"]', (node) => {
      node.classList.toggle("is-on", current.listened);
      node.textContent = current.listened ? "🎧 Listened ✓" : `🎧 Listen to ${THRESHOLD}%`;
    });

    set('[data-ftl-chip="challenge"]', (node) => {
      node.classList.toggle("is-on", current.challenged);
      node.textContent = `🧠 ${current.mastered} / ${OBJECTIVES}`;
    });

    set('[data-ftl-chip="master"]', (node) => {
      node.classList.toggle("is-on", current.done);
      node.textContent = current.done ? "✨ Mastered" : "✨ Master";
    });

    set("[data-ftl-xpchip]", (node) => { node.hidden = current.challenged; });

    set("[data-ftl-checkline]", (node) => {
      node.textContent = current.challenged
        ? `${OBJECTIVES} / ${OBJECTIVES} MASTERED · +${XP_PER_DAY} XP`
        : `${current.mastered} / ${OBJECTIVES} MASTERED`;
    });

    const states = {
      listen: current.listened,
      discover: current.listened,
      challenge: current.challenged,
      master: current.done
    };

    const order = ["listen", "discover", "challenge", "master"];
    const active = order.find((key) => !states[key]) || null;

    order.forEach((key) => {
      const node = root.querySelector(`.ftl-step[data-step="${key}"]`);
      if (!node) return;
      node.classList.toggle("is-lit", states[key]);
      node.classList.toggle("is-active", key === active);
      const stateNode = node.querySelector("[data-ftl-state]");
      if (stateNode) stateNode.textContent = states[key] ? "✓" : key === active ? "NOW" : "";
    });

    root.style.setProperty("--ftl-lit", String(
      order.filter((key) => states[key]).length / order.length
    ));

    const completion = root.querySelector(".completion");
    completion?.classList.toggle("ftl-is-done", current.done);
    completion?.classList.toggle(
      "ftl-is-ready",
      !current.done && current.listened && current.challenged
    );

    if (current.done) renderCelebration(lastDone === false);
    lastDone = current.done;

    renderPath();
  };

  let lastFocus = null;

  const closeGuide = () => {
    const dialog = document.getElementById("ftl-guide");
    if (!dialog) return;
    dialog.remove();
    document.documentElement.classList.remove("ftl-guide-open");
    lastFocus?.focus?.({ preventScroll: true });
  };

  const nextStepLine = () => {
    const current = state();

    if (current.done) {
      return DAY < 6
        ? `Day ${DAY} is mastered. Day ${DAY + 1} asks: ${DAY_CONFIG[DAY + 1].question}`
        : "All six stages are mastered. Review any stage whenever you like.";
    }

    if (!current.listened) {
      return `Listen first — you're at ${Math.round(current.audio)}%. Reach ${THRESHOLD}% to unlock your mastery.`;
    }

    if (!current.challenged) {
      return `Answer checkpoint ${current.mastered + 1} of ${OBJECTIVES}. Each one earns +${XP_PER_OBJECTIVE} XP.`;
    }

    return `Audio and all ${OBJECTIVES} checkpoints are done. Claim Day ${DAY} below to earn your mastery.`;
  };

  const openGuide = () => {
    if (document.getElementById("ftl-guide")) {
      closeGuide();
      return;
    }

    lastFocus = document.activeElement;
    const api = window.GEI_IDENTITY;
    const definition = api?.getAvatarDefinition?.() || { label: "Adam" };
    const art = api?.avatarMarkup?.({
      className: "ftl-guide-art",
      alt: definition.alt || definition.label
    }) || "";

    const dialog = el("div", "ftl-guide");
    dialog.id = "ftl-guide";
    dialog.innerHTML = `
      <div class="ftl-guide-card" role="dialog" aria-modal="true" aria-labelledby="ftl-guide-title"
           style="--ftl-accent:${cfg.accent};--ftl-accent-2:${cfg.accent2}">
        <button type="button" class="ftl-guide-close" aria-label="Close guide">×</button>
        <div class="ftl-guide-art-wrap">${art}</div>
        <span class="ftl-guide-kicker">FOLLOW THE LIGHT • DAY ${DAY} CLUE</span>
        <h2 id="ftl-guide-title">${esc(cfg.guideTitle)}</h2>
        <p>${esc(cfg.guide)}</p>
        <div class="ftl-guide-next"><span>YOUR NEXT STEP</span>${esc(nextStepLine())}</div>
        <button type="button" class="ftl-guide-go">GOT IT — LET'S GO</button>
        <small>${esc(definition.label || "Adam")} • your GEI guide</small>
      </div>`;

    document.body.appendChild(dialog);
    document.documentElement.classList.add("ftl-guide-open");

    dialog.addEventListener("click", (event) => {
      if (event.target === dialog || event.target.closest(".ftl-guide-close,.ftl-guide-go")) {
        closeGuide();
      }
    });

    dialog.addEventListener("keydown", (event) => {
      if (event.key !== "Tab") return;
      const focusables = [...dialog.querySelectorAll("button")];
      if (focusables.length < 1) return;

      if (event.shiftKey && document.activeElement === focusables[0]) {
        event.preventDefault();
        focusables[focusables.length - 1].focus();
      } else if (!event.shiftKey && document.activeElement === focusables[focusables.length - 1]) {
        event.preventDefault();
        focusables[0].focus();
      }
    });

    requestAnimationFrame(() => dialog.classList.add("is-open"));
    dialog.querySelector(".ftl-guide-go")?.focus({ preventScroll: true });
    window.GEI_SONIC_FX?.icon?.();
  };

  const wire = () => {
    build();

    [
      "gei:audio-progress-updated",
      "gei:day-ux-updated",
      "gei:objective-mastery-updated",
      "gei:day-objectives-mastered",
      "gei:day-completion",
      "gei:achievement-updated",
      "gei:xp-updated",
      "gei:progress-updated",
      "pageshow"
    ].forEach((type) => window.addEventListener(type, update));

    window.addEventListener("storage", (event) => {
      if (!event.key ||
          ["geiDayAudioProgressV1", "geiAdamObjectiveMasteryV1", "geiDayCompletionV1", "geiAcademyProgressV1"]
            .includes(event.key)) {
        update();
      }
    });

    document.addEventListener("click", (event) => {
      const target = event.target.closest?.("#gei-day-avatar-button, .ftl-clue");
      if (!target) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      openGuide();
    }, true);

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeGuide();
    });
  };

  window.GEI_FOLLOW_THE_LIGHT = Object.freeze({
    version: "4.3-safety-pass",
    day: DAY,
    config: DAY_CONFIG,
    openGuide,
    update
  });

  const start = () => {
    if (root.dataset.ftlStarted === "1") return;
    root.dataset.ftlStarted = "1";
    wire();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();