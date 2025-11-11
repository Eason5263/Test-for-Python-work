// Simple landing page without 3D
// Change these imports:
import CONFIG from '../config.js';        // ✅ correct
import DOM from '../utils/dom.js';        // ✅ correct  
import router from '../router.js';        // ✅ correct

// Your current paths might be wrong - use the above

class LandingPage {
  async init(container) {
    this.container = container;
    await this.render();
    this.bindEvents();
  }

  async render() {
    this.container.innerHTML = `
      <div class="landing-portal" style="
        min-height: 100vh;
        background: linear-gradient(135deg, #0A0E27 0%, #1a1f38 100%);
        color: white;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 2rem;
      ">
        <div class="portal-content">
          <h1 style="font-size: 4rem; margin-bottom: 1rem; background: linear-gradient(135deg, #00D9FF, #7B2FFF); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">DevVerse</h1>
          <p style="font-size: 1.5rem; margin-bottom: 3rem; color: #B8C5D6;">Explore my developer universe</p>
          
          <div style="display: flex; gap: 2rem; flex-wrap: wrap; justify-content: center; margin-bottom: 3rem;">
            ${Object.entries(CONFIG.PLANETS).map(([id, planet]) => `
              <button class="planet-btn" data-planet="${id}" style="
                width: 100px;
                height: 100px;
                border-radius: 50%;
                background: radial-gradient(circle, ${planet.color} 30%, transparent 70%);
                border: 2px solid ${planet.color};
                color: white;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 0.9rem;
              ">${planet.name}</button>
            `).join('')}
          </div>

          <div style="display: flex; gap: 1rem;">
            <button class="btn" id="theme-toggle" style="padding: 0.75rem 1.5rem; border: 2px solid #00D9FF; background: transparent; color: #00D9FF; border-radius: 8px; cursor: pointer;">Switch Theme</button>
          </div>
        </div>
      </div>
    `;
  }

  bindEvents() {
    DOM.on(this.container, 'click', '.planet-btn', (e) => {
      const planetId = e.target.dataset.planet;
      router.navigate(`/${planetId}`);
    });

    DOM.on(this.container, 'click', '#theme-toggle', () => {
      document.body.classList.toggle('theme-fantasy');
    });
  }
}

export default new LandingPage();