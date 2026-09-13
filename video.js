(() => {
  'use strict';

  const root = document.getElementById('video-root');
  if (!root) return;

  const videos = [
    { title: 'Genesis Engineered Interpretations', meta: 'GEI • Featured', description: 'A guided media space for exploring the GEI framework.' },
    { title: 'Water & Engineering', meta: 'GEI • Lesson Media', description: 'Visual learning resources connecting water systems and engineering ideas.' },
    { title: 'Genesis Day One', meta: 'GEI • Academy', description: 'Prepare for the Day 1 learning experience with visual media.' }
  ];

  root.innerHTML = `
    <div class="video-lab">
      <header class="video-header">
        <div>
          <span class="video-eyebrow">GENESIS ENGINEERED INTERPRETATIONS</span>
          <h1>Video Lab</h1>
          <p>Explore GEI through visual learning, guided media, and sound.</p>
        </div>
        <div class="video-logo" aria-label="G.E.I. logo">G.E.I.</div>
      </header>

      <article class="video-feature">
        <div class="video-feature-art" aria-hidden="true"><span>GEI</span></div>
        <div class="video-feature-copy">
          <span class="video-label">FEATURED MEDIA</span>
          <h2>See the blueprint.</h2>
          <p>Video lessons will become playable here as the media system expands.</p>
          <button class="video-primary" type="button" disabled>Coming Soon <span>▶</span></button>
        </div>
      </article>

      <section class="video-library" aria-labelledby="video-library-title">
        <div class="video-section-head"><h2 id="video-library-title">Media Library</h2><span>FOUNDATION</span></div>
        <div class="video-cards">
          ${videos.map((item, index) => `
            <article class="video-card">
              <div class="video-thumb" aria-hidden="true"><span>${String(index + 1).padStart(2, '0')}</span><b>▶</b></div>
              <div><span class="video-card-meta">${item.meta}</span><h3>${item.title}</h3><p>${item.description}</p></div>
            </article>
          `).join('')}
        </div>
      </section>

      <button class="music-lab-entry" type="button" disabled>
        <span><small>GEI MEDIA</small><strong>Music Lab</strong></span><b>Coming Soon</b>
      </button>
    </div>
  `;
})();
