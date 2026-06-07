const gridLemari = document.getElementById('grid-lemari') || document.getElementById('daftarBaju') || document.getElementById('lemari-grid');
const btnTambah = document.getElementById('btn-tambah');
const apiKeyRemoveBg = "XN53EsNF4LQT3TzJdM6qNCFx"; 
const API_URL = "http://localhost:3000/api/wardrobe"; 

// TAMPILKAN KATALOG LEMARI
async function tampilkanLemari() {
    if (!gridLemari) return;
    gridLemari.innerHTML = "";
    
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`Status: ${response.status}`);
        
        const koleksi = await response.json();

        if (koleksi.length === 0) {
            gridLemari.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #888; padding: 20px;">Lemarimu kosong nih! Yuk tambah koleksi baru.</p>`;
            return;
        }
        
        koleksi.forEach((item) => {
            const card = document.createElement('div');
            card.className = "wardrobe-item";
            card.style = "background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 15px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.02);";
            
            card.innerHTML = `
                <div style="width: 100%; height: 180px; display: flex; align-items: center; justify-content: center; overflow: hidden; background: #f8fafc; border-radius: 8px;">
                    <img src="${item.image_url}" alt="${item.name}" style="max-width: 100%; max-height: 100%; object-fit: contain;">
                </div>
                <p style="font-weight: 600; margin-top: 12px; margin-bottom: 8px; color: #1e293b;">${item.name}</p>
                <div class="item-controls" style="display: flex; justify-content: center;">
                    <button class="btn-delete" onclick="window.hapusBaju(${item.id})" style="width: 100%; background: #fee2e2; color: #dc2626; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-weight: 600; transition: 0.2s;" onmouseover="this.style.background='#fca5a5'" onmouseout="this.style.background='#fee2e2'">Hapus Item</button>
                </div>
            `;
            gridLemari.appendChild(card);
        });
    } catch (err) {
        console.error("❌ Gagal memuat data dari MySQL:", err);
        gridLemari.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: red; font-weight: 600; padding: 20px;">⚠️ Gagal terhubung ke database server!</p>`;
    }
}

//  TAMBAH BAJU BARU (REMOVE BG) 
if (btnTambah) {
    btnTambah.addEventListener('click', async () => {
        const namaInput = document.getElementById('nama-baju');
        const fileInput = document.getElementById('foto-baju');
        const kategoriSelect = document.getElementById('kategori-baju') || { value: 'Atasan' }; 
        
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
            
            reader.onloadend = async () => {
                try {
                    const responseDb = await fetch(API_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            name: namaInput.value.trim(),
                            category: kategoriSelect.value || "Atasan",
                            image_url: reader.result
                        })
                    });

                    if (responseDb.ok) {
                        namaInput.value = "";
                        fileInput.value = "";
                        tampilkanLemari(); 
                        alert("Berhasil ditambah ke database MySQL!");
                    } else {
                        alert("Gagal menyimpan ke database server! Periksa struktur rute POST backend kamu.");
                    }
                } catch (dbErr) {
                    alert("Koneksi server database terputus!");
                }
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

// HAPUS ITEM BAJU FROM DB 
window.hapusBaju = async function(id) {
    if (confirm("Hapus item ini dari lemari?")) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                tampilkanLemari();
                alert("Item berhasil dihapus dari MySQL!");
            } else {
                alert("Gagal menghapus dari database server.");
            }
        } catch (err) {
            alert("Koneksi server database gagal!");
        }
    }
};

document.addEventListener("DOMContentLoaded", () => {
    tampilkanLemari(); 
});