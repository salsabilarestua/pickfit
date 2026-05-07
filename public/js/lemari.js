const gridLemari = document.getElementById('grid-lemari');
const btnTambah = document.getElementById('btn-tambah');

function tampilkanLemari() {
    if (!gridLemari) return;
    gridLemari.innerHTML = "";
    
    let koleksi = JSON.parse(localStorage.getItem('lemariPickFit')) || [];

    if (koleksi.length === 0) {
        gridLemari.innerHTML = "<p style='grid-column: 1/-1; text-align:center;'>Lemarimu kosong nih!</p>";
        return;
    }
    
    koleksi.forEach((item, index) => {
        if (item.status === 'jemur' || !item.status) {
            item.status = 'siap'; 
        }
        
        const status = item.status; 
        const card = document.createElement('div');
        card.className = "wardrobe-item";
        card.innerHTML = `
            <img src="${item.foto}" alt="${item.nama}">
            <p style="font-weight:600; margin-top:12px; margin-bottom: 5px;">${item.nama}</p>
        
            <div class="item-controls">
                <div class="status-badge status-${status}" onclick="toggleStatus(${index})" style="cursor:pointer">
                    ${status === 'siap' ? 'Siap Pakai' : 'Sedang Dicuci'}
                </div>
                <button class="btn-delete" onclick="hapusBaju(${index})">Hapus Item</button>
            </div>
        `;
        gridLemari.appendChild(card);
    });

    localStorage.setItem('lemariPickFit', JSON.stringify(koleksi));
}

if (btnTambah) {
    btnTambah.addEventListener('click', async () => {
        const nama = document.getElementById('nama-baju').value;
        const fileInput = document.getElementById('foto-baju');
        const statusBaju = document.getElementById('status-baju') ? document.getElementById('status-baju').value : 'Siap Pakai';
        
        const statusKey = (statusBaju === "Siap Pakai") ? "siap" : "cuci";
        const apiKey = "XN53EsNF4LQT3TzJdM6qNCFx";

        if (!nama || fileInput.files.length === 0) {
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
                headers: { "X-Api-Key": apiKey },
                body: formData
            });

            if (response.ok) {
                const blob = await response.blob();
                const reader = new FileReader();
                reader.onloadend = () => {
                    const koleksi = JSON.parse(localStorage.getItem('lemariPickFit')) || [];
                    koleksi.push({ nama, foto: reader.result, status: statusKey });
                    localStorage.setItem('lemariPickFit', JSON.stringify(koleksi));
                    
                    // Reset form
                    document.getElementById('nama-baju').value = "";
                    fileInput.value = "";
                    
                    tampilkanLemari();
                    alert("Berhasil ditambah!");
                };
                reader.readAsDataURL(blob);
            } else {
                alert("Gagal hapus background. Cek kuota API Key kamu!");
            }
        } catch (err) {
            alert("Terjadi kesalahan koneksi!");
        } finally {
            btnTambah.innerText = "UNGGAH KE LEMARI";
            btnTambah.disabled = false;
        }
    });
}

window.toggleStatus = function(index) {
    let koleksi = JSON.parse(localStorage.getItem('lemariPickFit')) || [];
    
    koleksi[index].status = (koleksi[index].status === 'siap') ? 'cuci' : 'siap';
    
    localStorage.setItem('lemariPickFit', JSON.stringify(koleksi));
    tampilkanLemari();
};

window.hapusBaju = function(index) {
    if(confirm("Hapus item ini dari lemari?")) {
        let koleksi = JSON.parse(localStorage.getItem('lemariPickFit')) || [];
        koleksi.splice(index, 1);
        localStorage.setItem('lemariPickFit', JSON.stringify(koleksi));
        tampilkanLemari();
    }
};

document.addEventListener("DOMContentLoaded", function() {
    tampilkanLemari();
    const savedUsername = localStorage.getItem('activeUser');
    const displayUsername = document.getElementById('display-username');
    if (displayUsername && savedUsername) {
        displayUsername.textContent = savedUsername;
    }
});