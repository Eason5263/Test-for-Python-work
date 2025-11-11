// DOM manipulation utilities
const DOM = {
  // Query selectors with error handling
  $(selector, parent = document) {
    return parent.querySelector(selector);
  },

  $$(selector, parent = document) {
    return Array.from(parent.querySelectorAll(selector));
  },

  // Create element with attributes and children
  create(tag, attrs = {}, ...children) {
    const el = document.createElement(tag);
    
    // Set attributes
    Object.entries(attrs).forEach(([key, value]) => {
      if (key === 'class') {
        el.className = value;
      } else if (key === 'dataset') {
        Object.entries(value).forEach(([dataKey, dataValue]) => {
          el.dataset[dataKey] = dataValue;
        });
      } else if (key.startsWith('on') && typeof value === 'function') {
        el.addEventListener(key.slice(2).toLowerCase(), value);
      } else {
        el.setAttribute(key, value);
      }
    });
    
    // Append children
    children.forEach(child => {
      if (typeof child === 'string') {
        el.appendChild(document.createTextNode(child));
      } else if (child instanceof Node) {
        el.appendChild(child);
      }
    });
    
    return el;
  },

  // Add class(es)
  addClass(el, ...classes) {
    if (!el) return;
    el.classList.add(...classes);
  },

  // Remove class(es)
  removeClass(el, ...classes) {
    if (!el) return;
    el.classList.remove(...classes);
  },

  // Toggle class
  toggleClass(el, className) {
    if (!el) return;
    el.classList.toggle(className);
  },

  // Has class
  hasClass(el, className) {
    return el?.classList.contains(className) || false;
  },

  // Show element
  show(el, display = 'block') {
    if (!el) return;
    el.style.display = display;
  },

  // Hide element
  hide(el) {
    if (!el) return;
    el.style.display = 'none';
  },

  // Toggle visibility
  toggle(el, display = 'block') {
    if (!el) return;
    el.style.display = el.style.display === 'none' ? display : 'none';
  },

  // Remove element
  remove(el) {
    if (!el) return;
    el.remove();
  },

  // Empty element
  empty(el) {
    if (!el) return;
    while (el.firstChild) {
      el.removeChild(el.firstChild);
    }
  },

  // Set/get attributes
  attr(el, name, value) {
    if (!el) return null;
    if (value === undefined) {
      return el.getAttribute(name);
    }
    el.setAttribute(name, value);
  },

  // Remove attribute
  removeAttr(el, name) {
    if (!el) return;
    el.removeAttribute(name);
  },

  // Set/get data attributes
  data(el, key, value) {
    if (!el) return null;
    if (value === undefined) {
      return el.dataset[key];
    }
    el.dataset[key] = value;
  },

  // Get/set text content
  text(el, content) {
    if (!el) return '';
    if (content === undefined) {
      return el.textContent;
    }
    el.textContent = content;
  },

  // Get/set HTML content
  html(el, content) {
    if (!el) return '';
    if (content === undefined) {
      return el.innerHTML;
    }
    el.innerHTML = content;
  },

  // Insert HTML
  insertHTML(el, position, html) {
    if (!el) return;
    el.insertAdjacentHTML(position, html);
  },

  // Get element position
  position(el) {
    if (!el) return { top: 0, left: 0 };
    const rect = el.getBoundingClientRect();
    return {
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
      width: rect.width,
      height: rect.height
    };
  },

  // Scroll to element
  scrollTo(el, options = {}) {
    if (!el) return;
    el.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      ...options
    });
  },

  // Add event listener with delegation
  on(el, event, selector, handler) {
    if (!el) return;
    
    // If no selector (no delegation)
    if (typeof selector === 'function') {
      handler = selector;
      el.addEventListener(event, handler);
      return;
    }
    
    // Event delegation
    el.addEventListener(event, (e) => {
      const target = e.target.closest(selector);
      if (target) {
        handler.call(target, e);
      }
    });
  },

  // Remove event listener
  off(el, event, handler) {
    if (!el) return;
    el.removeEventListener(event, handler);
  },

  // Trigger custom event
  trigger(el, eventName, detail = {}) {
    if (!el) return;
    const event = new CustomEvent(eventName, { detail, bubbles: true });
    el.dispatchEvent(event);
  },

  // Check if element is in viewport
  isInViewport(el) {
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },

  // Debounce function
  debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Throttle function
  throttle(func, limit = 300) {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Wait for element to exist
  waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
      const el = this.$(selector);
      if (el) {
        resolve(el);
        return;
      }

      const observer = new MutationObserver(() => {
        const el = this.$(selector);
        if (el) {
          observer.disconnect();
          resolve(el);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      setTimeout(() => {
        observer.disconnect();
        reject(new Error(`Element ${selector} not found within ${timeout}ms`));
      }, timeout);
    });
  }
};

export default DOM;