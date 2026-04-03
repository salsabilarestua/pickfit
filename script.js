// Navigasi
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (nav) { 
        if (window.scrollY > 50) {
            nav.style.padding = '0.8rem 8%';
            nav.style.boxShadow = '0 5px 15px rgba(0,0,0,0.05)';
        } else {
            nav.style.padding = '1.5rem 8%';
            nav.style.boxShadow = 'none';
        }
    }
});

const menuBtn = document.getElementById('mobile-menu');
const navLinks = document.getElementById('nav-list');
if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active-nav');
    });
}

// Daftar & Masuk
document.addEventListener('DOMContentLoaded', () => {
    
    //Daftar
    const formDaftar = document.getElementById('form-registrasi');
    if (formDaftar) {
        formDaftar.onsubmit = function(e) {
            e.preventDefault();
            
            const nama = formDaftar.querySelector('input[type="text"]').value;
            const email = formDaftar.querySelector('input[type="email"]').value;
            const passInput = document.getElementById('pass-daftar');

            if (passInput.value.length < 8) {
                alert("⚠️ Password minimal 8 karakter!");
                return false;
            }

            const dataUser = { nama, email, password: passInput.value };
            localStorage.setItem('userPickFit', JSON.stringify(dataUser));

            alert("Daftar Berhasil! Sekarang silakan masuk.");
            window.location.href = "masuk.html"; 
            return false;
        };
    }

    //Masuk
    const formMasuk = document.getElementById('form-login');
    if (formMasuk) {
        formMasuk.onsubmit = function(e) {
            e.preventDefault();
            
            const emailIn = formMasuk.querySelector('input[type="email"]').value;
            const passIn = formMasuk.querySelector('input[type="password"]').value;

            if (passIn.length < 8) {
                alert("⚠️ Password minimal 8 karakter!");
                return false;
            }

            const storedUser = JSON.parse(localStorage.getItem('userPickFit'));

            if (storedUser && emailIn === storedUser.email && passIn === storedUser.password) {
                alert("Login Berhasil! Selamat datang.");
                window.location.href = "index.html";
            } else {
                alert("Email atau password salah / belum daftar!");
            }
            return false;
        };
    }
});