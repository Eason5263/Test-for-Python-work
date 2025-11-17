// Simple Starfield Animation for Homepage
// Creates a visible animated starfield background

(function() {
  'use strict';

  function createStarfield() {
    const container = document.querySelector('.stars-background');
    if (!container) return;

    // Create canvas element
    const canvas = document.createElement('canvas');
    canvas.className = 'starfield-canvas';
    canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
      pointer-events: none;
    `;
    
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    
    // Create stars array and configuration
    const stars = [];
    const starCount = 400; // Increased number of stars for dense starfield
    
    // Function to create a single star
    function createStar() {
      const rand = Math.random();
      let color;
      if (rand > 0.85) {
        color = 'rgba(0, 217, 255, 1)'; // Cyan
      } else if (rand > 0.70) {
        color = 'rgba(123, 47, 255, 1)'; // Purple
      } else if (rand > 0.55) {
        color = 'rgba(255, 0, 229, 1)'; // Pink
      } else {
        color = 'rgba(255, 255, 255, 1)'; // White
      }
      
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2.5 + 0.8, // Larger stars for better visibility
        speed: Math.random() * 0.6 + 0.2,
        opacity: Math.random() * 0.5 + 0.5, // Brighter stars
        color: color,
        twinkle: Math.random() * Math.PI * 2 // For twinkling effect
      };
    }
    
    // Set canvas size and initialize stars
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Regenerate stars after resize to fill new canvas size
      stars.length = 0;
      for (let i = 0; i < starCount; i++) {
        stars.push(createStar());
      }
    }
    
    // Initialize canvas and stars
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Animation loop
    let animationFrame = 0;
    function animate() {
      animationFrame++;
      
      // Clear canvas with semi-transparent black for trailing effect
      // Use a darker clear to make stars more visible
      ctx.fillStyle = 'rgba(10, 14, 39, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw and update stars
      stars.forEach((star, index) => {
        // Move star downward
        star.y += star.speed;
        
        // Reset star if it goes off screen
        if (star.y > canvas.height + 10) {
          star.y = -10;
          star.x = Math.random() * canvas.width;
        }

        // Twinkling effect
        const twinkleOpacity = star.opacity + Math.sin(animationFrame * 0.02 + star.twinkle) * 0.3;
        const currentOpacity = Math.max(0.2, Math.min(1, twinkleOpacity));

        // Draw star glow for larger/brighter stars
        if (star.radius > 1.2) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius * 3, 0, Math.PI * 2);
          const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.radius * 3);
          const glowColor = star.color.replace('1)', (currentOpacity * 0.2).toFixed(2) + ')');
          gradient.addColorStop(0, glowColor);
          gradient.addColorStop(1, 'transparent');
          ctx.fillStyle = gradient;
          ctx.fill();
        }

        // Draw star
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        const starColor = star.color.replace('1)', currentOpacity.toFixed(2) + ')');
        ctx.fillStyle = starColor;
        ctx.fill();

        // Add bright center for larger stars
        if (star.radius > 1.5) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = star.color.replace('1)', '1)');
          ctx.fill();
        }
      });

      requestAnimationFrame(animate);
    }

    // Start animation
    animate();
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createStarfield);
  } else {
    createStarfield();
  }
})();

