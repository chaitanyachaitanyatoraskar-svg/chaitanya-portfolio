/**
 * Global Portfolio Logic
 */

// 1. Snowfall Effect
function initializeSnow() {
    const snowContainer = document.getElementById('snow-container');
    if (!snowContainer) return;

    const FLAKE_COUNT = 85; 

    for (let i = 0; i < FLAKE_COUNT; i++) {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        
        // Randomize size, position, speed, delay, and opacity
        const size = Math.random() * 3 + 2 + 'px';
        snowflake.style.width = size;
        snowflake.style.height = size;
        snowflake.style.left = Math.random() * 100 + 'vw';
        snowflake.style.animationDuration = Math.random() * 5 + 5 + 's';
        snowflake.style.animationDelay = Math.random() * 10 + 's';
        snowflake.style.opacity = Math.random() * 0.7 + 0.2;

        snowContainer.appendChild(snowflake);
    }
}

// 2. Scroll To Top Logic
function handleScrollTop() {
    const scrollBtn = document.getElementById('scrollTopBtn');
    
    // Show button when scrolled down 500px
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollBtn.classList.add('active');
        } else {
            scrollBtn.classList.remove('active');
        }
    });

    // Smooth scroll to top on click
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// 3. Setup WebGL Shader Background
function initWebGLShader() {
    const canvas = document.getElementById('webgl-shader-canvas');
    if (!canvas || !window.THREE) return;

    let scene, camera, renderer, mesh, uniforms, animationId;

    const vertexShader = `
      attribute vec3 position;
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      precision highp float;
      uniform vec2 resolution;
      uniform float time;
      uniform float xScale;
      uniform float yScale;
      uniform float distortion;

      void main() {
        vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
        
        float d = length(p) * distortion;
        
        float rx = p.x * (1.0 + d);
        float gx = p.x;
        float bx = p.x * (1.0 - d);

        float r = 0.05 / abs(p.y + sin((rx + time) * xScale) * yScale);
        float g = 0.05 / abs(p.y + sin((gx + time) * xScale) * yScale);
        float b = 0.05 / abs(p.y + sin((bx + time) * xScale) * yScale);
        
        gl_FragColor = vec4(r, g, b, 1.0);
      }
    `;

    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(new THREE.Color(0x000000));

    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, -1);

    uniforms = {
      resolution: { value: [window.innerWidth, window.innerHeight] },
      time: { value: 0.0 },
      xScale: { value: 1.0 },
      yScale: { value: 0.5 },
      distortion: { value: 0.05 },
    };

    const position = [
      -1.0, -1.0, 0.0,
       1.0, -1.0, 0.0,
      -1.0,  1.0, 0.0,
       1.0, -1.0, 0.0,
      -1.0,  1.0, 0.0,
       1.0,  1.0, 0.0,
    ];

    const positions = new THREE.BufferAttribute(new Float32Array(position), 3);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", positions);

    const material = new THREE.RawShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: uniforms,
      side: THREE.DoubleSide,
    });

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height, false);
      uniforms.resolution.value = [width, height];
    };

    const animate = () => {
      if (uniforms) uniforms.time.value += 0.01;
      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }
      animationId = requestAnimationFrame(animate);
    };

    handleResize();
    animate();
    window.addEventListener("resize", handleResize);
}

// 4. Infinite Grid Logic
function initInfiniteGrid() {
    const container = document.getElementById('infinite-grid-container');
    const maskLayer = document.getElementById('grid-mask-layer');
    const patternBase = document.getElementById('grid-pattern-base');
    const patternActive = document.getElementById('grid-pattern-active');
    
    if (!container || !maskLayer || !patternBase || !patternActive) return;

    let mouseX = 0;
    let mouseY = 0;
    let gridOffsetX = 0;
    let gridOffsetY = 0;

    const speedX = 0.5;
    const speedY = 0.5;

    // Track mouse
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        maskLayer.style.maskImage = `radial-gradient(300px circle at ${mouseX}px ${mouseY}px, black, transparent)`;
        maskLayer.style.webkitMaskImage = `radial-gradient(300px circle at ${mouseX}px ${mouseY}px, black, transparent)`;
    });

    // Animate grid
    function animateGrid() {
        gridOffsetX = (gridOffsetX + speedX) % 40;
        gridOffsetY = (gridOffsetY + speedY) % 40;
        
        patternBase.setAttribute('x', gridOffsetX);
        patternBase.setAttribute('y', gridOffsetY);
        
        patternActive.setAttribute('x', gridOffsetX);
        patternActive.setAttribute('y', gridOffsetY);
        
        requestAnimationFrame(animateGrid);
    }
    
    animateGrid();
}

// 5. Text Scramble Logic
function initTextScramble() {
    const container = document.getElementById('name-scramble-container');
    if (!container) return;

    const parts = container.querySelectorAll('.scramble-part');
    const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*";

    let intervalId = null;
    let isScrambling = false;

    function scramble() {
        if (isScrambling) return;
        isScrambling = true;

        let frame = 0;
        let maxLen = 0;
        parts.forEach(p => Math.max(maxLen, p.getAttribute('data-text').length));
        
        // Use average length based scale
        const duration = 25; // number of frames

        if (intervalId) clearInterval(intervalId);

        intervalId = setInterval(() => {
            frame++;
            const progress = frame / duration;

            parts.forEach(part => {
                const text = part.getAttribute('data-text');
                const revealedLength = Math.floor(progress * text.length);

                const newText = text.split('').map((char, i) => {
                    if (char === " ") return " ";
                    if (i < revealedLength) return text[i];
                    return CHARS[Math.floor(Math.random() * CHARS.length)];
                }).join('');

                part.textContent = newText;
            });

            if (frame >= duration) {
                clearInterval(intervalId);
                parts.forEach(part => {
                    part.textContent = part.getAttribute('data-text');
                });
                isScrambling = false;
            }
        }, 30);
    }

    container.addEventListener('mouseenter', scramble);
}

// Initialize Logic
document.addEventListener('DOMContentLoaded', () => {
    initializeSnow();
    handleScrollTop();
    initWebGLShader();
    initInfiniteGrid();
    initTextScramble();
});