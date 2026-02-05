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

// Initialize Logic
document.addEventListener('DOMContentLoaded', () => {
    initializeSnow();
    handleScrollTop();
});
