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

      <section class="gei-portfolio-guide" aria-label="Adam portfolio guide">
        <button class="gei-portfolio-mascot" type="button" aria-label="Open Adam research guide">
          <span class="gei-portfolio-mascot-glow" aria-hidden="true"></span>
          <img src="https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/inshot_20260808_192709068-u7bYAfdJRGRfnEfC.gif" alt="Adam, the GEI guide" decoding="async" class="gei-portfolio-guide-gif">
          <span class="gei-portfolio-mascot-badge">ASK ADAM</span>
        </button>
        <div class="gei-portfolio-guide-copy">
          <span class="screen-kicker">RESEARCH GUIDE</span>
          <h2>Follow the evidence trail.</h2>
          <p>Browse the GEI research record, from hydraulic interpretation to linguistic analysis.</p>
          <span class="gei-portfolio-guide-hint">TAP ADAM FOR THE RESEARCH MAP</span>
        </div>
      </section>

      <div class="portfolio-main">
        <article class="research-overview">
          <div class="research-overview-top">
            <h2>Research Publications</h2>
            <span class="research-count">${RESEARCH_WORKS.length} Works</span>
          </div>
          <div class="research-work-grid">
            ${RESEARCH_WORKS.map((work, index) => `
              <a class="research-work" href="${work.url}" target="_blank" rel="noopener noreferrer" aria-label="Open ${work.title} on ${work.source}">
                <span class="research-work-number">${String(index + 1).padStart(2, "0")}</span>
                <span class="research-work-copy">
                  <strong>${work.title}</strong>
                  <small>${work.source} <span aria-hidden="true">↗</span></small>
                </span>
              </a>
            `).join("")}
          </div>
        </article>

        <aside class="portfolio-note" aria-label="GEI research source">
          <span class="portfolio-note-mark" aria-hidden="true">GEI</span>
          <p>Research records link directly to their external publication pages. The canonical project home is YallToo.com.</p>
          <a class="portfolio-source-link" href="https://www.yalltoo.com" target="_blank" rel="noopener noreferrer">YallToo.com ↗</a>
        </aside>
      </div>

      <footer class="portfolio-footer">
        <span>Genesis Engineered Interpretations • Research &amp; Discovery</span>
      </footer>
    `;
  }

  function init() {
    if (state.initialized) return;
    state.initialized = true;
    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
