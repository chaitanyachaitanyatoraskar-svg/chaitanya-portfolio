/* ==========================================================================
   CHAITANYA TORASKAR — PORTFOLIO INTERACTIONS
   Interactive Anime Avatar, Star Shower Cascade, Filter Pills & Capsule Nav
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    forceFreshFavicon();
    initMultilingualPreloader();
    initStarRainButton();
    initInteractiveAvatar();
    initCliBadge();
    initProjectFilters();
    initCapsuleScrollSpy();
});

/* ==========================================================================
   0. Multilingual Preloader & Reload Entrance (Exact abhijithjinnu.in Component)
   ========================================================================== */
function initMultilingualPreloader() {
    const loadingScreen = document.getElementById("loadingScreen");
    const loadingText = document.getElementById("loadingScreenText");

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

    const starCount = 34; // Generous burst of sparkle stars
    const svgSparkle = '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor"><path d="M12 0 Q12 12 24 12 Q12 12 12 24 Q12 12 0 12 Q12 12 12 0 Z"/></svg>';

    for (let i = 0; i < starCount; i++) {
        setTimeout(() => {
            const star = document.createElement("div");
            const isCoral = Math.random() > 0.48;
            star.className = `falling-star ${isCoral ? "coral" : "white"}`;
            star.innerHTML = svgSparkle;

            const left = (Math.random() * 92 + 4).toFixed(2); // 4% to 96%
            const size = Math.floor(Math.random() * 16) + 12; // 12px to 28px
            const duration = (Math.random() * 1.6 + 2.6).toFixed(2); // 2.6s to 4.2s
            const drift = (Math.random() * 60 - 30).toFixed(0); // -30px to +30px
            const rot = (Math.random() * 720 - 360).toFixed(0); // rotation

            star.style.left = `${left}%`;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.animationDuration = `${duration}s`;
            star.style.setProperty("--drift-x", `${drift}px`);
            star.style.setProperty("--rot", `${rot}deg`);

            container.appendChild(star);

            star.addEventListener("animationend", () => {
                star.remove();
            });

            setTimeout(() => {
                if (star.parentNode) {
                    star.remove();
                }
            }, (parseFloat(duration) + 0.3) * 1000);
        }, i * 22);
    }
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
