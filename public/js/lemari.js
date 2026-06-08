const API_URL = "/index.php/api/wardrobe"; 

const REMOVE_BG_API_KEY = "M6HP1HwvtoXuJgFfB1Msv4NT"; 

document.addEventListener("DOMContentLoaded", () => {
    tampilkanLemari();

    const semuaTombol = Array.from(document.querySelectorAll("button"));
    const tombolUnggah = semuaTombol.find(btn => btn.innerText.trim() === "UNGGAH KE LEMARI");

    if (tombolUnggah) {
        console.log("Tombol Unggah Lemari Aktif dengan Official Remove.bg!");
        
        tombolUnggah.addEventListener("click", async (e) => {
            e.preventDefault();
            
            const namaInput = document.querySelector('input[type="text"]');
            const fileInput = document.querySelector('input[type="file"]');
            const kategoriSelect = document.querySelector('select');

            if (!namaInput || !namaInput.value.trim()) {
                alert("Nama baju wajib diisi!");
                return;
            }
            if (!fileInput || !fileInput.files[0]) {
                alert("Silakan pilih foto baju terlebih dahulu!");
                return;
            }

            const file = fileInput.files[0];
            tombolUnggah.innerText = "MEMOTONG BACKGROUND...";
            tombolUnggah.disabled = true;

            let finalBase64Image = "";

            try {
                if (!REMOVE_BG_API_KEY || REMOVE_BG_API_KEY === "MASUKKAN_API_KEY_KAMU_DISINI") {
                    console.warn("Menggunakan gambar asli karena API Key belum diisi.");
                    finalBase64Image = await convertToBase64(file);
                } else {
                    //  REMOVE.BG 
                    const formData = new FormData();
                    formData.append("image_file", file);
                    formData.append("size", "auto");

                    const resRemoveBg = await fetch("https://api.remove.bg/v1.0/removebg", {
                        method: "POST",
                        headers: {
                            "X-Api-Key": REMOVE_BG_API_KEY
                        },
                        body: formData
                    });

                    if (resRemoveBg.ok) {
                        const blobGbr = await resRemoveBg.blob();
                        finalBase64Image = await convertBlobToBase64(blobGbr);
                        console.log("Remove.bg Sukses Memotong Background!");
                    } else {
                        console.error("Gagal potong background (Kuota habis/Error). Menggunakan gambar asli.");
                        finalBase64Image = await convertToBase64(file);
                    }
                }

                tombolUnggah.innerText = "MENYIMPAN KE DATABASE...";

                const response = await fetch(API_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({
                        name: namaInput.value.trim(),
                        category: kategoriSelect ? kategoriSelect.value : "Atasan",
                        image_url: finalBase64Image 
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    alert("📸 Sukses! Baju berhasil ditambahkan ke lemari!");
                    if (namaInput) namaInput.value = "";
                    if (fileInput) fileInput.value = "";
                    tampilkanLemari();
                } else {
                    alert("Gagal menyimpan ke MySQL: " + (data.error || "Terjadi kesalahan backend"));
                }

            } catch (err) {
                console.error("Error Sistem:", err);
                try {
                    finalBase64Image = await convertToBase64(file);
                    await fetch(API_URL, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            name: namaInput.value.trim(),
                            category: kategoriSelect ? kategoriSelect.value : "Atasan",
                            image_url: finalBase64Image
                        })
                    });
                    alert("📸 Sukses disimpan! (Catatan: Menggunakan gambar asli karena server API sibuk)");
                    if (namaInput) namaInput.value = "";
                    if (fileInput) fileInput.value = "";
                    tampilkanLemari();
                } catch (subErr) {
                    alert("Terjadi kendala koneksi ke server database.");
                }
            } finally {
                tombolUnggah.innerText = "UNGGAH KE LEMARI";
                tombolUnggah.disabled = false;
            }
        });
    }
});

function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

function convertBlobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}


async function tampilkanLemari() {
    const mainContainer = document.querySelector(".container-lemari") || document.querySelector("main") || document.body;
    
    if (mainContainer) {
        mainContainer.style.display = "flex";
        mainContainer.style.flexDirection = "column";
        mainContainer.style.minHeight = "80vh";
    }

    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Gagal mengambil data");
        
        const koleksi = await response.json();
        const errorMsg = document.getElementById("db-error-msg");
        if (errorMsg) errorMsg.remove();

        let grid = document.getElementById("wardrobe-grid");
        if (!grid) {
            grid = document.createElement("div");
            grid.id = "wardrobe-grid";
            grid.style.display = "flex";
            grid.style.flexWrap = "wrap";
            grid.style.justifyContent = "center";
            grid.style.gap = "20px";
            grid.style.marginTop = "40px";
            grid.style.marginBottom = "50px"; 
            grid.style.padding = "0 15px";
            
            const footerElement = document.querySelector("footer");
            if (footerElement && mainContainer) {
                mainContainer.insertBefore(grid, footerElement);
                footerElement.style.marginTop = "auto";
                footerElement.style.padding = "20px 0";
            } else {
                mainContainer.appendChild(grid);
            }
        }

        grid.innerHTML = "";

        if (koleksi.length === 0) {
            grid.innerHTML = `<p style="text-align:center; width:100%; color:#888; font-size:14px; padding: 40px 0;">Lemarimu kosong nih! Yuk tambah koleksi baju barumu di atas.</p>`;
            return;
        }

        koleksi.forEach(item => {
            const card = document.createElement("div");
            card.className = "card-baju";
            card.style.position = "relative";
            card.style.backgroundColor = "#fff";
            card.style.borderRadius = "16px";
            card.style.padding = "20px";
            card.style.width = "180px";
            card.style.boxShadow = "0 4px 15px rgba(0,0,0,0.04)";
            card.style.textAlign = "center";
            card.style.border = "1px solid #f3f3f3";

            card.innerHTML = `
                <button onclick="hapusBaju(${item.id})" style="position: absolute; top: 12px; right: 12px; background: #ffe6e6; color: #ff4d4d; border: none; border-radius: 50%; width: 26px; height: 26px; font-weight: bold; cursor: pointer; font-size: 14px; display: flex; align-items: center; justify-content: center; z-index: 10;">×</button>
                
                <div style="width: 100%; height: 160px; display: flex; align-items: center; justify-content: center; overflow: hidden; border-radius: 8px; margin-bottom: 12px;">
                    <img src="${item.image_url}" alt="${item.name}" style="max-width: 100%; max-height: 100%; object-fit: contain;">
                </div>
                <h4 style="margin: 0; font-size: 16px; font-weight: bold; color: #111;">${item.name}</h4>
                <p style="color: #999; font-size: 13px; margin: 4px 0 0 0;">${item.category}</p>
            `;
            grid.appendChild(card);
        });

    } catch (err) {
        console.error("Gagal memuat lemari:", err);
        const footerElement = document.querySelector("footer");
        if (footerElement) footerElement.style.marginTop = "auto";
    }
}

//  MENGHAPUS DATA BAJU
async function hapusBaju(id) {
    if (!confirm("Apakah kamu yakin ingin menghapus pakaian ini dari lemari?")) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
            headers: {
                "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || "",
                "Accept": "application/json"
            }
        });

        if (response.ok) {
            alert("Pakaian berhasil dihapus!");
            tampilkanLemari(); 
        } else {
            alert("Gagal menghapus pakaian.");
        }
    } catch (err) {
        console.error("Error Hapus:", err);
    }
}