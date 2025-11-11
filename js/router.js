// SPA Router using History API
import DOM from './utils/dom.js';
import CONFIG from './config.js';

class Router {
  constructor() {
    this.routes = new Map();
    this.currentRoute = null;
    this.beforeHooks = [];
    this.afterHooks = [];
    this.notFoundHandler = null;
    
    // Bind methods
    this.handlePopState = this.handlePopState.bind(this);
    this.handleLinkClick = this.handleLinkClick.bind(this);
    
    // Initialize
    this.init();
  }

  init() {
    // Listen to browser back/forward
    window.addEventListener('popstate', this.handlePopState);
    
    // Intercept link clicks
    document.addEventListener('click', this.handleLinkClick);
    
    // Handle initial route
    this.navigate(window.location.pathname, { replace: true });
  }

  // Register a route
  register(path, handler) {
    this.routes.set(path, handler);
    return this;
  }

  // Register multiple routes
  registerRoutes(routesObj) {
    Object.entries(routesObj).forEach(([path, handler]) => {
      this.register(path, handler);
    });
    return this;
  }

  // Set 404 handler
  setNotFound(handler) {
    this.notFoundHandler = handler;
    return this;
  }

  // Add before navigation hook
  beforeEach(hook) {
    this.beforeHooks.push(hook);
    return this;
  }

  // Add after navigation hook
  afterEach(hook) {
    this.afterHooks.push(hook);
    return this;
  }

  // Navigate to a path
  async navigate(path, options = {}) {
    const { replace = false, state = {} } = options;
    
    // Normalize path
    path = this.normalizePath(path);
    
    // Run before hooks
    for (const hook of this.beforeHooks) {
      const result = await hook(path, this.currentRoute);
      if (result === false) return; // Cancel navigation
    }
    
    // Find matching route
    const route = this.matchRoute(path);
    
    if (!route && this.notFoundHandler) {
      await this.notFoundHandler(path);
    } else if (route) {
      // Update history
      const method = replace ? 'replaceState' : 'pushState';
      window.history[method](state, '', path);
      
      // Execute route handler
      await this.executeRoute(route, path);
    }
    
    // Update current route
    this.currentRoute = path;
    
    // Run after hooks
    for (const hook of this.afterHooks) {
      await hook(path);
    }
    
    // Scroll to top
    window.scrollTo(0, 0);
  }

  // Match route with path
  matchRoute(path) {
    // Exact match first
    if (this.routes.has(path)) {
      return { handler: this.routes.get(path), params: {} };
    }
    
    // Try pattern matching
    for (const [routePath, handler] of this.routes) {
      const params = this.matchPattern(routePath, path);
      if (params) {
        return { handler, params };
      }
    }
    
    return null;
  }

  // Match path pattern (supports :param syntax)
  matchPattern(pattern, path) {
    const patternParts = pattern.split('/').filter(Boolean);
    const pathParts = path.split('/').filter(Boolean);
    
    if (patternParts.length !== pathParts.length) {
      return null;
    }
    
    const params = {};
    
    for (let i = 0; i < patternParts.length; i++) {
      const patternPart = patternParts[i];
      const pathPart = pathParts[i];
      
      if (patternPart.startsWith(':')) {
        // Dynamic segment
        params[patternPart.slice(1)] = pathPart;
      } else if (patternPart !== pathPart) {
        // Mismatch
        return null;
      }
    }
    
    return params;
  }

  // Execute route handler
  async executeRoute(route, path) {
    try {
      await route.handler(route.params, path);
    } catch (error) {
      console.error('Route handler error:', error);
    }
  }

  // Handle browser back/forward
  handlePopState(e) {
    this.navigate(window.location.pathname, { replace: true });
  }

  // Intercept link clicks
  handleLinkClick(e) {
    // Check if it's a navigation link
    const link = e.target.closest('a[data-link]');
    
    if (!link) return;
    
    // Prevent default navigation
    e.preventDefault();
    
    // Get href
    const href = link.getAttribute('href');
    
    if (href && href !== '#') {
      this.navigate(href);
    }
  }

  // Normalize path
  normalizePath(path) {
    // Remove trailing slash except for root
    if (path !== '/' && path.endsWith('/')) {
      path = path.slice(0, -1);
    }
    
    // Ensure leading slash
    if (!path.startsWith('/')) {
      path = '/' + path;
    }
    
    return path;
  }

  // Get current path
  getCurrentPath() {
    return window.location.pathname;
  }

  // Get query parameters
  getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    
    for (const [key, value] of params) {
      result[key] = value;
    }
    
    return result;
  }

  // Go back
  back() {
    window.history.back();
  }

  // Go forward
  forward() {
    window.history.forward();
  }

  // Destroy router
  destroy() {
    window.removeEventListener('popstate', this.handlePopState);
    document.removeEventListener('click', this.handleLinkClick);
  }
}

// Create singleton instance
const router = new Router();

export default router;