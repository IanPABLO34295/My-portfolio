/* =========================================================
   IAN ANUNDA — DIGITAL PDF PORTFOLIO
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const pages = [...document.querySelectorAll(".pdf-page")];

    const pageIndicator = document.getElementById("pageIndicator");
    const navCurrent = document.getElementById("navCurrent");
    const progressBar = document.getElementById("progressBar");

    const prevPage = document.getElementById("prevPage");
    const nextPage = document.getElementById("nextPage");

    const navPrev = document.getElementById("navPrev");
    const navNext = document.getElementById("navNext");

    const printButton = document.getElementById("printPortfolio");

    let currentPage = 0;


    /* =====================================================
       PAGE NAVIGATION
    ====================================================== */

    function goToPage(index) {

        if (index < 0) {
            index = 0;
        }

        if (index >= pages.length) {
            index = pages.length - 1;
        }

        currentPage = index;

        pages[index].scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        updatePageUI();
    }


    function updatePageUI() {

        const pageNumber = String(currentPage + 1).padStart(2, "0");
        const total = String(pages.length).padStart(2, "0");

        if (pageIndicator) {
            pageIndicator.textContent = `${pageNumber} / ${total}`;
        }

        if (navCurrent) {
            navCurrent.textContent = pageNumber;
        }

        if (progressBar) {

            const percentage =
                ((currentPage + 1) / pages.length) * 100;

            progressBar.style.width = `${percentage}%`;
        }

        if (prevPage) {
            prevPage.disabled = currentPage === 0;
        }

        if (nextPage) {
            nextPage.disabled =
                currentPage === pages.length - 1;
        }
    }


    if (prevPage) {
        prevPage.addEventListener("click", () => {
            goToPage(currentPage - 1);
        });
    }

    if (nextPage) {
        nextPage.addEventListener("click", () => {
            goToPage(currentPage + 1);
        });
    }

    if (navPrev) {
        navPrev.addEventListener("click", () => {
            goToPage(currentPage - 1);
        });
    }

    if (navNext) {
        navNext.addEventListener("click", () => {
            goToPage(currentPage + 1);
        });
    }


    /* =====================================================
       KEYBOARD NAVIGATION
    ====================================================== */

    document.addEventListener("keydown", (event) => {

        if (event.key === "ArrowDown" ||
            event.key === "PageDown") {

            event.preventDefault();

            goToPage(currentPage + 1);
        }

        if (event.key === "ArrowUp" ||
            event.key === "PageUp") {

            event.preventDefault();

            goToPage(currentPage - 1);
        }

        if (event.key === "Home") {

            event.preventDefault();

            goToPage(0);
        }

        if (event.key === "End") {

            event.preventDefault();

            goToPage(pages.length - 1);
        }

        if (event.key === "Escape") {

            closeLightbox();
        }

    });


    /* =====================================================
       DETECT CURRENT PAGE WHILE SCROLLING
    ====================================================== */

    const observer = new IntersectionObserver(
        (entries) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    const pageNumber =
                        Number(entry.target.dataset.page);

                    if (!isNaN(pageNumber)) {

                        currentPage = pageNumber - 1;

                        updatePageUI();
                    }
                }

            });

        },
        {
            threshold: 0.55
        }
    );


    pages.forEach(page => {
        observer.observe(page);
    });


    /* =====================================================
       PRINT / SAVE AS PDF
    ====================================================== */

    if (printButton) {

        printButton.addEventListener("click", () => {

            window.print();

        });

    }


    /* =====================================================
       LIGHTBOX
    ====================================================== */

    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightboxImage");
    const lightboxClose = document.getElementById("lightboxClose");

    const imageElements =
        document.querySelectorAll(".lightbox-image");


    imageElements.forEach(image => {

        image.addEventListener("click", () => {

            if (!lightbox || !lightboxImage) {
                return;
            }

            lightboxImage.src = image.src;

            lightboxImage.alt =
                image.alt || "Portfolio image";

            lightbox.classList.add("active");

            document.body.style.overflow = "hidden";

        });

    });


    function closeLightbox() {

        if (!lightbox) {
            return;
        }

        lightbox.classList.remove("active");

        document.body.style.overflow = "";

        if (lightboxImage) {
            lightboxImage.src = "";
        }
    }


    if (lightboxClose) {

        lightboxClose.addEventListener(
            "click",
            closeLightbox
        );

    }


    if (lightbox) {

        lightbox.addEventListener("click", (event) => {

            if (event.target === lightbox) {

                closeLightbox();

            }

        });

    }


    /* =====================================================
       TOUCH SWIPE
    ====================================================== */

    let touchStartY = 0;
    let touchEndY = 0;


    document.addEventListener("touchstart", event => {

        touchStartY =
            event.changedTouches[0].screenY;

    }, {
        passive: true
    });


    document.addEventListener("touchend", event => {

        touchEndY =
            event.changedTouches[0].screenY;

        const difference =
            touchStartY - touchEndY;


        if (Math.abs(difference) < 70) {
            return;
        }


        if (difference > 0) {

            goToPage(currentPage + 1);

        } else {

            goToPage(currentPage - 1);

        }

    }, {
        passive: true
    });


    /* =====================================================
       INITIAL PAGE
    ====================================================== */

    updatePageUI();

});