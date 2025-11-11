// Skills Planet - Progress Bar Animations
// Handles skill bar progress animations on page load

class SkillsPlanet {
    constructor() {
        this.skillBars = document.querySelectorAll('.skill-progress');
        this.init();
    }

    init() {
        console.log('⚡ Skills planet initialized');
        this.animateSkillBars();
    }

    // Animate skill bars to their target progress values
    animateSkillBars() {
        this.skillBars.forEach(bar => {
            const progress = bar.getAttribute('data-progress');
            const targetWidth = `${progress}%`;
            
            // Set initial state
            bar.style.width = '0%';
            bar.style.opacity = '1';
            
            // Animate to target width
            setTimeout(() => {
                bar.style.transition = 'width 1.5s ease-in-out';
                bar.style.width = targetWidth;
            }, 100);
        });
    }
}

// Initialize when DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new SkillsPlanet();
    });
} else {
    new SkillsPlanet();
}