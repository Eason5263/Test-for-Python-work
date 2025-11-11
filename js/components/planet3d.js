// 3D Planet Component using Three.js
import CONFIG from '../config.js';
import DOM from '../utils/dom.js';

class Planet3D {
  constructor(container, planetConfig) {
    this.container = container;
    this.config = planetConfig;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.planet = null;
    this.animationId = null;
    
    this.init();
  }

  init() {
    this.createScene();
    this.createPlanet();
    this.animate();
    this.bindEvents();
  }

  createScene() {
    // Scene
    this.scene = new THREE.Scene();
    
    // Camera
    this.camera = new THREE.PerspectiveCamera(
      45,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.z = 5;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true 
    });
    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    );
    this.renderer.setClearColor(0x000000, 0);
    
    this.container.appendChild(this.renderer.domElement);
  }

  createPlanet() {
    // Planet geometry
    const geometry = new THREE.SphereGeometry(
      this.config.size,
      32,
      32
    );

    // Planet material with color
    const material = new THREE.MeshPhongMaterial({
      color: this.config.color,
      shininess: 30,
      transparent: true,
      opacity: 0.9
    });

    // Create planet mesh
    this.planet = new THREE.Mesh(geometry, material);
    this.scene.add(this.planet);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 3, 5);
    this.scene.add(directionalLight);

    // Add glow effect
    this.addGlowEffect();
  }

  addGlowEffect() {
    // Create a slightly larger sphere for glow
    const glowGeometry = new THREE.SphereGeometry(
      this.config.size * 1.1,
      32,
      32
    );
    
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: this.config.color,
      transparent: true,
      opacity: 0.3,
      side: THREE.BackSide
    });

    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    this.planet.add(glow);
  }

  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());

    // Rotate planet
    if (this.planet) {
      this.planet.rotation.y += this.config.rotationSpeed;
      this.planet.rotation.x += this.config.rotationSpeed * 0.5;
    }

    this.renderer.render(this.scene, this.camera);
  }

  bindEvents() {
    // Handle window resize
    window.addEventListener('resize', () => this.onResize());
    
    // Mouse interaction for rotation
    let mouseX = 0;
    let mouseY = 0;
    
    this.container.addEventListener('mousemove', (e) => {
      const rect = this.container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / this.container.clientWidth) * 2 - 1;
      mouseY = -((e.clientY - rect.top) / this.container.clientHeight) * 2 + 1;
    });

    // Smooth rotation towards mouse
    const smoothRotate = () => {
      if (this.planet) {
        this.planet.rotation.y += (mouseX * 0.01 - this.planet.rotation.y) * 0.05;
        this.planet.rotation.x += (mouseY * 0.01 - this.planet.rotation.x) * 0.05;
      }
      requestAnimationFrame(smoothRotate);
    };
    smoothRotate();
  }

  onResize() {
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    );
  }

  // Public methods
  setColor(color) {
    if (this.planet && this.planet.material) {
      this.planet.material.color.set(color);
    }
  }

  setSize(size) {
    if (this.planet) {
      this.planet.scale.set(size, size, size);
    }
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.domElement.remove();
    }
  }
}

export default Planet3D;