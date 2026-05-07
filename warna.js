function selectPalette(name) {
    const messageBox = document.getElementById('feedback-message');
    
    // Memberikan Feedback Visual kepada pengguna
    messageBox.textContent = `Palet "${name}" berhasil dipilih untuk outfit kamu!`;
    messageBox.classList.remove('hidden');

    // Menghilangkan pesan setelah 3 detik (Feedback sementara)
    setTimeout(() => {
        messageBox.classList.add('hidden');
    }, 3000);

    console.log("User memilih palet: " + name);
}

//Navbar
document.addEventListener('DOMContentLoaded', () => {
    
    const menu = document.getElementById('mobile-menu');
    const menuLinks = document.getElementById('nav-list');

    if (menu && menuLinks) {
        menu.addEventListener('click', () => {
            menuLinks.classList.toggle('active');
            
            menu.classList.toggle('is-active');
            console.log("Menu diklik!"); 
        });
    } else {
        console.error("EROR: ID 'mobile-menu' atau 'nav-list' tidak ditemukan di HTML!");
    }
});


const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('#nav-list');

menu.addEventListener('click', function() {
    menuLinks.classList.toggle('active');
});

