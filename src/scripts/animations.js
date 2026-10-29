// src/scripts/animations.js
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Di HP, bar alamat browser muncul/hilang saat scroll dan mengubah tinggi layar.
// Abaikan resize jenis itu supaya ScrollTrigger tidak menghitung ulang layout saat scroll.
ScrollTrigger.config({ ignoreMobileResize: true });

function initThemeToggle() {
    const toggleBtn = document.getElementById("theme-toggle");
    const toggleBtnMobile = document.getElementById("theme-toggle-mobile");
    const sunIcon = document.getElementById("theme-icon-sun");
    const moonIcon = document.getElementById("theme-icon-moon");
    const sunIconMobile = document.getElementById("theme-icon-sun-mobile");
    const moonIconMobile = document.getElementById("theme-icon-moon-mobile");

    if (!toggleBtn && !toggleBtnMobile) return;

    const applyIcon = () => {
        const isDark = document.documentElement.classList.contains("dark");

        if (sunIcon && moonIcon) {
            sunIcon.classList.toggle("hidden", !isDark);
            moonIcon.classList.toggle("hidden", isDark);
        }

        if (sunIconMobile && moonIconMobile) {
            sunIconMobile.classList.toggle("hidden", !isDark);
            moonIconMobile.classList.toggle("hidden", isDark);
        }
    };

    applyIcon();

    const handleToggleClick = () => {
        document.documentElement.classList.toggle("dark");
        const isDark = document.documentElement.classList.contains("dark");
        localStorage.setItem("sims-theme", isDark ? "dark" : "light");
        applyIcon();
    };

    const bindOnce = (btn) => {
        if (!btn || btn.dataset.themeBound === "true") return;
        btn.addEventListener("click", handleToggleClick);
        btn.dataset.themeBound = "true";
    };

    bindOnce(toggleBtn);
    bindOnce(toggleBtnMobile);
}

function initNavIndicator() {
    const navBar = document.querySelector("nav");
    const navContainer = document.getElementById("nav-pill");
    const indicator = document.getElementById("nav-indicator");

    if (!navContainer || !indicator) return;

    const navLinks = [...navContainer.querySelectorAll(".nav-link")];
    if (!navLinks.length) return;

    // Efek teks bergulir saat hover. Tinggi teks dibaca saat hover (bukan sekali di awal),
    // jadi tetap benar walaupun font baru selesai dimuat setelah init.
    navLinks.forEach((link) => {
        const track = link.querySelector(".nav-track");
        if (!track || !track.children[0]) return;

        const roll = (toEnd) =>
            gsap.to(track, {
                y: toEnd ? -track.children[0].offsetHeight : 0,
                duration: 0.18,
                ease: "power3.out",
                overwrite: "auto",
            });

        link.addEventListener("mouseenter", () => roll(true));
        link.addEventListener("mouseleave", () => roll(false));
    });

    const sections = navLinks
        .map((link) => {
            const href = link.getAttribute("href");
            if (!href || !href.startsWith("#") || href.length === 1) return null;

            try {
                const el = document.querySelector(href);
                return el ? { link, el } : null;
            } catch (e) {
                return null;
            }
        })
        .filter(Boolean);

    if (!sections.length) return;

    let activeLink = sections[0].link;

    const blinkTween = { current: null };

    const moveIndicatorTo = (link, animate = true) => {
        if (!link) return;

        const x = link.offsetLeft;
        const width = link.offsetWidth;

        if (blinkTween.current) {
            blinkTween.current.kill();
            blinkTween.current = null;
        }

        if (animate) {
            blinkTween.current = gsap
                .timeline({ overwrite: "auto" })
                .to(indicator, { opacity: 0, duration: 0.05, ease: "power1.in" })
                .set(indicator, { x, width })
                .to(indicator, { opacity: 1, duration: 0.05, ease: "power1.out" });
        } else {
            gsap.set(indicator, { x, width, opacity: 1 });
        }
    };

    // Hanya warna yang berubah. Sebelumnya link aktif juga diberi font-semibold, yang membuat
    // lebar teks (dan lebar navbar) berubah setiap pindah section, sehingga layout bergeser
    // dan indikator mengukur lebar sebelum teksnya berubah.
    const setActiveStyles = (link) => {
        navLinks.forEach((item) => {
            item.querySelectorAll(".nav-track span").forEach((span) => {
                span.classList.remove("text-blue-950", "dark:text-blue-900", "font-semibold");
                span.classList.add("text-white");
            });
        });

        link.querySelectorAll(".nav-track span").forEach((span) => {
            span.classList.remove("text-white");
            span.classList.add("text-blue-950", "dark:text-blue-900");
        });
    };

    const setActive = (link, animate = true) => {
        if (!link || link === activeLink) return;

        activeLink = link;
        // Terapkan gaya dulu, baru ukur posisi indikator.
        setActiveStyles(link);
        navLinks.forEach((l) => l.classList.toggle("is-active", l === link));
        moveIndicatorTo(link, animate);
    };

    const getReferenceLine = () => {
        const navHeight = navBar?.offsetHeight || 64;
        // clientHeight stabil saat bar alamat HP muncul/hilang, tidak seperti innerHeight.
        return navHeight + document.documentElement.clientHeight * 0.35;
    };

    const updateActiveSection = () => {
        if (window.scrollY < 10) {
            setActive(sections[0].link);
            return;
        }

        const atBottom =
            Math.ceil(window.innerHeight + window.scrollY) >=
            document.documentElement.scrollHeight - 2;

        if (atBottom) {
            setActive(sections[sections.length - 1].link);
            return;
        }

        const refLine = getReferenceLine();
        let current = sections[0].link;

        for (const { link, el } of sections) {
            const top = el.getBoundingClientRect().top;
            if (top <= refLine) {
                current = link;
            } else {
                break;
            }
        }

        setActive(current);
    };

    let ticking = false;
    window.addEventListener(
        "scroll",
        () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateActiveSection();
                    ticking = false;
                });
                ticking = true;
            }
        },
        { passive: true }
    );

    // Hanya hitung ulang jika LEBAR berubah. Perubahan tinggi (bar alamat HP) diabaikan.
    let lastWidth = window.innerWidth;
    window.addEventListener("resize", () => {
        if (window.innerWidth === lastWidth) return;
        lastWidth = window.innerWidth;
        moveIndicatorTo(activeLink, false);
        updateActiveSection();
    });

    // Jika lebar navbar berubah karena sebab lain (font selesai dimuat, dll), indikator ikut menyesuaikan.
    if ("ResizeObserver" in window) {
        new ResizeObserver(() => moveIndicatorTo(activeLink, false)).observe(navContainer);
    }

    const syncIndicatorNow = () => {
        updateActiveSection();
        moveIndicatorTo(activeLink, false);
        setActiveStyles(activeLink);
    };

    requestAnimationFrame(syncIndicatorNow);

    const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
    const pageLoaded = new Promise((resolve) => {
        if (document.readyState === "complete") {
            resolve();
        } else {
            window.addEventListener("load", resolve, { once: true });
        }
    });

    Promise.all([fontsReady, pageLoaded]).then(() => {
        requestAnimationFrame(syncIndicatorNow);
    });
}

function initLoginButtonHover() {
    const loginTexts = document.querySelectorAll(".login-text");
    if (!loginTexts.length) return;

    loginTexts.forEach((textEl) => {
        // Cegah dipasang dua kali: panggilan kedua akan membaca teks yang sudah digandakan
        // (hurufnya jadi dobel) dan menambah listener hover kedua.
        if (textEl.dataset.splitReady === "true") return;

        const button = textEl.closest("a");
        if (!button) return;

        const label = textEl.dataset.text || textEl.textContent.trim();
        if (!label) return;

        textEl.dataset.splitReady = "true";
        textEl.innerHTML = "";
        const tracks = [];

        [...label].forEach((char) => {
            const display = char === " " ? "\u00A0" : char;

            const mask = document.createElement("span");
            mask.className = "letter-mask";

            const track = document.createElement("span");
            track.className = "letter-track";
            track.innerHTML = `
                <span class="letter">${display}</span>
                <span class="letter">${display}</span>
            `;

            mask.appendChild(track);
            textEl.appendChild(mask);
            tracks.push(track);
        });

        const tl = gsap.timeline({
            paused: true,
            defaults: { duration: 0.3, ease: "expo.out" },
        });

        tl.to(tracks, { yPercent: -50, stagger: 0.01 });

        button.addEventListener("mouseenter", () => tl.play());
        button.addEventListener("mouseleave", () => tl.reverse());
    });
}

function initNavFade() {
    const items = document.querySelectorAll(".nav-fade-item");

    items.forEach((item) => {
        item.addEventListener("mouseenter", () => {
            items.forEach((other) => {
                gsap.to(other, {
                    opacity: other === item ? 1 : 0.45,
                    duration: 0.25,
                    ease: "power2.out",
                    overwrite: "auto",
                });
            });
        });

        item.addEventListener("mouseleave", () => {
            gsap.to(items, {
                opacity: 1,
                duration: 0.25,
                ease: "power2.out",
                overwrite: "auto",
            });
        });
    });
}


function initHorizontalScroll() {
    const wrapper = document.getElementById("horizontal-wrapper");
    const track = document.getElementById("horizontal-track");

    if (!wrapper || !track) return;

    const cards = [...track.querySelectorAll(".howitworks-card")];
    let mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
        let spacer = track.querySelector(".howitworks-trail-spacer");
        if (!spacer) {
            spacer = document.createElement("div");
            spacer.className = "howitworks-trail-spacer";
            spacer.style.cssText = "flex-shrink:0; width:10px; height:1px; pointer-events:none;";
            track.appendChild(spacer);
        }

        const getScrollDistance = () => track.scrollWidth - wrapper.offsetWidth;

        const tween = gsap.to(track, {
            x: () => -getScrollDistance(),
            ease: "none",
        });

        const updateCardScale = () => {
            const wrapperRect = wrapper.getBoundingClientRect();
            const centerX = wrapperRect.left + wrapperRect.width / 2;

            cards.forEach((card) => {
                const cardRect = card.getBoundingClientRect();
                const cardCenterX = cardRect.left + cardRect.width / 2;
                const distance = Math.abs(centerX - cardCenterX);
                const maxDistance = wrapperRect.width / 2;
                const proximity = Math.max(0, 1 - distance / maxDistance);

                gsap.set(card, { scale: 0.92 + proximity * 0.18 });
            });
        };

        ScrollTrigger.create({
            trigger: wrapper,
            start: "top top",
            end: () => `+=${getScrollDistance()}`,
            pin: true,
            animation: tween,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: updateCardScale,
            onRefresh: updateCardScale,
        });

        updateCardScale();

        return () => {
            const currentSpacer = track.querySelector(".howitworks-trail-spacer");
            if (currentSpacer) currentSpacer.remove();

            gsap.set(track, { clearProps: "transform" });
            gsap.set(cards, { clearProps: "transform" });
        };
    });
}

function initFaqAccordion() {
    const items = document.querySelectorAll(".faq-item");
    if (!items.length) return;

    items.forEach((item) => {
        const trigger = item.querySelector(".faq-trigger");
        if (!trigger) return;

        trigger.addEventListener("click", () => {
            const isOpen = item.classList.contains("is-open");
            items.forEach((i) => i.classList.remove("is-open"));

            if (!isOpen) {
                item.classList.add("is-open");
            }
        });
    });
}

function wrapWordsPreservingTags(el) {
    if (!el.dataset.originalHtml) {
        el.dataset.originalHtml = el.innerHTML;
    } else {
        el.innerHTML = el.dataset.originalHtml;
    }

    const wrapTextNode = (node) => {
        const tokens = node.textContent.split(/(\s+)/);
        const frag = document.createDocumentFragment();

        tokens.forEach((token) => {
            if (token === "") return;

            if (/^\s+$/.test(token)) {
                frag.appendChild(document.createTextNode(token));
                return;
            }

            const span = document.createElement("span");
            span.className = "reveal-word";
            span.style.display = "inline-block";
            span.textContent = token;
            frag.appendChild(span);
        });

        node.replaceWith(frag);
    };

    const walk = (node) => {
        [...node.childNodes].forEach((child) => {
            if (child.nodeType === Node.TEXT_NODE) {
                if (child.textContent.trim() !== "") {
                    wrapTextNode(child);
                }
            } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== "BR") {
                walk(child);
            }
        });
    };

    walk(el);
}

function groupWordsIntoLines(el) {
    const words = Array.from(el.querySelectorAll(".reveal-word"));
    if (!words.length) return [];

    const lines = [];
    let currentTop = null;
    let currentLine = [];

    words.forEach((word) => {
        const top = word.offsetTop;
        if (currentTop === null || Math.abs(top - currentTop) < 2) {
            currentLine.push(word);
            currentTop = top;
        } else {
            lines.push(currentLine);
            currentLine = [word];
            currentTop = top;
        }
    });
    if (currentLine.length) lines.push(currentLine);

    el.innerHTML = "";
    const lineInners = [];

    lines.forEach((lineWords) => {
        const lineWrap = document.createElement("span");
        lineWrap.className = "split-line";
        lineWrap.style.display = "block";
        lineWrap.style.overflow = "hidden";

        const lineInner = document.createElement("span");
        lineInner.className = "split-line-inner";
        lineInner.style.display = "inline-block";
        lineInner.style.willChange = "transform, opacity";

        lineWords.forEach((word, i) => {
            lineInner.appendChild(word);
            if (i < lineWords.length - 1) {
                lineInner.appendChild(document.createTextNode(" "));
            }
        });

        lineWrap.appendChild(lineInner);
        el.appendChild(lineWrap);
        lineInners.push(lineInner);
    });

    return lineInners;
}

function splitIntoLines(el) {
    wrapWordsPreservingTags(el);
    return groupWordsIntoLines(el);
}

function initScrollTextReveal() {
    const targets = document.querySelectorAll("[data-reveal-text]");
    if (!targets.length) return;

    gsap.set(targets, { autoAlpha: 0 });

    let scrollTriggers = [];

    const build = () => {
        scrollTriggers.forEach((st) => st.kill());
        scrollTriggers = [];

        targets.forEach((el) => {
            const lines = splitIntoLines(el);
            if (!lines.length) return;

            gsap.set(lines, { yPercent: 110, opacity: 0 });
            gsap.set(el, { autoAlpha: 1 });
            el.classList.add("reveal-ready");

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: el,
                    start: "top 70%",
                    toggleActions: "play none none reverse",
                    invalidateOnRefresh: true,
                },
            });

            tl.to(lines, {
                yPercent: 0,
                opacity: 1,
                duration: 0.65,
                ease: "power3.out",
                stagger: 0.02,
            });

            scrollTriggers.push(tl.scrollTrigger);
        });
    };

    const pageFullyLoaded = () =>
        new Promise((resolve) => {
            if (document.readyState === "complete") {
                resolve();
            } else {
                window.addEventListener("load", resolve, { once: true });
            }
        });

    Promise.all([document.fonts.ready, pageFullyLoaded()]).then(() => {
        build();
        ScrollTrigger.refresh();
    });

    // Pecah ulang teks HANYA jika lebar layar berubah. Di HP, resize karena bar alamat
    // (tinggi saja) sebelumnya ikut memicu pecah ulang + refresh, yang membuat halaman
    // melompat dan ukuran tampilan terlihat membesar/mengecil saat scroll.
    let lastWidth = window.innerWidth;
    let resizeTimer;
    window.addEventListener("resize", () => {
        if (window.innerWidth === lastWidth) return;
        lastWidth = window.innerWidth;

        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            build();
            ScrollTrigger.refresh();
        }, 200);
    });
}

export function initLandingAnimations() {
    initNavIndicator();
    initLoginButtonHover();
    initNavFade();
    initHorizontalScroll();
    initFaqAccordion();
    initScrollTextReveal();

    ScrollTrigger.refresh();
}

export function playHeroAnimations() {
    gsap.set("#main-content", { autoAlpha: 1 });
    gsap.set('[data-animate="hero-text"], [data-animate="hero-visual"]', {
        opacity: 1,
        y: 0,
        scale: 1,
        clearProps: "transform,opacity"
    });
    // Hero tetap statis tanpa animasi masuk.
}