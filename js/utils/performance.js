// DevVerse - Performance Optimization Utilities
// Handles lazy loading, intersection observers, and performance monitoring

class PerformanceOptimizer {
    constructor() {
        this.observers = new Map();
        this.init();
    }

    init() {
        console.log('⚡ Performance optimizer initialized');
        this.setupLazyLoading();
        this.setupIntersectionObservers();
        this.monitorPerformance();
    }

    // Lazy load images and iframes
    setupLazyLoading() {
        const lazyImages = document.querySelectorAll('img[data-src], [data-bg]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    
                    if (element.dataset.src) {
                        element.src = element.dataset.src;
                        element.removeAttribute('data-src');
                    }
                    
                    if (element.dataset.bg) {
                        element.style.backgroundImage = `url(${element.dataset.bg})`;
                        element.removeAttribute('data-bg');
                    }
                    
                    element.classList.add('fade-in');
                    imageObserver.unobserve(element);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // Setup intersection observers for animations
    setupIntersectionObservers() {
        // Observe elements for animation triggers
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    animationObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });

        // Observe elements that should animate when visible
        const animateElements = document.querySelectorAll('[data-animate]');
        animateElements.forEach(el => animationObserver.observe(el));
    }

    // Monitor and log performance metrics
    monitorPerformance() {
        if ('performance' in window) {
            // Monitor long tasks
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.duration > 50) {
                        console.warn(`⚠️ Long task detected: ${entry.duration}ms`);
                    }
                }
            });
            
            observer.observe({ entryTypes: ['longtask'] });

            // Log core web vitals
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const navTiming = performance.getEntriesByType('navigation')[0];
                    if (navTiming) {
                        console.log('📊 Performance Metrics:', {
                            'DOM Content Loaded': `${navTiming.domContentLoadedEventEnd - navTiming.navigationStart}ms`,
                            'Full Load': `${navTiming.loadEventEnd - navTiming.navigationStart}ms`,
                            'First Paint': performance.getEntriesByName('first-paint')[0]?.startTime || 'N/A'
                        });
                    }
                }, 0);
            });
        }
    }

    // Debounce function for expensive operations
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Throttle function for scroll/resize events
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Cleanup method
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
    }
}

// Initialize performance optimizer
document.addEventListener('DOMContentLoaded', () => {
    window.PerformanceOptimizer = new PerformanceOptimizer();
});