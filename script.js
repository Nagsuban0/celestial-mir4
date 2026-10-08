/* =========================================
   CELESTIAL MIR4 JAVASCRIPT
========================================= */


/* =========================================
   FOOTER YEAR
========================================= */

const yearElement =
    document.getElementById("year");

if (yearElement) {

    yearElement.textContent =
        new Date().getFullYear();

}


/* =========================================
   COPY COMMAND BUTTONS
========================================= */

const copyButtons =
    document.querySelectorAll(".copy-btn");


copyButtons.forEach((button) => {

    button.addEventListener("click", async () => {

        const command =
            button.dataset.copy;

        const originalText =
            button.textContent;


        try {

            /*
             * Modern Clipboard API
             */

            if (
                navigator.clipboard &&
                window.isSecureContext
            ) {

                await navigator.clipboard.writeText(
                    command
                );

            } else {

                throw new Error(
                    "Clipboard API unavailable"
                );

            }

        } catch (error) {

            /*
             * Fallback
             */

            const temporaryTextArea =
                document.createElement("textarea");


            temporaryTextArea.value =
                command;


            temporaryTextArea.style.position =
                "fixed";

            temporaryTextArea.style.left =
                "-9999px";

            temporaryTextArea.style.opacity =
                "0";


            document.body.appendChild(
                temporaryTextArea
            );


            temporaryTextArea.focus();

            temporaryTextArea.select();


            try {

                document.execCommand("copy");

            } catch (fallbackError) {

                console.error(
                    "Unable to copy command:",
                    fallbackError
                );

            }


            temporaryTextArea.remove();

        }


        button.textContent =
            "Copied!";


        button.classList.add(
            "copied"
        );


        setTimeout(() => {

            button.textContent =
                originalText;

            button.classList.remove(
                "copied"
            );

        }, 1300);

    });

});


/* =========================================
   IMAGE VIEWER / LIGHTBOX
========================================= */

const imageModal =
    document.getElementById(
        "imageModal"
    );


const modalImage =
    document.getElementById(
        "modalImage"
    );


const modalTitle =
    document.getElementById(
        "imageModalTitle"
    );


const modalClose =
    document.getElementById(
        "imageModalClose"
    );


const photoButtons =
    document.querySelectorAll(
        ".photo-button"
    );


/*
 * Open image viewer
 */

function openImageViewer(
    imageSource,
    imageTitle
) {

    if (
        !imageModal ||
        !modalImage
    ) {
        return;
    }


    modalImage.src =
        imageSource;


    modalImage.alt =
        imageTitle;


    if (modalTitle) {

        modalTitle.textContent =
            imageTitle;

    }


    imageModal.classList.add(
        "active"
    );


    imageModal.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.style.overflow =
        "hidden";


    if (modalClose) {

        modalClose.focus();

    }

}


/*
 * Close image viewer
 */

function closeImageViewer() {

    if (!imageModal) {
        return;
    }


    imageModal.classList.remove(
        "active"
    );


    imageModal.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.style.overflow =
        "";


    /*
     * Clear image after animation.
     */

    setTimeout(() => {

        if (
            !imageModal.classList.contains(
                "active"
            )
        ) {

            if (modalImage) {

                modalImage.src =
                    "";

                modalImage.alt =
                    "";

            }

        }

    }, 250);

}


/*
 * Photo buttons
 */

photoButtons.forEach((button) => {

    button.addEventListener(
        "click",
        () => {

            const imageSource =
                button.dataset.image;

            const imageTitle =
                button.dataset.title ||
                "Screenshot";


            if (imageSource) {

                openImageViewer(
                    imageSource,
                    imageTitle
                );

            }

        }
    );

});


/*
 * Close button
 */

if (modalClose) {

    modalClose.addEventListener(
        "click",
        closeImageViewer
    );

}


/*
 * Click outside image
 */

if (imageModal) {

    imageModal.addEventListener(
        "click",
        (event) => {

            if (
                event.target.matches(
                    "[data-close-modal]"
                )
            ) {

                closeImageViewer();

            }

        }
    );

}


/*
 * ESC key
 */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape" &&
            imageModal &&
            imageModal.classList.contains(
                "active"
            )
        ) {

            closeImageViewer();

        }

    }
);


/* =========================================
   SCROLL REVEAL ANIMATION
========================================= */

const fadeElements =
    document.querySelectorAll(
        ".fade-in"
    );


if (
    "IntersectionObserver" in window
) {

    const observer =
        new IntersectionObserver(
            (entries) => {

                entries.forEach(
                    (entry) => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "visible"
                            );


                            observer.unobserve(
                                entry.target
                            );

                        }

                    }
                );

            },
            {
                threshold: 0.12
            }
        );


    fadeElements.forEach(
        (element) => {

            observer.observe(
                element
            );

        }
    );

} else {

    /*
     * Fallback for old browsers.
     */

    fadeElements.forEach(
        (element) => {

            element.classList.add(
                "visible"
            );

        }
    );

}