/* =========================================
   CELESTIAL MIR4 JAVASCRIPT
========================================= */

"use strict";

/* =========================================
   FOOTER YEAR
========================================= */

const yearElement = document.getElementById("year");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}

/* =========================================
   COPY COMMAND BUTTONS
========================================= */

document.querySelectorAll(".copy-btn").forEach((button) => {
    button.addEventListener("click", async () => {
        const command = button.dataset.copy;

        if (!command) return;

        const originalText = button.textContent;
        const originalLabel = button.getAttribute("aria-label");

        button.disabled = true;

        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(command);
            } else {
                throw new Error("Clipboard API unavailable");
            }
        } catch (error) {
            const temporaryTextArea = document.createElement("textarea");

            temporaryTextArea.value = command;
            temporaryTextArea.setAttribute("readonly", "");

            temporaryTextArea.style.position = "fixed";
            temporaryTextArea.style.left = "-9999px";
            temporaryTextArea.style.top = "0";
            temporaryTextArea.style.opacity = "0";

            document.body.appendChild(temporaryTextArea);

            temporaryTextArea.focus();
            temporaryTextArea.select();

            let copied = false;

            try {
                copied = document.execCommand("copy");
            } catch (fallbackError) {
                console.error("Clipboard fallback failed:", fallbackError);
            } finally {
                temporaryTextArea.remove();
            }

            if (!copied) {
                console.error("Unable to copy command:", command);

                button.textContent = "Copy failed";
                button.classList.remove("copied");
                button.disabled = false;

                window.setTimeout(() => {
                    button.textContent = originalText;

                    if (originalLabel !== null) {
                        button.setAttribute("aria-label", originalLabel);
                    } else {
                        button.removeAttribute("aria-label");
                    }
                }, 1600);

                return;
            }
        }

        button.textContent = "Copied!";
        button.classList.add("copied");
        button.setAttribute("aria-label", "Command copied");

        window.setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove("copied");
            button.disabled = false;

            if (originalLabel !== null) {
                button.setAttribute("aria-label", originalLabel);
            } else {
                button.removeAttribute("aria-label");
            }
        }, 1300);
    });
});

/* =========================================
   IMAGE VIEWER / LIGHTBOX
========================================= */

const imageModal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("imageModalTitle");
const modalClose = document.getElementById("imageModalClose");

let previousFocusedElement = null;

/* Open the image viewer */

function openImageViewer(imageSource, imageTitle, imageAlt = "") {
    if (!imageModal || !modalImage || !imageSource) {
        return;
    }

    previousFocusedElement = document.activeElement;

    modalImage.src = imageSource;
    modalImage.alt = imageAlt || imageTitle || "CMir4 screenshot";

    if (modalTitle) {
        modalTitle.textContent = imageTitle || "Screenshot";
    }

    imageModal.classList.add("active");
    imageModal.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";

    if (modalClose) {
        modalClose.focus();
    }
}

/* Close the image viewer */

function closeImageViewer() {
    if (!imageModal || !imageModal.classList.contains("active")) {
        return;
    }

    imageModal.classList.remove("active");
    imageModal.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";

    if (
        previousFocusedElement &&
        typeof previousFocusedElement.focus === "function"
    ) {
        previousFocusedElement.focus();
    }

    window.setTimeout(() => {
        if (!imageModal.classList.contains("active")) {
            if (modalImage) {
                modalImage.removeAttribute("src");
                modalImage.alt = "";
            }
        }
    }, 250);
}

/* Attach click handlers using delegation */

document.addEventListener("click", (event) => {
    const target = event.target;

    if (!(target instanceof Element)) {
        return;
    }

    const photoButton = target.closest(".photo-button");

    if (!photoButton) {
        return;
    }

    const image = photoButton.querySelector("img");

    const imageSource =
        photoButton.dataset.image ||
        (image ? image.currentSrc || image.src : "");

    const imageTitle =
        photoButton.dataset.title ||
        (image ? image.alt : "") ||
        "CMir4 Screenshot";

    const imageAlt = image ? image.alt : imageTitle;

    if (imageSource) {
        openImageViewer(imageSource, imageTitle, imageAlt);
    }
});

/* Close button */

if (modalClose) {
    modalClose.addEventListener("click", closeImageViewer);
}

/* Click outside the image */

if (imageModal) {
    imageModal.addEventListener("click", (event) => {
        const target = event.target;

        if (
            target instanceof Element &&
            target.closest("[data-close-modal]")
        ) {
            closeImageViewer();
        }
    });
}

/* Escape key */

document.addEventListener("keydown", (event) => {
    if (
        event.key === "Escape" &&
        imageModal &&
        imageModal.classList.contains("active")
    ) {
        closeImageViewer();
    }
});

/* =========================================
   IMAGE ERROR HANDLING
========================================= */

function attachImageErrorHandling(image) {
    image.addEventListener("error", () => {
        image.classList.add("image-load-error");
        image.setAttribute("data-image-error", "true");
    });

    image.addEventListener("load", () => {
        image.classList.remove("image-load-error");
        image.removeAttribute("data-image-error");
    });
}

document.querySelectorAll("img").forEach(attachImageErrorHandling);

/* =========================================
   SCROLL REVEAL ANIMATION
========================================= */

const fadeElements = document.querySelectorAll(".fade-in");

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12
        }
    );

    fadeElements.forEach((element) => {
        observer.observe(element);
    });
} else {
    fadeElements.forEach((element) => {
        element.classList.add("visible");
    });
}

/* =========================================
   DATABASE LINK TRACKING / VALIDATION
========================================= */

document.querySelectorAll(
    '#commands a[href*="db.celestialmir4.com"]'
).forEach((link) => {
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
});

/* =========================================
   ACCESSIBILITY: REDUCED MOTION
========================================= */

if (
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
    document.documentElement.style.scrollBehavior = "auto";

    document.querySelectorAll(".fade-in").forEach((element) => {
        element.classList.add("visible");
    });
}

/* ===== STICKY HEADER ===== */

(function () {
    const header = document.getElementById('siteHeader');
    if (!header) return;

    function onScroll() {
        header.classList.toggle('scrolled', window.scrollY > 20);
    }

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
})();


/* ===== NAVBAR ===== */

(function () {
    const header = document.getElementById('siteHeader');
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('navLinks');

    if (!header || !toggle || !menu) return;

    const links = [...menu.querySelectorAll('a[href^="#"]')];

    /* buksan / isara ang mobile menu */
    function setMenu(open) {
        toggle.setAttribute('aria-expanded', String(open));
        menu.classList.toggle('open', open);
        header.classList.toggle('menu-open', open);
    }

    toggle.addEventListener('click', () => {
        setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });

    links.forEach((link) => {
        link.addEventListener('click', () => setMenu(false));
    });

    document.addEventListener('click', (e) => {
        if (!header.contains(e.target)) setMenu(false);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') setMenu(false);
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 960) setMenu(false);
    });

    /* sticky: solid background kapag nag-scroll */
    function onScroll() {
        header.classList.toggle('scrolled', window.scrollY > 20);
    }

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    /* active link habang nag-i-scroll */
    const map = new Map();

    links.forEach((link) => {
        const id = link.getAttribute('href').slice(1);
        const section = id && document.getElementById(id);
        if (section) map.set(section, link);
    });

    if ('IntersectionObserver' in window && map.size) {
        const spy = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    links.forEach((l) => l.classList.remove('active'));
                    map.get(entry.target).classList.add('active');
                });
            },
            { rootMargin: '-45% 0px -50% 0px' }
        );

        map.forEach((_, section) => spy.observe(section));
    }
})();