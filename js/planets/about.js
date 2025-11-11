// About Planet - Interactive Animations
// Handles scroll effects and content animations

class AboutPlanet {
    constructor() {
        this.content = document.querySelector('.content');
        this.sections = document.querySelectorAll('.section');
        this.init();
    }

    init() {
        console.log('🌌 About planet initialized');
        this.setupScrollEffects();
        this.animateSections();
    }

    // Setup parallax scroll effect for content
    setupScrollEffects() {
        window.addEventListener('scroll', () => {
            if (!this.content) return;
            
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.3; // Parallax speed factor
            
            this.content.style.transform = `translateY(${rate}px)`;
        });
    }

    // Animate sections with staggered fade-in
    animateSections() {
        this.sections.forEach((section, index) => {
            // Stagger animation delays
            setTimeout(() => {
                section.classList.add('fade-in');
            }, index * 200); // 200ms delay between sections
        });
    }

    // TODO: Add timeline interaction logic
    // Future enhancements:
    // - Timeline item hover effects
    // - Click to expand timeline details
    // - Animated progress indicators
}

// Initialize when DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new AboutPlanet();
    });
} else {
    new AboutPlanet();
}