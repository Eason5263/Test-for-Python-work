// DevVerse Configuration
const CONFIG = {
  // App Info
  APP_NAME: 'DevVerse',
  VERSION: '1.0.0',
  AUTHOR: 'Your Name',
  
  // Routing
  BASE_PATH: '/',
  DEFAULT_THEME: 'sci-fi',
  
  // Themes Available
  THEMES: ['sci-fi', 'fantasy', 'cyberpunk'],
  
  // Planets Configuration
  PLANETS: {
    about: {
      name: 'About Me',
      color: '#4A90E2',
      size: 1.2,
      orbitSpeed: 0.5,
      rotationSpeed: 0.02,
      position: { x: -3, y: 1, z: 0 }
    },
    projects: {
      name: 'Projects',
      color: '#E24A4A',
      size: 1.5,
      orbitSpeed: 0.3,
      rotationSpeed: 0.015,
      position: { x: 3, y: -1, z: 0 }
    },
    skills: {
      name: 'Skills',
      color: '#4AE290',
      size: 1.0,
      orbitSpeed: 0.7,
      rotationSpeed: 0.025,
      position: { x: 0, y: 2.5, z: -2 }
    },
    blog: {
      name: 'Blog',
      color: '#E2D44A',
      size: 1.1,
      orbitSpeed: 0.4,
      rotationSpeed: 0.018,
      position: { x: -2.5, y: -2, z: 1 }
    },
    contact: {
      name: 'Contact',
      color: '#9B4AE2',
      size: 1.3,
      orbitSpeed: 0.6,
      rotationSpeed: 0.022,
      position: { x: 2.5, y: 1.5, z: 1 }
    }
  },
  
  // Starfield Configuration
  STARFIELD: {
    stars: 800,
    speed: 0.5,
    maxDepth: 2000,
    fov: 100
  },
  
  // Animation Durations (ms)
  ANIMATION: {
    pageTransition: 800,
    modalFade: 300,
    hoverScale: 200,
    scrollReveal: 600
  },
  
  // LocalStorage Keys
  STORAGE_KEYS: {
    theme: 'devverse_theme',
    achievements: 'devverse_achievements',
    visited: 'devverse_visited',
    blogComments: 'devverse_blog_comments',
    userPrefs: 'devverse_user_prefs'
  },
  
  // API Endpoints (if needed)
  API: {
    github: 'https://api.github.com/users/',
    // Add more as needed
  },
  
  // Achievements System
  ACHIEVEMENTS: {
    firstVisit: { id: 'first_visit', name: 'Explorer', desc: 'Visited DevVerse for the first time' },
    allPlanets: { id: 'all_planets', name: 'Cartographer', desc: 'Visited all planets' },
    themeSwitch: { id: 'theme_switch', name: 'Fashionista', desc: 'Changed themes' },
    easterEgg: { id: 'easter_egg', name: 'Detective', desc: 'Found a hidden secret' },
    blogReader: { id: 'blog_reader', name: 'Scholar', desc: 'Read 5 blog posts' },
    commented: { id: 'commented', name: 'Contributor', desc: 'Left a comment' }
  }
};

// Freeze config to prevent modifications
Object.freeze(CONFIG);

export default CONFIG;