// Blog Planet - Markdown Post Loader
// Fetches and renders markdown posts using Marked.js

class BlogPlanet {
    constructor() {
        this.postsContainer = document.querySelector('.posts-list');
        this.posts = [
            'post1.md',
            'post2.md', 
            'post3.md',
            'post4.md'
        ];
        this.init();
    }

    init() {
        console.log('📝 Blog planet initialized');
        
        // Check if Marked.js is loaded
        if (typeof marked === 'undefined') {
            console.error('❌ Marked.js not loaded');
            this.showError('Marked.js library failed to load');
            return;
        }
        
        this.loadPosts();
    }

    // Load and render all markdown posts
    async loadPosts() {
        try {
            // Show loading state
            this.postsContainer.innerHTML = '<div class="loading pulse">Loading cosmic thoughts...</div>';
            
            let loadedAnyPosts = false;
            
            // Load each post sequentially
            for (const postFile of this.posts) {
                const success = await this.loadPost(postFile);
                if (success) loadedAnyPosts = true;
            }
            
            // If no posts loaded, show placeholder content
            if (!loadedAnyPosts) {
                this.showPlaceholderPosts();
            }
            
        } catch (error) {
            console.error('❌ Failed to load posts:', error);
            this.showError('Failed to load blog posts. Please try again later.');
        }
    }

    // Load individual markdown post
    async loadPost(filename) {
        try {
            const response = await fetch(`../blog/${filename}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const markdown = await response.text();
            const html = marked.parse(markdown);
            
            // Create post element and insert
            const postElement = document.createElement('article');
            postElement.className = 'post-card fade-in';
            postElement.innerHTML = html;
            
            this.postsContainer.appendChild(postElement);
            
            console.log(`✅ Loaded: ${filename}`);
            return true;
            
        } catch (error) {
            console.warn(`⚠️ Could not load ${filename}:`, error);
            return false;
        }
    }

    // Show placeholder posts when markdown files aren't available
    showPlaceholderPosts() {
        console.log('📋 Showing placeholder blog posts');
        this.postsContainer.innerHTML = `
            <article class="post-card fade-in">
                <div class="post-header">
                    <h2>Welcome to My Blog</h2>
                    <time datetime="2024-01-15">January 15, 2024</time>
                </div>
                <div class="post-excerpt">
                    Blog posts will be available soon. I'm currently working on some cosmic content!
                </div>
                <div class="post-tags">
                    <span class="tag">Coming Soon</span>
                </div>
            </article>
        `;
    }

    // Show error message
    showError(message) {
        this.postsContainer.innerHTML = `
            <div class="error-message">
                <p>${message}</p>
                <button onclick="location.reload()" class="retry-button">Retry</button>
            </div>
        `;
    }
}

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new BlogPlanet();
});