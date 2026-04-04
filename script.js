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
    }

/* FITUR LEMARI */
const gridLemari = document.getElementById('grid-lemari');
const btnTambah = document.getElementById('btn-tambah');

function tampilkanLemari() {
    if (!gridLemari) return;
    gridLemari.innerHTML = "";
    const koleksi = JSON.parse(localStorage.getItem('lemariPickFit')) || [];

    if (koleksi.length === 0) {
        gridLemari.innerHTML = "<p style='grid-column: 1/-1; text-align:center;'>Lemarimu kosong nih!</p>";
        return;
    }
    
    koleksi.forEach((item, index) => {
        const status = item.status || 'siap';
        const card = document.createElement('div');
        card.className = "wardrobe-item";
        card.innerHTML = `
            <img src="${item.foto}" alt="${item.nama}">
            <p style="font-weight:600; margin-top:12px; margin-bottom: 5px;">${item.nama}</p>
        
            <div class="item-controls">
                <div class="status-badge status-${status}" onclick="toggleStatus(${index})">
                    ${status === 'siap' ? 'Siap Pakai' : status === 'cuci' ? 'Cuci' : 'Jemur'}
                </div>
                <button class="btn-delete" onclick="hapusBaju(${index})">Hapus Item</button>
            </div>
        `;
        gridLemari.appendChild(card);
    });
}

if (btnTambah) {
    btnTambah.addEventListener('click', async () => {
        const nama = document.getElementById('nama-baju').value;
        const fileInput = document.getElementById('foto-baju');
        const apiKey = "XN53EsNF4LQT3TzJdM6qNCFx";

        if (!nama || fileInput.files.length === 0) {
            alert("Isi nama dan foto");
            return;
        }

        const formData = new FormData();
        formData.append("image_file", fileInput.files[0]);
        formData.append("size", "auto");

        alert("AI lagi kerja, tunggu sebentar...");

        try {
            const response = await fetch("https://api.remove.bg/v1.0/removebg", {
                method: "POST",
                headers: { "X-Api-Key": apiKey },
                body: formData
            });

            if (response.ok) {
                const blob = await response.blob();
                const reader = new FileReader();
                reader.onloadend = () => {
                    const koleksi = JSON.parse(localStorage.getItem('lemariPickFit')) || [];
                    koleksi.push({ nama, foto: reader.result, status: 'siap' });
                    localStorage.setItem('lemariPickFit', JSON.stringify(koleksi));
                    tampilkanLemari();
                    alert("Item berhasil ditambah!");
                };
                reader.readAsDataURL(blob);
            } else {
                alert("Gagal hapus background. Cek API Key!");
            }
        } catch (err) {
            alert("Error koneksi!");
        }
    });
}

window.toggleStatus = function(index) {
    let koleksi = JSON.parse(localStorage.getItem('lemariPickFit')) || [];
    const statusCycle = ['siap', 'cuci', 'jemur'];
    
    let currentStatus = koleksi[index].status || 'siap';
    let nextIndex = (statusCycle.indexOf(currentStatus) + 1) % statusCycle.length;
    
    koleksi[index].status = statusCycle[nextIndex];
    
    localStorage.setItem('lemariPickFit', JSON.stringify(koleksi));
    tampilkanLemari();

    const currentPath = window.location.pathname.split("/").pop();
    const navLinks = document.querySelectorAll('.nav-container a');

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (currentPath === linkPath) {
            link.classList.add('active');
        }
        if (currentPath === "" && linkPath === "index.html") {
            link.classList.add('active');
        }
    });
};

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