/* ==========================================================================
   CHAITANYA TORASKAR — PORTFOLIO INTERACTIONS
   Interactive Anime Avatar, Star Shower Cascade, Filter Pills & Capsule Nav
   ========================================================================== */

// Force browser to disable automatic scroll restoration so reload ALWAYS starts at top
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

// Reset scroll instantly to (0, 0)
window.scrollTo(0, 0);
document.documentElement.scrollTop = 0;
document.body.scrollTop = 0;

// Strip hash from address bar on page load/reload so browser doesn't anchor-jump
if (window.location.hash) {
    history.replaceState(null, document.title, window.location.pathname + window.location.search);
}

// Reset scroll to top before unloading so next reload is guaranteed clean
window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0);
});

document.addEventListener("DOMContentLoaded", () => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    forceFreshFavicon();
    initMultilingualPreloader();
    initHighlightsCarousel();
    initStarRainButton();
    initInteractiveAvatar();
    initCliBadge();
    initProjectFilters();
    initCapsuleScrollSpy();
    initSmoothAnchorLinks();
});

/* ==========================================================================
   0. Multilingual Preloader & Reload Entrance (Exact abhijithjinnu.in Component)
   ========================================================================== */
function initMultilingualPreloader() {
    const loadingScreen = document.getElementById("loadingScreen");
    const loadingText = document.getElementById("loadingScreenText");

    // Lock scroll to top
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    if (!loadingScreen || !loadingText) {
        document.body.classList.add("loading-done");
        initBlurredStagger();
        return;
    }

    const greetings = [
        { text: "Hello.", lang: "en" },
        { text: "നമസ്കാരം.", lang: "ml" },
        { text: "नमस्ते.", lang: "hi" },
        { text: "नमस्कार.", lang: "mr" },
        { text: "hola!", lang: "es" }
    ];

    let currentIndex = 0;

    function showNextGreeting() {
        if (currentIndex < greetings.length - 1) {
            currentIndex++;
            const g = greetings[currentIndex];
            loadingText.textContent = g.text;
            loadingText.className = "loading-screen__text loading-screen__text--" + g.lang;
            setTimeout(showNextGreeting, 200);
        } else {
            // Stay on "hola!" for 380ms, then trigger exit slide
            setTimeout(finishLoading, 380);
        }
    }

    function finishLoading() {
        // Guarantee top position right before reveal
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;

        // Trigger 4-column staggered exit slide
        loadingScreen.classList.add("loading-screen--exit");

        // Trigger page entrance animations
        document.body.classList.add("loading-done");

        // Subtitle starts staggering in right as the page reveals
        setTimeout(() => {
            initBlurredStagger();
        }, 250);

        // Remove loading screen from layout after slide completes
        setTimeout(() => {
            loadingScreen.style.display = "none";
        }, 1100);
    }

    // "Hello." stays for 650ms, then cycles through the other languages
    setTimeout(showNextGreeting, 650);
}

function forceFreshFavicon() {
    try {
        let link = document.querySelector("link[rel*='icon']");
        if (!link) {
            link = document.createElement("link");
            link.rel = "icon";
            document.head.appendChild(link);
        }
        link.type = "image/png";
        link.href = "icon.png?v=" + new Date().getTime();
    } catch (e) {}
}

/* ==========================================================================
   1. Star Shower Cascade (Triggered ONLY by clicking the top nav ☆ button)
   Rains 4-point Diamond Sparkle Stars in White & Coral matching reference
   ========================================================================== */
function initStarRainButton() {
    const starBtn = document.getElementById("starTriggerBtn");
    if (!starBtn) return;

    starBtn.addEventListener("click", (e) => {
        e.preventDefault();
        triggerStarShower();
    });
}

function triggerStarShower() {
    const container = document.getElementById("rainingStarsContainer");
    if (!container) return;

    const btn = document.getElementById("starTriggerBtn");
    if (btn) {
        btn.classList.add("pulsing");
        setTimeout(() => btn.classList.remove("pulsing"), 650);
    }

    const starCount = 35;
    const fragment = document.createDocumentFragment();
    const createdStars = [];

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement("div");
        const isCoral = Math.random() > 0.5;
        const left = (Math.random() * 96 + 2).toFixed(1);
        // Generously big diamond sparkle stars matching abhijithjinnu.in: 0.85rem to 2.35rem
        const size = (Math.random() * 1.5 + 0.85).toFixed(2);
        // Fast, linear hardware-accelerated fall: 1.6s to 3.2s
        const duration = (Math.random() * 1.6 + 1.6).toFixed(2);
        const delay = (Math.random() * 0.45).toFixed(2);

        star.className = "falling-star";
        star.textContent = "✦";
        star.style.left = `${left}%`;
        star.style.fontSize = `${size}rem`;
        star.style.animationDuration = `${duration}s`;
        star.style.animationDelay = `${delay}s`;
        star.style.color = isCoral ? "var(--capsule-bg)" : "var(--text-primary)";

        fragment.appendChild(star);
        createdStars.push(star);
    }

    // 1 single DOM insertion per click -> zero reflow lag
    container.appendChild(fragment);

    // Clean batch removal after animations complete
    setTimeout(() => {
        createdStars.forEach((s) => {
            if (s.parentNode) {
                s.parentNode.removeChild(s);
            }
        });
    }, 4200);
}

/* ==========================================================================
   2. Blurred Stagger Letter Animation (Subtitle)
   ========================================================================== */
function initBlurredStagger() {
    const container = document.getElementById("heroSubtitleStagger");
    if (!container) return;

    const text = container.getAttribute("data-text") || container.textContent.trim();
    container.innerHTML = "";

    const chars = Array.from(text);
    chars.forEach((char, index) => {
        const span = document.createElement("span");
        span.className = "stagger-char";
        span.textContent = char === " " ? "\u00A0" : char;
        span.style.transitionDelay = `${index * 22 + 80}ms`;
        container.appendChild(span);
    });

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            const spans = container.querySelectorAll(".stagger-char");
            spans.forEach((s) => s.classList.add("visible"));
        });
    });
}

/* ==========================================================================
   3. Interactive Anime Avatar (Touch, Click & Hover Smile + Blush)
   ========================================================================== */
function initInteractiveAvatar() {
    const avatar = document.getElementById("avatarInteractive");
    if (!avatar) return;

    let touchTimeout;

    // Mobile touch interaction
    avatar.addEventListener("touchstart", () => {
        clearTimeout(touchTimeout);
        avatar.classList.add("active");
    }, { passive: true });

    avatar.addEventListener("touchend", () => {
        // Keep the joyful smiling state visible for 1.8 seconds so the user can enjoy it
        touchTimeout = setTimeout(() => {
            avatar.classList.remove("active");
        }, 1800);
    }, { passive: true });

    // Desktop click toggle
    avatar.addEventListener("click", () => {
        avatar.classList.toggle("active");
    });

    // Reset when clicking anywhere outside
    document.addEventListener("click", (e) => {
        if (!avatar.contains(e.target) && avatar.classList.contains("active")) {
            avatar.classList.remove("active");
        }
    });
}

/* ==========================================================================
   4. Copyable CLI Badge (% npx chaitanya -> Paste in terminal :3)
   ========================================================================== */
function initCliBadge() {
    const badge = document.getElementById("cliBadge");
    const copyBtn = document.getElementById("cliCopyBtn");
    const notification = document.getElementById("copyNotification");
    if (!badge) return;

    let notificationTimer;

    async function handleCopy(e) {
        if (e) e.stopPropagation();
        const textToCopy = "npx chaitanya";
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(textToCopy);
            } else {
                const ta = document.createElement("textarea");
                ta.value = textToCopy;
                ta.style.position = "fixed";
                ta.style.opacity = "0";
                document.body.appendChild(ta);
                ta.select();
                document.execCommand("copy");
                ta.remove();
            }

            if (notification) {
                clearTimeout(notificationTimer);
                notification.classList.add("show");
                notificationTimer = setTimeout(() => {
                    notification.classList.remove("show");
                }, 2200);
            }
        } catch (err) {
            console.error("Clipboard copy failed:", err);
        }
    }

    badge.addEventListener("click", handleCopy);
    if (copyBtn) {
        copyBtn.addEventListener("click", handleCopy);
    }
}

/* ==========================================================================
   5. Highlights Category Filter Pills
   ========================================================================== */
function initProjectFilters() {
    const pills = document.querySelectorAll(".filter-pill");
    const cards = document.querySelectorAll(".highlight-card");
    if (!pills.length || !cards.length) return;

    pills.forEach((pill) => {
        pill.addEventListener("click", () => {
            const filter = pill.getAttribute("data-filter");

            pills.forEach((p) => p.classList.remove("active"));
            pill.classList.add("active");

            cards.forEach((card) => {
                const cat = card.getAttribute("data-category");
                if (filter === "all" || cat === filter) {
                    card.style.display = "flex";
                    requestAnimationFrame(() => {
                        card.style.opacity = "1";
                        card.style.transform = "translateY(0)";
                    });
                } else {
                    card.style.opacity = "0";
                    card.style.transform = "translateY(6px)";
                    setTimeout(() => {
                        if (card.style.opacity === "0") {
                            card.style.display = "none";
                        }
                    }, 200);
                }
            });
        });
    });
}

/* ==========================================================================
   6. Bottom Capsule & Top Nav ScrollSpy
   ========================================================================== */
function initCapsuleScrollSpy() {
    const sections = document.querySelectorAll("section[id]");
    const capsuleLinks = document.querySelectorAll(".bottom-capsule .capsule-link");
    const topNavLinks = document.querySelectorAll(".top-nav .nav-link");

    if (!sections.length) return;

    const sectionMap = {
        "hero": "hero",
        "projects": "projects",
        "experience": "experience",
        "skills": "skills",
        "education": "experience",
        "credentials": "experience",
        "contact": "contact"
    };

    function onScroll() {
        const scrollPosition = window.pageYOffset + 200;

        sections.forEach((section) => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const rawId = section.getAttribute("id");

            if (scrollPosition >= top && scrollPosition < top + height) {
                const targetId = sectionMap[rawId] || rawId;

                capsuleLinks.forEach((link) => {
                    link.classList.remove("active");
                    if (link.getAttribute("href") === `#${targetId}`) {
                        link.classList.add("active");
                    }
                });

                topNavLinks.forEach((link) => {
                    link.classList.remove("active");
                    if (link.getAttribute("href") === `#${targetId}`) {
                        link.classList.add("active");
                    }
                });
            }
        });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
}

/* ==========================================================================
   7. Smooth Anchor Navigation (Without polluting URL with anchor jumps)
   ========================================================================== */
function initSmoothAnchorLinks() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function(e) {
            const targetId = this.getAttribute("href").substring(1);
            if (!targetId) return;
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                e.preventDefault();
                targetEl.scrollIntoView({ behavior: "smooth" });
                // Cleanly update URL without causing reload jumps
                history.pushState(null, null, "#" + targetId);
            }
        });
    });
}

/* ==========================================================================
   8. Highlights Interactive Carousel (Next / Prev Navigation & Touch Swipe)
   ========================================================================== */
function initHighlightsCarousel() {
    const track = document.getElementById("carouselTrack");
    const prevBtn = document.getElementById("carouselPrevBtn");
    const nextBtn = document.getElementById("carouselNextBtn");
    const container = document.getElementById("carouselTrackContainer");

    if (!track || !prevBtn || !nextBtn || !container) return;

    let currentIndex = 0;
    const slides = track.querySelectorAll(".carousel-slide");
    const totalSlides = slides.length;

    function getSlidesVisible() {
        return window.innerWidth <= 640 ? 1 : 2;
    }

    function updateCarousel() {
        const visible = getSlidesVisible();
        const maxIndex = Math.max(0, totalSlides - visible);

        if (currentIndex < 0) currentIndex = 0;
        if (currentIndex > maxIndex) currentIndex = maxIndex;

        const containerWidth = container.clientWidth;
        const gap = 16;
        const cardWidth = visible === 1 ? containerWidth : (containerWidth - gap) / 2;
        const offset = currentIndex * (cardWidth + gap);

        track.style.transform = `translateX(-${offset}px)`;

        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= maxIndex;
    }

    prevBtn.addEventListener("click", () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });

    nextBtn.addEventListener("click", () => {
        const visible = getSlidesVisible();
        const maxIndex = Math.max(0, totalSlides - visible);
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateCarousel();
        }
    });

    // Touch swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    container.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    container.addEventListener("touchend", (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const threshold = 40;
        const visible = getSlidesVisible();
        const maxIndex = Math.max(0, totalSlides - visible);

        if (touchStartX - touchEndX > threshold && currentIndex < maxIndex) {
            currentIndex++;
            updateCarousel();
        } else if (touchEndX - touchStartX > threshold && currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    }, { passive: true });

    window.addEventListener("resize", updateCarousel, { passive: true });
    // Run after initial paint
    setTimeout(updateCarousel, 100);
}
