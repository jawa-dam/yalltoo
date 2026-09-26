(() => {
  "use strict";

  const GEI_LOGO_URL = "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/gei-logo-gwP3315oRt91xpE8.png";

  const RESEARCH_WORKS = [
    { title: "Decoding the Creation Story as an Antediluvian Hydraulic Blueprint", source: "SSRN", url: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5622371" },
    { title: "Decoding Genesis through Literary Mechanics", source: "SSRN", url: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5792302" },
    { title: "A Methodological Framework for Decoding Ancient Sacred Texts as Technical Manuals", source: "SSRN", url: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5789382" },
    { title: "Reconstructing an Antediluvian Mill and Power-Generation System from Genesis 1 Symbolism", source: "SSRN", url: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5789342" },
    { title: "Symbolic Hydrology: Reclassifying Biblical Characters as Natural and Mechanical Elements in a Proto-Engineering System", source: "SSRN", url: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5789322" },
    { title: "The Semicolon in Genesis 1:1–2: A Linguistic Marker of Hydraulic Sequencing in Ancient Symbolic Notation", source: "SSRN", url: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5789263" },
    { title: "The Firmament as a Hydraulic Partition Wall: Reinterpreting Genesis 1:6-8 Through Antediluvian Water Engineering", source: "SSRN", url: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5789102" },
    { title: "Badal, Raqia, and Miqveh: Water Control Terminology in the Hebrew of Genesis 1", source: "SSRN", url: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=6077590" },
    { title: "A Systems-Oriented Interpretation of Water, Storage, and Flow Terminology in Genesis 1", source: "Zenodo", url: "https://zenodo.org/records/18269802" },
    { title: "Genesis Engineered – The Dam and Mill Blueprint Revealed", source: "Zenodo", url: "https://zenodo.org/records/17316846" }
  ];

  const state = { initialized: false };

  function getRoot() {
    return document.getElementById("portfolio-root");
  }

  function render() {
    const root = getRoot();
    if (!root) return;

    root.innerHTML = `
      <header class="portfolio-header">
        <div class="portfolio-title-wrap">
          <span class="screen-kicker">GEI RESEARCH LIBRARY</span>
          <h1>Portfolio</h1>
          <p>Explore Genesis Engineered research, publications and discovery records.</p>
        </div>
        <img class="portfolio-logo" src="${GEI_LOGO_URL}" alt="G.E.I. logo" decoding="async">
      </header>

      <a class="gei-portfolio-store-card" href="https://www.yalltoo.com/gei-discovery-guide-" target="_blank" rel="noopener noreferrer" aria-label="Open the GEI Discovery Guide store page">
        <div class="gei-portfolio-store-art">
          <img src="https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/inshot_20260808_192709068-u7bYAfdJRGRfnEfC.gif" alt="GEI Discovery Guide" class="gei-portfolio-store-gif" decoding="async">
        </div>
        <div class="gei-portfolio-store-copy">
          <span class="screen-kicker">GEI DISCOVERY GUIDE</span>
          <h2>Take the blueprint with you.</h2>
          <p>Open the GEI store and explore the Discovery Guide.</p>
          <span class="gei-portfolio-store-action">OPEN STORE ↗</span>
        </div>
      </a>

      <section class="research-carousel" aria-label="Featured GEI research papers">
        <div class="research-carousel-head">
          <div>
            <span class="screen-kicker">FEATURED PAPERS</span>
            <h2>Research Collector Deck</h2>
          </div>
          <span class="research-carousel-count">10 CARDS</span>
        </div>
        <div class="research-carousel-viewport">
          <div class="research-carousel-track">
            ${RESEARCH_WORKS.map((work, index) => `
              <a class="research-hero-card" href="${work.url}" target="_blank" rel="noopener noreferrer" aria-label="Open ${work.title} on ${work.source}">
                <div class="research-hero-card-top">
                  <span class="research-hero-number">${String(index + 1).padStart(2, "0")}</span>
                  <span class="research-hero-source">${work.source}</span>
                </div>
                <div class="research-hero-card-art" aria-hidden="true"><span>GEI</span><b>${String(index + 1).padStart(2, "0")}</b></div>
                <div class="research-hero-card-copy">
                  <span>GENESIS ENGINEERED INTERPRETATIONS</span>
                  <h3>${work.title}</h3>
                  <small>Open publication ↗</small>
                </div>
              </a>
            `).join("")}
          </div>
        </div>
        <div class="research-carousel-controls" aria-label="Research card controls">
          <button type="button" class="research-carousel-arrow" data-direction="prev" aria-label="Previous research card">‹</button>
          <div class="research-carousel-dots" aria-hidden="true">${RESEARCH_WORKS.map((_,i)=>`<i class="${i===0?"is-active":""}"></i>`).join("")}</div>
          <button type="button" class="research-carousel-arrow" data-direction="next" aria-label="Next research card">›</button>
        </div>
      </section>

      <aside class="portfolio-note" aria-label="GEI research source">
        <span class="portfolio-note-mark" aria-hidden="true">GEI</span>
        <p>Research records link directly to their external publication pages. The canonical project home is YallToo.com.</p>
        <a class="portfolio-source-link" href="https://www.yalltoo.com" target="_blank" rel="noopener noreferrer">YallToo.com ↗</a>
      </aside>

      <footer class="portfolio-footer">
        <span>Genesis Engineered Interpretations • Research &amp; Discovery</span>
      </footer>
    `;
  }

  function init() {
    if (state.initialized) return;
    state.initialized = true;
    render();

    const root = getRoot();
    if (!root) return;
    const track = root.querySelector(".research-carousel-track");
    const viewport = root.querySelector(".research-carousel-viewport");
    const prev = root.querySelector('[data-direction="prev"]');
    const next = root.querySelector('[data-direction="next"]');
    const dots = Array.from(root.querySelectorAll(".research-carousel-dots i"));
    let index = 0;

    const go = (nextIndex) => {
      if (!track || !viewport) return;
      index = (nextIndex + RESEARCH_WORKS.length) % RESEARCH_WORKS.length;
      const card = track.querySelectorAll(".research-hero-card")[index];
      if (card) viewport.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: "smooth" });
      dots.forEach((dot, i) => dot.classList.toggle("is-active", i === index));
    };

    prev?.addEventListener("click", () => go(index - 1));
    next?.addEventListener("click", () => go(index + 1));
    viewport?.addEventListener("scroll", () => {
      const cards = Array.from(track.querySelectorAll(".research-hero-card"));
      if (!cards.length) return;
      let closest = 0, best = Infinity;
      const center = viewport.scrollLeft + viewport.clientWidth / 2;
      cards.forEach((card, i) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const distance = Math.abs(center - cardCenter);
        if (distance < best) { best = distance; closest = i; }
      });
      if (closest !== index) {
        index = closest;
        dots.forEach((dot, i) => dot.classList.toggle("is-active", i === index));
      }
    }, { passive: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
