document.addEventListener('DOMContentLoaded', () => {
    
    // Navigasi & scroll
    const nav = document.getElementById('navbar');
    const menuBtn = document.getElementById('mobile-menu');
    const navContainer = document.getElementById('nav-container');

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

    // Registrasi
    const formRegistrasi = document.getElementById('form-registrasi');
    if (formRegistrasi) {
        formRegistrasi.addEventListener('submit', (e) => {
            e.preventDefault();
            const nama = formRegistrasi.querySelector('input[type="text"]').value;
            localStorage.setItem('registeredName', nama);
            alert(`Halo ${nama}, pendaftaran berhasil!`);
            window.location.href = "/masuk"; 
        });
    }

    // Login
    const formLogin = document.getElementById('form-login');
    if (formLogin) {
        formLogin.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = formLogin.querySelector('input[type="email"]');
            const passwordInput = formLogin.querySelector('input[type="password"]');

            if (emailInput.value && passwordInput.value) {
                let namaLengkap = localStorage.getItem('registeredName');
                if (!namaLengkap) {
                    const rawName = emailInput.value.split('@')[0];
                    namaLengkap = rawName.replace(/[._-]/g, ' ')
                                         .replace(/\b\w/g, char => char.toUpperCase());
                }
                localStorage.setItem('activeUser', namaLengkap);
                alert("Login Berhasil! Selamat datang, " + namaLengkap);
                window.location.href = "/"; 
            } else {
                alert("Harap isi email dan password!");
            }
        });
    }

    // Menu profil
    const savedUsername = localStorage.getItem('activeUser');
    const displayUsername = document.getElementById('display-username');
    const guestMenu = document.getElementById('guest-menu');
    const userMenu = document.getElementById('user-menu');

    if (savedUsername) {
        if (guestMenu) guestMenu.style.display = 'none';
        if (userMenu) userMenu.style.display = 'block';  
    } else {
        if (guestMenu) guestMenu.style.display = 'block';
        if (userMenu) userMenu.style.display = 'none';
    }

    if (displayUsername) { 
        if (savedUsername) {
            displayUsername.textContent = savedUsername;
            const welcomeMsg = document.getElementById('welcome-msg');
            if (welcomeMsg) welcomeMsg.textContent = "Halo, " + savedUsername + "!";
        } else {
            alert("Silakan masuk terlebih dahulu!");
            window.location.href = "/masuk"; 
        }
    }

    // Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem('activeUser');
            localStorage.removeItem('registeredName'); 
            alert("Kamu telah keluar. Sampai jumpa lagi!");
            window.location.href = "/";
        });
    }

    if (typeof tampilkanLemari === 'function') {
        tampilkanLemari();
    }
});