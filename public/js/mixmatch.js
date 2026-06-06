const GROQ_API_KEY = "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"; 

document.addEventListener("DOMContentLoaded", () => {
    const video = document.getElementById("webcam");
    const canvasTop = document.getElementById("ar-canvas-top");
    const canvasBottom = document.getElementById("ar-canvas-bottom");
    const ctxTop = canvasTop?.getContext("2d");
    const ctxBottom = canvasBottom?.getContext("2d");
    
    const btnToggleCam = document.getElementById("btn-toggle-cam");
    const btnCaptureFit = document.getElementById("btn-capture-fit");
    const cameraLoading = document.getElementById("camera-loading");
    const containerLemari = document.getElementById("closet-items");
    
    let isCameraOn = false;
    let activeShirtImg = null;
    let activePantsImg = null;
    
    const colorThief = new ColorThief();

    function rgbToHex(r, g, b) {
        return "#" + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        }).join("").toUpperCase();
    }

    // ================================================================
    // JALUR EMAS: TEMBUS LEWAT BACKEND LARAVEL (OTOMATIS & BERSIH KATA GEMINI)
    // ================================================================
    async function panggilGroqAI() {
        const textContainer = document.getElementById("ai-text-tips-dynamic");
        
        const shirtEl = document.getElementById("status-shirt");
        const pantsEl = document.getElementById("status-pants");

        const namaAtasan = shirtEl ? shirtEl.textContent.trim() : "";
        const namaBawahan = pantsEl ? pantsEl.textContent.trim() : "";

        // Pengaman: Jangan tembak API jika pengguna belum selesai memilih atasan ATAU bawahan
        if (!namaAtasan || namaAtasan.includes("Belum memilih") || !namaBawahan || namaBawahan.includes("Belum memilih")) {
            textContainer.innerHTML = `<p style="color: #cca300; text-align:center;"><i class="fa-solid fa-info-circle"></i> Pasang dulu Atasan dan Bawahan di badan kamu untuk melihat rekomendasi OOTD otomatis! 😉</p>`;
            return;
        }

        // Tampilkan animasi loading otomatis bertuliskan Groq AI
        textContainer.innerHTML = `
            <div class="ai-loading-pulsate" style="text-align: center; padding: 20px;">
                <i class="fa-solid fa-circle-notch fa-spin" style="font-size: 24px; color: #595843;"></i> 
                <p style="margin-top: 10px;">Groq AI sedang menganalisis kombinasi ${namaAtasan} + ${namaBawahan}...</p>
            </div>`;

        const tokenCsrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

        try {
            const response = await fetch('/api/gemini-recommendation', {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "X-CSRF-TOKEN": tokenCsrf 
                },
                body: JSON.stringify({
                    atasan: namaAtasan,
                    bawahan: namaBawahan
                })
            });

            const data = await response.json();
            
            if (response.ok && data.text) {
                textContainer.innerHTML = data.text;
            } else {
                textContainer.innerHTML = `<p style="color: #d96a6a;"><i class="fa-solid fa-triangle-exclamation"></i> AI Menolak: ${data.error || 'Gagal menganalisis gaya.'}</p>`;
            }

        } catch (error) {
            console.error("Fetch API Error Log:", error);
            textContainer.innerHTML = `<p style="color: #d96a6a;"><i class="fa-solid fa-triangle-exclamation"></i> Gagal terhubung ke server local.</p>`;
        }
    }

    function muatLemari() {
        if (!containerLemari) return;
        containerLemari.innerHTML = "";
        let koleksi = JSON.parse(localStorage.getItem('lemariPickFit')) || [];

        if (koleksi.length === 0) {
            containerLemari.innerHTML = `<p class="empty-txt">Lemari kosong. Isi di menu Lemari dulu ya!</p>`;
            return;
        }

        koleksi.forEach((item) => {
            const card = document.createElement("div");
            card.className = "closet-item-card";
            card.innerHTML = `
                <div class="box-white-image"><img src="${item.foto}" alt="${item.nama}" crossorigin="anonymous"></div>
                <p class="item-label">${item.nama}</p>
            `;

            card.addEventListener("click", () => {
                document.querySelectorAll(".closet-item-card").forEach(el => el.classList.remove("selected-card"));
                card.classList.add("selected-card");

                const imgObj = new Image();
                imgObj.crossOrigin = "anonymous";
                imgObj.src = item.foto;

                const namaLower = item.nama.toLowerCase();
                const isBawahan = namaLower.includes("celana") || namaLower.includes("rok") || namaLower.includes("bawahan") || namaLower.includes("kulot");

                if (isBawahan) {
                    activePantsImg = imgObj;
                    document.getElementById("slot-pants-img").innerHTML = `<img src="${item.foto}" style="width:100%; height:100%; object-fit:contain;">`;
                    document.getElementById("status-pants").textContent = item.nama;
                } else {
                    activeShirtImg = imgObj;
                    document.getElementById("slot-shirt-img").innerHTML = `<img src="${item.foto}" style="width:100%; height:100%; object-fit:contain;">`;
                    document.getElementById("status-shirt").textContent = item.nama;
                }

                imgObj.onload = () => {
                    document.getElementById("ai-planner-box").style.display = "block";
                    try {
                        const rgbDominan = colorThief.getColor(imgObj);
                        const hexDominan = rgbToHex(rgbDominan[0], rgbDominan[1], rgbDominan[2]);
                        document.getElementById("detected-color-indicator").style.backgroundColor = hexDominan;
                        document.getElementById("detected-color-name").textContent = hexDominan;
                        
                        const listPalet = document.getElementById("recommended-colors-list");
                        listPalet.innerHTML = "";
                        const palet = [
                            { name: "Kontras", hex: rgbToHex(255 - rgbDominan[0], 255 - rgbDominan[1], 255 - rgbDominan[2]) },
                            { name: "Muted Match", hex: rgbToHex(Math.floor(rgbDominan[0]*0.65), Math.floor(rgbDominan[1]*0.65), Math.floor(rgbDominan[2]*0.65)) },
                            { name: "Neutral Bright", hex: "#F9F9F9" }
                        ];
                        palet.forEach(p => {
                            listPalet.innerHTML += `
                                <div class="palette-unit-block">
                                    <div class="palette-circle-color" style="background-color: ${p.hex}; border: 1px solid #ddd;"></div>
                                    <span class="palette-text-label">${p.name}</span>
                                </div>`;
                        });

                        // MODIFIKASI SELESAI: Panggil fungsi Groq AI secara otomatis saat item dipilih
                        panggilGroqAI();

                    } catch (e) {
                        console.error("Gagal mengekstrak elemen gambar: ", e);
                    }
                };
            });
            containerLemari.appendChild(card);
        });
    }

    muatLemari();

    // TRACKING ENGINE AR CAMERA CALIBRATION (ANTI-MENGGANTUNG)
    if (typeof Pose !== 'undefined' && video) {
        const pose = new Pose({
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
        });

        pose.setOptions({ modelComplexity: 1, smoothLandmarks: true, minDetectionConfidence: 0.5, minTrackingConfidence: 0.5 });

        pose.onResults((results) => {
            if (!isCameraOn || !ctxTop || !ctxBottom) return;

            if (canvasTop.width !== video.videoWidth) {
                canvasTop.width = video.videoWidth; canvasTop.height = video.videoHeight;
                canvasBottom.width = video.videoWidth; canvasBottom.height = video.videoHeight;
            }

            ctxTop.clearRect(0, 0, canvasTop.width, canvasTop.height);
            ctxBottom.clearRect(0, 0, canvasBottom.width, canvasBottom.height);

            if (results.poseLandmarks) {
                const lm = results.poseLandmarks;
                
                // AMANKAN KONDISI MIRROR: Balik koordinat X kiri dan kanan agar mengikuti layar webcam
                const bahuKiri = lm[12];  // Dibalik dengan indeks 12
                const bahuKanan = lm[11]; // Dibalik dengan indeks 11
                const pinggangKiri = lm[24];
                const pinggangKanan = lm[23];
                
                // Titik tengah absolut tubuh (Kunci utama anti-geser)
                const bahuTengahX = (bahuKiri.x + bahuKanan.x) / 2;
                const pinggangTengahX = (pinggangKiri.x + pinggangKanan.x) / 2;
                const pinggangTengahY = (pinggangKiri.y + pinggangKanan.y) / 2;

                const lebarBahuPixel = Math.abs(bahuKanan.x - bahuKiri.x) * canvasTop.width;
                const tinggiTorsoPixel = Math.abs(pinggangKiri.y - bahuKiri.y) * canvasTop.height;

                // ================================================================
                // KONTROL PRESISI ATASAN (BAJU) - TETAP DI TENGAH DAN PAS
                // ================================================================
                if (activeShirtImg && activeShirtImg.complete) {
                    const lebarBaju = lebarBahuPixel * 3.0; 
                    const tinggiBaju = tinggiTorsoPixel * 2.1;
                    
                    // Mengunci X di tengah tubuh secara absolut (Anti-Minggir)
                    const posX = bahuTengahX * canvasTop.width - (lebarBaju / 2);
                    const posY = bahuKiri.y * canvasTop.height - (tinggiBaju * 0.24);
                    
                    ctxTop.drawImage(activeShirtImg, posX, posY, lebarBaju, tinggiBaju);
                }

                // ================================================================
                // KONTROL PRESISI BAWAHAN (CELANA) - LEBIH LEBAR & LEBIH TURUN 0.2
                // ================================================================
                if (activePantsImg && activePantsImg.complete) {
                    // Lebar 3.1 sudah pas banget, kita pertahankan
                    const lebarCelana = lebarBahuPixel * 3.3;
                    const tinggiCelana = tinggiTorsoPixel * 2.9;
                    
                    // Mengunci posisi X tepat di tengah pinggang
                    const posX = pinggangTengahX * canvasBottom.width - (lebarCelana / 2);
                    
                    // KALIBRASI ULANG: Diubah dari 0.35 menjadi 0.12 agar celana turun pas di pinggang asli
                    const posY = pinggangTengahY * canvasBottom.height - (tinggiCelana * 0.16);
                    
                    ctxBottom.drawImage(activePantsImg, posX, posY, lebarCelana, tinggiCelana);
                }
            }
        });

        const cameraInstance = new Camera(video, {
            onFrame: async () => { if (isCameraOn) await pose.send({ image: video }); },
            width: 640, height: 480
        });

        btnToggleCam?.addEventListener("click", () => {
            if (!isCameraOn) {
                if (cameraLoading) cameraLoading.style.display = "flex";
                cameraInstance.start().then(() => {
                    isCameraOn = true;
                    if (cameraLoading) cameraLoading.style.display = "none";
                    video.style.display = "block";
                    if(btnCaptureFit) btnCaptureFit.style.display = "inline-flex";
                    document.getElementById("cam-icon").className = "fa-solid fa-video-slash";
                    document.getElementById("cam-text").textContent = "MATIKAN KAMERA";
                });
            } else {
                cameraInstance.stop();
                isCameraOn = false;
                video.style.display = "none";
                if(btnCaptureFit) btnCaptureFit.style.display = "none";
                document.getElementById("cam-icon").className = "fa-solid fa-video";
                document.getElementById("cam-text").textContent = "AKTIFKAN KAMERA";
                ctxTop.clearRect(0, 0, canvasTop.width, canvasTop.height);
                ctxBottom.clearRect(0, 0, canvasBottom.width, canvasBottom.height);
            }
        });
    }

    // CAPTURE & PINDAHKAN OUTFIT KE DASHBOARD PLANNER LOG
    // ================================================================
    // HUBUNGKAN SINKRONISASI JEPRETAN MIX & MATCH KE PLANNER OOTD
    // ================================================================
    btnCaptureFit?.addEventListener("click", () => {
        if (!isCameraOn) return;

        // 1. Pengaman: Pastikan pengguna sudah memilih kedua pakaian sebelum menjepret
        const shirtText = document.getElementById("status-shirt")?.textContent || "";
        const pantsText = document.getElementById("status-pants")?.textContent || "";

        if (shirtText.includes("Belum memilih") || pantsText.includes("Belum memilih") || !activeShirtImg || !activePantsImg) {
            alert("⚠️ Lengkapi kombinasi Atasan dan Bawahan kamu terlebih dahulu sebelum menjepret!");
            return;
        }

        // 2. Proses pembuatan gambar snapshot (untuk histori visual jika diperlukan)
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = video.videoWidth; tempCanvas.height = video.videoHeight;
        const tempCtx = tempCanvas.getContext("2d");

        tempCtx.translate(tempCanvas.width, 0);
        tempCtx.scale(-1, 1);
        tempCtx.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);
        tempCtx.setTransform(1, 0, 0, 1, 0, 0);

        tempCtx.drawImage(canvasBottom, 0, 0);
        tempCtx.drawImage(canvasTop, 0, 0);
        const dataGambarOutfit = tempCanvas.toDataURL("image/jpeg");

        // 3. JALUR UTAMA: Simpan daftar URL gambar asli ke 'koleksiOutfit' untuk kalender Planner
        let koleksiOutfit = JSON.parse(localStorage.getItem('koleksiOutfit')) || [];
        
        const outfitBaruKePlanner = {
            id: "outfit_" + Date.now(),
            // Memasukkan array source gambar baju dan celana yang sedang aktif dipakai
            items: [activeShirtImg.src, activePantsImg.src] 
        };

        koleksiOutfit.push(outfitBaruKePlanner);
        localStorage.setItem('koleksiOutfit', JSON.stringify(koleksiOutfit));


        // 4. JALUR CADANGAN: Pertahankan data snapshot lama untuk kebutuhan log histori/fitur lain jika ada
        let historiPlanner = JSON.parse(localStorage.getItem("pickfit_captured_outfits")) || [];
        const packageOutfitBaru = {
            id: "fit_" + Date.now(),
            previewSnapshot: dataGambarOutfit,
            namaAtasan: shirtText,
            namaBawahan: pantsText,
            tanggalJepret: new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
        };
        historiPlanner.unshift(packageOutfitBaru);
        localStorage.setItem("pickfit_captured_outfits", JSON.stringify(historiPlanner));

        // 5. Beri notifikasi dan arahkan user langsung ke halaman Planner
        alert("📸 Hasil jepretan kombinasi baju berhasil disimpan! Silakan pilih tanggal pada kalender Planner kamu.");
        window.location.href = "/planner";
    });
});