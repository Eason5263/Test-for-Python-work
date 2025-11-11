// Theme Switcher Component
import CONFIG from '../config.js';
import storage from '../utils/storage.js';
import DOM from '../utils/dom.js';

class ThemeSwitcher {
  constructor() {
    this.currentTheme = this.loadTheme();
    this.themes = CONFIG.THEMES;
    this.element = null;
    
    // Apply theme on init
    this.applyTheme(this.currentTheme);
  }

  // Load theme from storage
  loadTheme() {
    const saved = storage.get(CONFIG.STORAGE_KEYS.theme);
    return saved || CONFIG.DEFAULT_THEME;
  }

  // Save theme to storage
  saveTheme(theme) {
    storage.set(CONFIG.STORAGE_KEYS.theme, theme);
  }

  // Apply theme
  applyTheme(theme) {
    if (!this.themes.includes(theme)) {
      console.warn(`Theme "${theme}" not found, using default`);
      theme = CONFIG.DEFAULT_THEME;
    }

    // Remove all theme classes
    this.themes.forEach(t => {
      document.body.classList.remove(`theme-${t}`);
    });

    // Add new theme class
    document.body.classList.add(`theme-${theme}`);
    document.body.setAttribute('data-theme', theme);

    this.currentTheme = theme;
    this.saveTheme(theme);

    // Dispatch theme change event
    DOM.trigger(document, 'themechange', { theme });
  }

  // Switch to next theme
  nextTheme() {
    const currentIndex = this.themes.indexOf(this.currentTheme);
    const nextIndex = (currentIndex + 1) % this.themes.length;
    const nextTheme = this.themes[nextIndex];
    
    this.applyTheme(nextTheme);
    
    return nextTheme;
  }

  // Switch to specific theme
  setTheme(theme) {
    this.applyTheme(theme);
  }

  // Get current theme
  getTheme() {
    return this.currentTheme;
  }

  // Create theme switcher UI
  create() {
    const container = DOM.create('div', {
      class: 'theme-switcher',
      'aria-label': 'Theme Switcher'
    });

    this.themes.forEach(theme => {
      const button = DOM.create('button', {
        class: `theme-btn ${theme === this.currentTheme ? 'active' : ''}`,
        'data-theme': theme,
        'aria-label': `Switch to ${theme} theme`,
        title: theme.charAt(0).toUpperCase() + theme.slice(1)
      }, this.getThemeIcon(theme));

      button.addEventListener('click', () => {
        this.setTheme(theme);
        this.updateActiveButton(container, theme);
      });

      container.appendChild(button);
    });

    this.element = container;
    return container;
  }

  // Update active button state
  updateActiveButton(container, activeTheme) {
    const buttons = container.querySelectorAll('.theme-btn');
    buttons.forEach(btn => {
      if (btn.dataset.theme === activeTheme) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // Get icon for theme
  getThemeIcon(theme) {
    const icons = {
      'sci-fi': '🚀',
      'fantasy': '🔮',
      'cyberpunk': '⚡'
    };
    
    return icons[theme] || '🎨';
  }

  // Get theme colors
  getThemeColors(theme) {
    const colors = {
      'sci-fi': {
        primary: '#00D9FF',
        secondary: '#FF00E5',
        accent: '#7B2FFF'
      },
      'fantasy': {
        primary: '#FFD700',
        secondary: '#9B30FF',
        accent: '#FF1493'
      },
      'cyberpunk': {
        primary: '#00FF00',
        secondary: '#FF00FF',
        accent: '#FFFF00'
      }
    };
    
    return colors[theme] || colors['sci-fi'];
  }

  // Destroy component
  destroy() {
    if (this.element) {
      this.element.remove();
      this.element = null;
    }
  }
}

// Create singleton instance
const themeSwitcher = new ThemeSwitcher();

export default themeSwitcher;