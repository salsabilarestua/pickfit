document.addEventListener('DOMContentLoaded', () => {
    
    // Navigasi & scroll
    const nav = document.getElementById('navbar');
    const menuBtn = document.getElementById('mobile-menu');
    const menuToggle = document.querySelector('.menu-toggle');
    const navContainer = document.querySelector('.nav-container');


    if (menuToggle && navContainer) {
    menuToggle.addEventListener('click', () => {
        navContainer.classList.toggle('active-nav');
    });
    }

    window.addEventListener('scroll', () => {
        if (nav && window.scrollY > 50) {
            nav.style.padding = '0.8rem 8%';
            nav.style.boxShadow = '0 5px 15px rgba(0,0,0,0.05)';
        } else if (nav) {
            nav.style.padding = '1.2rem 8%';
            nav.style.boxShadow = 'none';
        }
    });

    // Menu mobile
    if (menuBtn && navContainer) {
        menuBtn.addEventListener('click', () => {
            navContainer.classList.toggle('active-nav');
            const spans = menuBtn.querySelectorAll('span');
            if (navContainer.classList.contains('active-nav')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(6px, -7px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        const navLinks = navContainer.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navContainer.classList.remove('active-nav');
                const spans = menuBtn.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }
