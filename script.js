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

        const originalText = button.textContent;


        try {

            /*
             * Modern Clipboard API
             */

            await navigator.clipboard.writeText(command);

        } catch (error) {

            /*
             * Fallback for browsers that don't
             * support navigator.clipboard.
             */

            const temporaryTextArea =
                document.createElement("textarea");

            temporaryTextArea.value = command;

            temporaryTextArea.style.position = "fixed";
            temporaryTextArea.style.opacity = "0";

            document.body.appendChild(
                temporaryTextArea
            );

            temporaryTextArea.focus();

            temporaryTextArea.select();

            document.execCommand("copy");

            temporaryTextArea.remove();
        }


        /*
         * Change button text.
         */

        button.textContent = "Copied!";

        button.classList.add("copied");


        /*
         * Restore button.
         */

        setTimeout(() => {

            button.textContent = originalText;

            button.classList.remove("copied");

        }, 1300);

    });

});


/* =========================================
   SCROLL REVEAL ANIMATION
========================================= */

const fadeElements =
    document.querySelectorAll(".fade-in");


const observer =
    new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.classList.add(
                        "visible"
                    );

                    observer.unobserve(
                        entry.target
                    );

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