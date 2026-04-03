// Navbar Scroll Interaction
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 50) {
        nav.style.padding = '0.8rem 8%';
        nav.style.boxShadow = '0 5px 15px rgba(0,0,0,0.05)';
    } else {
        nav.style.padding = '1.5rem 8%';
        nav.style.boxShadow = 'none';
    }
});

// Mobile Menu
const menuBtn = document.getElementById('mobile-menu');
const navLinks = document.getElementById('nav-list');

menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active-nav'); // Kamu bisa tambah class CSS .active-nav {display: flex}
    alert("Menu Navigasi diklik!");
});

// Smooth Scroll
document.querySelectorAll('.category-item').forEach(item => {
    item.addEventListener('click', () => {
        const cat = item.getAttribute('data-name');
        console.log("Kategori dipilih: " + cat);
    });
});

//Login dan Daftar
const btnLogin = document.querySelector('.btn-login');
const btnSignin = document.querySelector('.btn-signin');

btnLogin.addEventListener('click', (e) => {
    e.preventDefault();
    const email = prompt("Masukkan Email:");
    const password = prompt("Masukkan Password:");
    
    // verif
    if(email && password) {
        alert("Verifikasi berhasil! Selamat datang di PickFit.");
    } else {
        alert("Login Gagal: Email atau Password salah."); // Pesan eror di flowchart
    }
});