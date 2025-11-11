// Main Application Entry Point
import CONFIG from './config.js';
import router from './router.js';
import themeSwitcher from './components/theme-switcher.js';
import storage from './utils/storage.js';
import DOM from './utils/dom.js';

class DevVerseApp {
  constructor() {
    this.initialized = false;
    this.loading = true;
    this.visitedPlanets = new Set();
    this.achievements = new Set();
  }

  // Initialize the application
  async init() {
    if (this.initialized) return;

    console.log(`%c🌌 ${CONFIG.APP_NAME} v${CONFIG.VERSION}`, 
      'font-size: 20px; font-weight: bold; color: #00D9FF;');

    try {
      // Show loading screen
      this.showLoading();

      // Load user data
      this.loadUserData();

      // Setup router
      this.setupRouter();

      // Setup theme switcher
      this.setupThemeSwitcher();

      // Track first visit
      this.trackFirstVisit();

      // Setup global event listeners
      this.setupEventListeners();

      // Hide loading screen
      await this.hideLoading();

      this.initialized = true;
      console.log('✅ DevVerse initialized successfully');
    } catch (error) {
      console.error('❌ Initialization error:', error);
      this.handleError(error);
    }
  }

  // Show loading screen
  showLoading() {
    const loading = DOM.$('.loading');
    if (loading) {
      DOM.removeClass(loading, 'hidden');
    }
  }

  // Hide loading screen
  async hideLoading() {
    return new Promise(resolve => {
      setTimeout(() => {
        const loading = DOM.$('.loading');
        if (loading) {
          DOM.addClass(loading, 'hidden');
        }
        this.loading = false;
        resolve();
      }, 500);
    });
  }

  // Load user data from storage
  loadUserData() {
    // Load visited planets
    const visited = storage.get(CONFIG.STORAGE_KEYS.visited, []);
    this.visitedPlanets = new Set(visited);

    // Load achievements
    const achievements = storage.get(CONFIG.STORAGE_KEYS.achievements, []);
    this.achievements = new Set(achievements);

    console.log('Loaded user data:', {
      visited: this.visitedPlanets.size,
      achievements: this.achievements.size
    });
  }

  // Save user data to storage
  saveUserData() {
    storage.set(CONFIG.STORAGE_KEYS.visited, Array.from(this.visitedPlanets));
    storage.set(CONFIG.STORAGE_KEYS.achievements, Array.from(this.achievements));
  }

  // Setup router with routes
  setupRouter() {
    router.registerRoutes({
      '/': () => this.loadPage('landing'),
      '/about': () => this.loadPage('about'),
      '/projects': () => this.loadPage('projects'),
      '/skills': () => this.loadPage('skills'),
      '/blog': () => this.loadPage('blog'),
      '/blog/:slug': (params) => this.loadPage('blog', params),
      '/contact': () => this.loadPage('contact')
    });

    // 404 handler
    router.setNotFound((path) => {
      console.warn('404: Page not found -', path);
      this.show404();
    });

    // Before navigation hook
    router.beforeEach((to, from) => {
      console.log(`Navigating: ${from || 'initial'} → ${to}`);
      this.showLoading();
      return true;
    });

    // After navigation hook
    router.afterEach((path) => {
      this.hideLoading();
      this.trackPageVisit(path);
      this.saveUserData();
    });
  }

  // Load page content
  async loadPage(pageName, params = {}) {
    console.log(`Loading page: ${pageName}`, params);

    try {
      // Dynamic import of page module
      const pageModule = await import(`./planets/${pageName}.js`);
      
      // Get app container
      const app = DOM.$('#app');
      
      if (!app) {
        throw new Error('App container not found');
      }

      // Initialize page
      if (pageModule.default && typeof pageModule.default.init === 'function') {
        await pageModule.default.init(app, params);
      }

      // Track planet visit
      if (pageName !== 'landing') {
        this.visitPlanet(pageName);
      }
    } catch (error) {
      console.error(`Error loading page ${pageName}:`, error);
      this.showError(`Failed to load ${pageName} page`);
    }
  }

  // Setup theme switcher
  setupThemeSwitcher() {
    const themeSwitcherEl = themeSwitcher.create();
    
    // Find or create theme switcher container
    let container = DOM.$('.theme-switcher-container');
    
    if (!container) {
      container = DOM.create('div', { class: 'theme-switcher-container' });
      document.body.appendChild(container);
    }
    
    container.appendChild(themeSwitcherEl);

    // Listen for theme changes
    document.addEventListener('themechange', (e) => {
      console.log('Theme changed to:', e.detail.theme);
      this.unlockAchievement('theme_switch');
    });
  }

  // Track first visit
  trackFirstVisit() {
    if (!this.achievements.has('first_visit')) {
      this.unlockAchievement('first_visit');
    }
  }

  // Track page visit
  trackPageVisit(path) {
    const page = path.split('/')[1] || 'landing';
    
    // Add page view analytics here if needed
    console.log('Page visit:', page);
  }

  // Visit a planet
  visitPlanet(planetName) {
    if (!this.visitedPlanets.has(planetName)) {
      this.visitedPlanets.add(planetName);
      console.log(`🪐 First visit to ${planetName}`);
      
      // Check if visited all planets
      const allPlanets = Object.keys(CONFIG.PLANETS);
      const visitedAll = allPlanets.every(p => this.visitedPlanets.has(p));
      
      if (visitedAll) {
        this.unlockAchievement('all_planets');
      }
    }
  }

  // Unlock achievement
  unlockAchievement(achievementId) {
    if (!this.achievements.has(achievementId)) {
      this.achievements.add(achievementId);
      
      const achievement = CONFIG.ACHIEVEMENTS[achievementId];
      if (achievement) {
        this.showAchievement(achievement);
        console.log('🏆 Achievement unlocked:', achievement.name);
      }
      
      this.saveUserData();
    }
  }

  // Show achievement notification
  showAchievement(achievement) {
    const notification = DOM.create('div', {
      class: 'achievement-notification'
    }, 
      DOM.create('div', { class: 'achievement-icon' }, '🏆'),
      DOM.create('div', { class: 'achievement-content' },
        DOM.create('div', { class: 'achievement-title' }, achievement.name),
        DOM.create('div', { class: 'achievement-desc' }, achievement.desc)
      )
    );

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => DOM.addClass(notification, 'show'), 100);

    // Remove after delay
    setTimeout(() => {
      DOM.removeClass(notification, 'show');
      setTimeout(() => notification.remove(), 300);
    }, 4000);
  }

  // Show 404 page
  show404() {
    const app = DOM.$('#app');
    if (!app) return;

    app.innerHTML = `
      <div class="error-page">
        <h1 class="error-code">404</h1>
        <p class="error-message">Lost in space? This planet doesn't exist.</p>
        <a href="/" data-link class="btn-primary">Return to Portal</a>
      </div>
    `;
  }

  // Show error message
  showError(message) {
    console.error(message);
    const app = DOM.$('#app');
    if (!app) return;

    const errorEl = DOM.create('div', {
      class: 'error-banner'
    }, message);

    app.insertBefore(errorEl, app.firstChild);

    setTimeout(() => errorEl.remove(), 5000);
  }

  // Handle errors
  handleError(error) {
    this.showError('An error occurred. Please refresh the page.');
  }

  // Setup global event listeners
  setupEventListeners() {
    // Handle window resize
    const handleResize = DOM.debounce(() => {
      DOM.trigger(document, 'appResize', {
        width: window.innerWidth,
        height: window.innerHeight
      });
    }, 250);

    window.addEventListener('resize', handleResize);

    // Handle visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        console.log('App hidden');
      } else {
        console.log('App visible');
      }
    });

    // Handle online/offline
    window.addEventListener('online', () => {
      console.log('🟢 Back online');
    });

    window.addEventListener('offline', () => {
      console.log('🔴 Gone offline');
    });
  }

  // Get app state
  getState() {
    return {
      initialized: this.initialized,
      loading: this.loading,
      visitedPlanets: Array.from(this.visitedPlanets),
      achievements: Array.from(this.achievements),
      currentTheme: themeSwitcher.getTheme()
    };
  }
}

// Create app instance
const app = new DevVerseApp();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  app.init();
});


// Export for global access
window.DevVerse = app;

export default app;