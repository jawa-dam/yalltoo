(() => {
  "use strict";

  const GEI_LOGO_URL = "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/gei-logo-gwP3315oRt91xpE8.png";

  const RESEARCH_FEATURES = [
    { title: "Research Entries", detail: "GEI publications and project records" },
    { title: "Citations", detail: "SSRN, Zenodo and source references" },
    { title: "Timeline", detail: "Research development across milestones" },
    { title: "Metadata", detail: "Structured records for each work" }
  ];

  const state = {
    initialized: false
  };

  function getRoot() {
    return document.getElementById("portfolio-root");
  }

  function render() {
    const root = getRoot();
    if (!root) return;

    const features = RESEARCH_FEATURES.map((feature) => `
      <article class="research-feature">
        <strong>${feature.title}</strong>
        <span>${feature.detail}</span>
      </article>
    `).join("");

    root.innerHTML = `
      <header class="portfolio-header">
        <div class="portfolio-title-wrap">
          <span class="screen-kicker">GEI RESEARCH LIBRARY</span>
          <h1>Portfolio</h1>
          <p>Explore the future home of Genesis Engineered research, publications and discovery records.</p>
        </div>
        <img class="portfolio-logo" src="${GEI_LOGO_URL}" alt="G.E.I. logo" decoding="async">
      </header>

      <div class="portfolio-main">
        <article class="research-overview">
          <div class="research-overview-top">
            <h2>Research Library</h2>
            <span class="research-count">Foundation</span>
          </div>
          <div class="research-features">
            ${features}
          </div>
        </article>

        <aside class="portfolio-note" aria-label="Portfolio foundation status">
          <span class="portfolio-note-mark" aria-hidden="true">GEI</span>
          <p>The research system is intentionally staged. Detailed entries, filters, timeline views and external publication records will be introduced in later milestones.</p>
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
