(() => {
  "use strict";

  if (window.GEI_RANDOM_HERO_V44) return;

  const root = document.querySelector(".day-app[data-gei-day]");
  if (!root) return;

  const DAY = Number(root.dataset.geiDay);
  if (!Number.isInteger(DAY) || DAY < 1 || DAY > 6) return;

  const heroImages = [
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/y-all-too-god-is-a-mountain-z7efLdbRpVLTxHbD.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/start-here-gei-ZAxHC3CvlzNVXcDh.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/gei-starts-here-orQtAS63EOlGh6HB.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/god-the-mountain-7zeFS6ZCAEhfcma0.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/gei-start-here-qluUrUkE6U9tZiWA.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/god-is-a-mountain-y-all-too-dot-com-hi3CNgf9RV4SqjHx.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/gei-wet-floor-VORHZm8eHpZLzJTv.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/figurative-language-gei-yall-too-TqJ0XYhdHfhyocmE.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/gei-punc-gOVtbrk9oVoIcuuA.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/the-ites-gei-yall-too-FzUpjro2fyff07vq.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/yall-too-contact-god-npiW7DVvPGZGTbqO.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/ask_yall_too_anything-8O6WMOO7oGYK5Z8e.png"
  ];

  const effects = [
    "fade-rise", "soft-zoom", "drift-left", "drift-right",
    "gentle-tilt", "float", "breathe", "glow-pulse"
  ];

  // V4.3 builds the hero at DOMContentLoaded. V4.4 waits for it.
  const init = () => {
    const currentHero = root.querySelector(".ftl-hero");
    if (!currentHero) return false;

    const readSession = (key) => {
      try { return sessionStorage.getItem(key) || ""; } catch (_) { return ""; }
    };
    const writeSession = (key, value) => {
      try { sessionStorage.setItem(key, value); } catch (_) {}
    };
    const pick = (list, previous) => {
      const pool = list.filter((item) => item !== previous);
      const source = pool.length ? pool : list.slice();
      return source[Math.floor(Math.random() * source.length)];
    };

    const oldButton = currentHero.querySelector("#gei-day-avatar-button");
    const oldImage = oldButton?.querySelector("img") || currentHero.querySelector("img.day-mascot");
    const fallbackSrc = oldImage?.getAttribute("src") || "";

    const previousImage = readSession("gei-ftl-last-hero-image-v44");
    const previousEffect = readSession("gei-ftl-last-hero-effect-v44");
    const imageSrc = pick(heroImages, previousImage) || fallbackSrc;
    const effect = pick(effects, previousEffect);

    writeSession("gei-ftl-last-hero-image-v44", imageSrc);
    writeSession("gei-ftl-last-hero-effect-v44", effect);

    const stage = currentHero.querySelector(".ftl-adam-stage");
    const hint = currentHero.querySelector(".ftl-adam-hint");
    const effectHost = currentHero.querySelector(".ftl-adam");
    if (!stage || !effectHost) return false;

    let button = stage.querySelector("#ftl-hero-art");
    if (!button) {
      button = document.createElement("button");
      button.type = "button";
      button.id = "ftl-hero-art";
      button.className = "ftl-hero-art";
      button.setAttribute("aria-label", "Tap hero artwork for a Day-specific clue");
      stage.replaceChildren(button);
    }

    const image = document.createElement("img");
    image.className = "ftl-hero-art-image";
    image.alt = `GEI Academy Day ${DAY} hero artwork`;
    image.decoding = "async";
    image.loading = "eager";

    let fallbackUsed = false;
    const showFallback = () => {
      if (!fallbackUsed && fallbackSrc && image.getAttribute("src") !== fallbackSrc) {
        fallbackUsed = true;
        image.src = fallbackSrc;
        return;
      }
      button.classList.add("is-failed");
    };

    image.addEventListener("error", showFallback);
    image.addEventListener("load", () => {
      image.classList.add("is-loaded");
      button.classList.add("is-loaded");
      button.classList.remove("is-failed");
    });

    image.src = imageSrc;
    button.appendChild(image);

    effectHost.dataset.v44Fx = effect;
    effectHost.classList.add("ftl-v44-hero");
    if (hint) hint.textContent = "TAP FOR A CLUE";

    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      window.GEI_FOLLOW_THE_LIGHT?.openGuide?.();
    });

    window.GEI_RANDOM_HERO_V44 = Object.freeze({
      version: "4.4-safety-pass",
      day: DAY,
      image: imageSrc,
      effect
    });
    return true;
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else if (!init()) {
    window.addEventListener("load", init, { once: true });
  }

})();
