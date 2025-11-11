// Starfield Background Component
import CONFIG from '../config.js';
import DOM from '../utils/dom.js';

class Starfield {
  constructor(container) {
    this.container = container;
    this.canvas = null;
    this.ctx = null;
    this.stars = [];
    this.animationId = null;
    this.mouse = { x: 0, y: 0 };
    
    this.init();
  }

  init() {
    this.createCanvas();
    this.generateStars();
    this.bindEvents();
    this.animate();
  }

  createCanvas() {
    this.canvas = DOM.create('canvas', {
      class: 'starfield-canvas',
      style: 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1;'
    });
    
    this.container.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    
    this.resize();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.generateStars();
  }

  generateStars() {
    this.stars = [];
    const count = CONFIG.STARFIELD.stars;
    
    for (let i = 0; i < count; i++) {
      this.stars.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        z: Math.random() * CONFIG.STARFIELD.maxDepth,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.5 + 0.2,
        opacity: Math.random() * 0.8 + 0.2
      });
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => this.resize());
    
    // Mouse move for parallax effect
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = (e.clientX - this.canvas.width / 2) / this.canvas.width;
      this.mouse.y = (e.clientY - this.canvas.height / 2) / this.canvas.height;
    });
  }

  animate() {
    this.ctx.fillStyle = 'rgba(10, 14, 39, 0.1)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.stars.forEach(star => {
      // Move star based on depth
      star.z -= star.speed * CONFIG.STARFIELD.speed;
      
      // Reset star if it goes too far
      if (star.z <= 0) {
        star.x = Math.random() * this.canvas.width;
        star.y = Math.random() * this.canvas.height;
        star.z = CONFIG.STARFIELD.maxDepth;
      }

      // Calculate position with parallax
      const x = star.x + this.mouse.x * star.z * 0.1;
      const y = star.y + this.mouse.y * star.z * 0.1;
      
      // Calculate size and opacity based on depth
      const size = star.size * (1 - star.z / CONFIG.STARFIELD.maxDepth);
      const opacity = star.opacity * (1 - star.z / CONFIG.STARFIELD.maxDepth);

      // Draw star
      this.ctx.beginPath();
      this.ctx.arc(x, y, size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      this.ctx.fill();

      // Draw star glow for larger stars
      if (size > 1.5) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, size * 2, 0, Math.PI * 2);
        const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, size * 2);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity * 0.3})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
      }
    });

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.canvas) {
      this.canvas.remove();
    }
  }
}

export default Starfield;