// Projects Planet - Interactive Features
// Handles project card animations and filtering

class ProjectsPlanet {
    constructor() {
        this.projectCards = document.querySelectorAll('.project-card');
        this.filterControls = []; // TODO: Initialize filter controls later
        this.init();
    }

    init() {
        console.log('🚀 Projects planet initialized');
        this.setupHoverEffects();
        this.prepareFilterSystem();
    }

    // Add hover enlarge effect to project cards
    setupHoverEffects() {
        this.projectCards.forEach(card => {
            // Ensure proper initial positioning
            card.style.transition = 'all 0.3s ease';
            card.style.position = 'relative';
            
            card.addEventListener('mouseenter', () => {
                card.classList.add('project-hover');
                card.style.transform = 'scale(1.05) translateY(-5px)';
                card.style.zIndex = '10';
                card.style.boxShadow = '0 10px 30px rgba(76, 201, 240, 0.3)';
            });

            card.addEventListener('mouseleave', () => {
                card.classList.remove('project-hover');
                card.style.transform = 'scale(1) translateY(0)';
                card.style.zIndex = '1';
                card.style.boxShadow = '';
            });
        });
    }

    // Prepare filter system for future implementation
    prepareFilterSystem() {
        console.log('🔧 Filter system prepared for future implementation');
    }

    // Future method to filter projects
    filterProjects() {
        console.log('🎛️ Filter projects method ready for implementation');
    }
}

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProjectsPlanet();
});