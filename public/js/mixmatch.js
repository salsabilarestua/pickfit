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

    // Hit API Groq
    async function panggilGroqAI() {
        const textContainer = document.getElementById("ai-text-tips-dynamic");
        if (!textContainer) return;
        
        const shirtEl = document.getElementById("status-shirt");
        const pantsEl = document.getElementById("status-pants");

        const namaAtasan = shirtEl ? shirtEl.textContent.trim() : "";
        const namaBawahan = pantsEl ? pantsEl.textContent.trim() : "";

        // Validasi input
        if (!namaAtasan || namaAtasan.includes("Belum memilih") || !namaBawahan || namaBawahan.includes("Belum memilih")) {
            textContainer.innerHTML = `<p style="color: #cca300; text-align: center;"><i class="fa-solid fa-info-circle"></i> Pasang dulu Atasan dan Bawahan di badan kamu untuk melihat rekomendasi OOTD otomatis! 😉</p>`;
            return;
        }

        // Loading state
        textContainer.innerHTML = `
            <div class="ai-loading-pulsate" style="text-align: center; padding: 20px;">
                <i class="fa-solid fa-circle-notch fa-spin" style="font-size: 24px; color: #595843;"></i> 
                <p style="margin-top: 10px;">Groq AI sedang menganalisis kombinasi ${namaAtasan} + ${namaBawahan}...</p>
            </div>`;

        const tokenCsrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

        try {
            const response = await fetch('/api/groq-recommendation', {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "X-CSRF-TOKEN": tokenCsrf 
                },
                body: JSON.stringify({ atasan: namaAtasan, bawahan: namaBawahan })
            });

            const data = await response.json();
            
            if (response.ok && data.text) {
                textContainer.innerHTML = data.text;
            } else {
                textContainer.innerHTML = `<p style="color: #d96a6a;"><i class="fa-solid fa-triangle-exclamation"></i> AI Menolak: ${data.error || 'Gagal menganalisis gaya.'}</p>`;
            }
        } catch (error) {
            console.error("Fetch API Error:", error);
            textContainer.innerHTML = `<p style="color: #d96a6a;"><i class="fa-solid fa-triangle-exclamation"></i> Gagal terhubung ke server local.</p>`;
        }
    }

    // Muat data lemari
    function muatLemari() {
        if (!containerLemari) return;
        containerLemari.innerHTML = "";
        const koleksi = JSON.parse(localStorage.getItem('lemariPickFit')) || [];

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

            // Event klik item lemari
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

                // Ekstrak warna dominan
                imgObj.onload = () => {
                    const plannerBox = document.getElementById("ai-planner-box");
                    if (plannerBox) plannerBox.style.display = "block";
                    
                    try {
                        const rgbDominan = colorThief.getColor(imgObj);
                        const hexDominan = rgbToHex(rgbDominan[0], rgbDominan[1], rgbDominan[2]);
                        document.getElementById("detected-color-indicator").style.backgroundColor = hexDominan;
                        document.getElementById("detected-color-name").textContent = hexDominan;
                        
                        const listPalet = document.getElementById("recommended-colors-list");
                        if (listPalet) {
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
                        }

                        panggilGroqAI();
                    } catch (e) {
                        console.error("Gagal ekstrak warna: ", e);
                    }
                };
            });
            containerLemari.appendChild(card);
        });
    }

    muatLemari();

    // Kamera AR 
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
                
                const bahuKiri = lm[12];  
                const bahuKanan = lm[11]; 
                const pinggangKiri = lm[24];
                const pinggangKanan = lm[23];
                
                const bahuTengahX = (bahuKiri.x + bahuKanan.x) / 2;
                const pinggangTengahX = (pinggangKiri.x + pinggangKanan.x) / 2;
                const pinggangTengahY = (pinggangKiri.y + pinggangKanan.y) / 2;

                const lebarBahuPixel = Math.abs(bahuKanan.x - bahuKiri.x) * canvasTop.width;
                const tinggiTorsoPixel = Math.abs(pinggangKiri.y - bahuKiri.y) * canvasTop.height;

                // Render Baju
                if (activeShirtImg && activeShirtImg.complete) {
                    const lebarBaju = lebarBahuPixel * 3.0; 
                    const tinggiBaju = tinggiTorsoPixel * 2.1;
                    const posX = bahuTengahX * canvasTop.width - (lebarBaju / 2);
                    const posY = bahuKiri.y * canvasTop.height - (tinggiBaju * 0.24);
                    
                    ctxTop.drawImage(activeShirtImg, posX, posY, lebarBaju, tinggiBaju);
                }

                // Render Celana
                if (activePantsImg && activePantsImg.complete) {
                    const lebarCelana = lebarBahuPixel * 3.3;
                    const tinggiCelana = tinggiTorsoPixel * 2.9;
                    const posX = pinggangTengahX * canvasBottom.width - (lebarCelana / 2);
                    const posY = pinggangTengahY * canvasBottom.height - (tinggiCelana * 0.16);
                    
                    ctxBottom.drawImage(activePantsImg, posX, posY, lebarCelana, tinggiCelana);
                }
            }
        });

        const cameraInstance = new Camera(video, {
            onFrame: async () => { if (isCameraOn) await pose.send({ image: video }); },
            width: 640, height: 480
        });

        // Kontrol Sakelar Kamera
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

    // Ambil Snapshot & Simpan ke Planner
    btnCaptureFit?.addEventListener("click", () => {
        if (!isCameraOn) return;

        const shirtText = document.getElementById("status-shirt")?.textContent || "";
        const pantsText = document.getElementById("status-pants")?.textContent || "";

        if (shirtText.includes("Belum memilih") || pantsText.includes("Belum memilih") || !activeShirtImg || !activePantsImg) {
            alert("⚠️ Lengkapi kombinasi Atasan dan Bawahan kamu terlebih dahulu sebelum menjepret!");
            return;
        }

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

        // Simpan kalender
        let koleksiOutfit = JSON.parse(localStorage.getItem('koleksiOutfit')) || [];
        koleksiOutfit.push({
            id: "outfit_" + Date.now(),
            items: [activeShirtImg.src, activePantsImg.src] 
        });
        localStorage.setItem('koleksiOutfit', JSON.stringify(koleksiOutfit));

        // Simpan ke histori snapshot
        let historiPlanner = JSON.parse(localStorage.getItem("pickfit_captured_outfits")) || [];
        historiPlanner.unshift({
            id: "fit_" + Date.now(),
            previewSnapshot: dataGambarOutfit,
            namaAtasan: shirtText,
            namaBawahan: pantsText,
            tanggalJepret: new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
        });
        localStorage.setItem("pickfit_captured_outfits", JSON.stringify(historiPlanner));

        alert("📸 Hasil jepretan kombinasi baju berhasil disimpan! Silakan pilih tanggal pada kalender Planner kamu.");
        window.location.href = "/planner";
    });
});