/* =========================================
   CELESTIAL MIR4 JAVASCRIPT
========================================= */


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

const copyButtons = document.querySelectorAll(".copy-btn");

copyButtons.forEach((button) => {
    button.addEventListener("click", async () => {
        const command = button.dataset.copy;

        if (!command) return;

        const originalText = button.textContent;

        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(command);
            } else {
                throw new Error("Clipboard API unavailable");
            }
        } catch (error) {
            const temporaryTextArea = document.createElement("textarea");

            temporaryTextArea.value = command;
            temporaryTextArea.style.position = "fixed";
            temporaryTextArea.style.left = "-9999px";
            temporaryTextArea.style.opacity = "0";

            document.body.appendChild(temporaryTextArea);

            temporaryTextArea.focus();
            temporaryTextArea.select();

            try {
                const successful = document.execCommand("copy");

                if (!successful) {
                    throw new Error("Copy command failed");
                }
            } catch (fallbackError) {
                console.error("Unable to copy command:", fallbackError);

                button.textContent = "Copy failed";
                button.classList.remove("copied");

                setTimeout(() => {
                    button.textContent = originalText;
                }, 1300);

                temporaryTextArea.remove();
                return;
            }

            temporaryTextArea.remove();
        }

        button.textContent = "Copied!";
        button.classList.add("copied");

        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove("copied");
        }, 1300);
    });
});


/* =========================================
   IMAGE VIEWER / LIGHTBOX
   Supports all .photo-button elements,
   including database and guild screenshots.
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

    if (previousFocusedElement && typeof previousFocusedElement.focus === "function") {
        previousFocusedElement.focus();
    }

    setTimeout(() => {
        if (!imageModal.classList.contains("active")) {
            if (modalImage) {
                modalImage.removeAttribute("src");
                modalImage.alt = "";
            }
        }
    }, 250);
}


/* Attach click handlers using delegation.
   Newly added photo buttons work automatically. */

document.addEventListener("click", (event) => {
    const photoButton = event.target.closest(".photo-button");

    if (!photoButton) return;

    const image = photoButton.querySelector("img");

    const imageSource =
        photoButton.dataset.image ||
        (image ? image.currentSrc || image.src : "");

    const imageTitle =
        photoButton.dataset.title ||
        (image ? image.alt : "") ||
        "CMir4 Screenshot";

    const imageAlt =
        image ? image.alt : imageTitle;

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
        if (event.target.closest("[data-close-modal]")) {
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
   Displays a useful message when a photo
   path is incorrect or the image is missing.
========================================= */

document.querySelectorAll("img").forEach((image) => {
    image.addEventListener("error", () => {
        image.classList.add("image-load-error");
        image.setAttribute("data-image-error", "true");
    });

    image.addEventListener("load", () => {
        image.classList.remove("image-load-error");
        image.removeAttribute("data-image-error");
    });
});


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
   Keeps database cards as normal links.
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