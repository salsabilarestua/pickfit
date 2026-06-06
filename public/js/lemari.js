const gridLemari = document.getElementById('grid-lemari');
const btnTambah = document.getElementById('btn-tambah');
const apiKeyRemoveBg = "XN53EsNF4LQT3TzJdM6qNCFx"; // API Key Remove.bg

// Menampilkan katalog baju di lemari
function tampilkanLemari() {
    if (!gridLemari) return;
    gridLemari.innerHTML = "";
    
    const koleksi = JSON.parse(localStorage.getItem('lemariPickFit')) || [];

    if (koleksi.length === 0) {
        gridLemari.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #888;">Lemarimu kosong nih!</p>`;
        return;
    }
    
    koleksi.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = "wardrobe-item";
        card.innerHTML = `
            <img src="${item.foto}" alt="${item.nama}">
            <p style="font-weight: 600; margin-top: 12px; margin-bottom: 5px;">${item.nama}</p>
            <div class="item-controls" style="justify-content: center;">
                <button class="btn-delete" onclick="hapusBaju(${index})" style="width: 100%;">Hapus Item</button>
            </div>
        `;
        gridLemari.appendChild(card);
    });
}

// Tambah baju
if (btnTambah) {
    btnTambah.addEventListener('click', async () => {
        const namaInput = document.getElementById('nama-baju');
        const fileInput = document.getElementById('foto-baju');
        
        if (!namaInput.value.trim() || fileInput.files.length === 0) {
            alert("Isi nama dan foto dulu ya!");
            return;
        }

        btnTambah.innerText = "Sedang Memproses...";
        btnTambah.disabled = true;

        const formData = new FormData();
        formData.append("image_file", fileInput.files[0]);
        formData.append("size", "auto");

        try {
            const response = await fetch("https://api.remove.bg/v1.0/removebg", {
                method: "POST",
                headers: { "X-Api-Key": apiKeyRemoveBg },
                body: formData
            });

            if (!response.ok) {
                throw new Error("Gagal menghapus background. Periksa kuota API Key kamu!");
            }

            const blob = await response.blob();
            const reader = new FileReader();
            
            reader.onloadend = () => {
                const koleksi = JSON.parse(localStorage.getItem('lemariPickFit')) || [];
                koleksi.push({ nama: namaInput.value.trim(), foto: reader.result });
                localStorage.setItem('lemariPickFit', JSON.stringify(koleksi));
                
                namaInput.value = "";
                fileInput.value = "";
                
                tampilkanLemari();
                alert("Berhasil ditambah!");
            };
            reader.readAsDataURL(blob);

        } catch (err) {
            alert(err.message || "Terjadi kesalahan koneksi!");
        } finally {
            btnTambah.innerText = "UNGGAH KE LEMARI";
            btnTambah.disabled = false;
        }
    });
}

// Menghapus baju
window.hapusBaju = function(index) {
    if (confirm("Hapus item ini dari lemari?")) {
        const koleksi = JSON.parse(localStorage.getItem('lemariPickFit')) || [];
        koleksi.splice(index, 1);
        localStorage.setItem('lemariPickFit', JSON.stringify(koleksi));
        tampilkanLemari();
    }
};

// Inisialisasi awal
document.addEventListener("DOMContentLoaded", () => {
    tampilkanLemari();
    
    const savedUsername = localStorage.getItem('activeUser');
    const displayUsername = document.getElementById('display-username');
    if (displayUsername && savedUsername) {
        displayUsername.textContent = savedUsername;
    }
});