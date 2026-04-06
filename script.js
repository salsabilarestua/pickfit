document.addEventListener('DOMContentLoaded', () => {
    
    /* NAVIGASI & RESPONSIVE */
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

    if (menuBtn && navContainer) {
        menuBtn.addEventListener('click', () => {
            navContainer.classList.toggle('active-nav');
            const spans = menuBtn.querySelectorAll('span');
            if(navContainer.classList.contains('active-nav')) {
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

    /* FITUR DAFTAR & MASUK */
    const formRegistrasi = document.getElementById('form-registrasi');
    if (formRegistrasi) {
        formRegistrasi.addEventListener('submit', (e) => {
            e.preventDefault();
            const nama = formRegistrasi.querySelector('input[type="text"]').value;
            alert(`Halo ${nama}, pendaftaran berhasil!`);
            window.location.href = "masuk.html";
        });
    }

    const formLogin = document.getElementById('form-login');
    if (formLogin) {
        formLogin.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = formLogin.querySelector('input[type="email"]');
            const passwordInput = formLogin.querySelector('input[type="password"]');

            if (emailInput.value && passwordInput.value) {
                const username = emailInput.value.split('@')[0];
                localStorage.setItem('activeUser', username);

                alert("Login Berhasil! Selamat datang, " + username);
                window.location.href = "index.html"; 
            } else {
                alert("Harap isi email dan password!");
            }
        });
    }

    tampilkanLemari();
});

window.hapusBaju = function(index) {
    let koleksi = JSON.parse(localStorage.getItem('lemariPickFit')) || [];
    koleksi.splice(index, 1);
    localStorage.setItem('lemariPickFit', JSON.stringify(koleksi));
    location.reload();
};

document.addEventListener("DOMContentLoaded", function() {
    const savedUsername = localStorage.getItem('activeUser');
    const displayUsername = document.getElementById('display-username');
    const guestMenu = document.getElementById('guest-menu');
    const userMenu = document.getElementById('user-menu');

    if (savedUsername) {
        if(guestMenu) guestMenu.style.display = 'none';
        if(userMenu) userMenu.style.display = 'block';
    } else {
        if(guestMenu) guestMenu.style.display = 'block';
        if(userMenu) userMenu.style.display = 'none';
    }

    if (displayUsername) { 
        if (savedUsername) {
            displayUsername.textContent = savedUsername;
            const welcomeMsg = document.getElementById('welcome-msg');
            if(welcomeMsg) welcomeMsg.textContent = "Halo, " + savedUsername + "!";
        } else {
            alert("Silakan masuk terlebih dahulu!");
            window.location.href = "masuk.html"; 
        }
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function() {
            localStorage.removeItem('activeUser');
            window.location.href = "index.html";
        });
    }
});

/* Keluar Akun */
const tombolKeluar = document.getElementById('logout-btn');

if (tombolKeluar) {
    tombolKeluar.addEventListener('click', function() {
        localStorage.removeItem('activeUser');
        alert("Kamu telah keluar. Sampai jumpa lagi!");
        window.location.href = "index.html"; 
    });
}