// Pilih palet
function selectPalette(name) {
    const messageBox = document.getElementById("feedback-message");
    if (!messageBox) return;

    messageBox.textContent = `Palet "${name}" berhasil dipilih untuk outfit kamu!`;
    messageBox.classList.remove("hidden");

    setTimeout(() => {
        messageBox.classList.add("hidden");
    }, 3000);

    console.log("User memilih palet:", name);
}

document.addEventListener("DOMContentLoaded", () => {
    // Menu mobile
    const menu = document.getElementById("mobile-menu");
    const navContainer = document.getElementById("nav-container");
    const navList = document.getElementById("nav-list");
    const targetMenu = navContainer || navList;

    if (menu && targetMenu) {
        menu.addEventListener("click", () => {
            // Toggle menu
            if (navContainer) navContainer.classList.toggle("active-nav");
            if (navList) navList.classList.toggle("active");

            // Animasi hamburger
            const spans = menu.querySelectorAll("span");
            if (navContainer?.classList.contains("active-nav") || navList?.classList.contains("active")) {
                if (spans[0]) spans[0].style.transform = "rotate(45deg) translate(5px, 5px)";
                if (spans[1]) spans[1].style.opacity = "0";
                if (spans[2]) spans[2].style.transform = "rotate(-45deg) translate(6px, -7px)";
            } else {
                spans.forEach((span) => {
                    span.style.transform = "none";
                    span.style.opacity = "1";
                });
            }
            console.log("Menu diklik!");
        });
    }

    // Tutup menu saat link diklik
    const navLinks = document.querySelectorAll(".nav-links a");
    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            if (navContainer) navContainer.classList.remove("active-nav");
            if (navList) navList.classList.remove("active");

            if (menu) {
                const spans = menu.querySelectorAll("span");
                spans.forEach((span) => {
                    span.style.transform = "none";
                    span.style.opacity = "1";
                });
            }
        });
    });
});