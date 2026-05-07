document.addEventListener("DOMContentLoaded", () => {
    /* =========================
       NAVBAR RESPONSIVE
    ========================= */
    const nav = document.getElementById("navbar");
    const menuBtn = document.getElementById("mobile-menu");
    const navContainer = document.getElementById("nav-container");

    window.addEventListener("scroll", () => {
        if (!nav) return;

        if (window.scrollY > 50) {
            nav.style.padding = "0.8rem 8%";
            nav.style.boxShadow = "0 5px 15px rgba(0,0,0,0.05)";
        } else {
            nav.style.padding = "1.2rem 8%";
            nav.style.boxShadow = "none";
        }
    });

    if (menuBtn && navContainer) {
        menuBtn.addEventListener("click", () => {
            navContainer.classList.toggle("active-nav");

            const spans = menuBtn.querySelectorAll("span");

            if (navContainer.classList.contains("active-nav")) {
                spans[0].style.transform =
                    "rotate(45deg) translate(5px, 5px)";
                spans[1].style.opacity = "0";
                spans[2].style.transform =
                    "rotate(-45deg) translate(6px, -7px)";
            } else {
                spans[0].style.transform = "none";
                spans[1].style.opacity = "1";
                spans[2].style.transform = "none";
            }
        });

        const navLinks = navContainer.querySelectorAll("a");

        navLinks.forEach((link) => {
            link.addEventListener("click", () => {
                navContainer.classList.remove("active-nav");

                const spans = menuBtn.querySelectorAll("span");

                spans[0].style.transform = "none";
                spans[1].style.opacity = "1";
                spans[2].style.transform = "none";
            });
        });
    }

    /* =========================
       AUTO HIDE FLASH MESSAGE
    ========================= */
    const flashMessage = document.querySelector(
        ".alert, .success-message, .error-message"
    );

    if (flashMessage) {
        setTimeout(() => {
            flashMessage.style.transition = "0.5s";
            flashMessage.style.opacity = "0";

            setTimeout(() => {
                flashMessage.remove();
            }, 500);
        }, 3000);
    }

    /* =========================
       SMOOTH SCROLL INTERNAL LINK
    ========================= */
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            const target = document.querySelector(this.getAttribute("href"));

            if (target) {
                e.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                });
            }
        });
    });
});