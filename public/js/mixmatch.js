// REVISI TOTAL: API Key di bawah ini sudah dipastikan menggunakan 'k' kecil di ujungnya!
const GEMINI_API_KEY = "AIzaSyDNj27dA9i7JJYSDS50quU7w2dIcHPlvJk"; 

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
    // JALUR EMAS: TEMBUS LEWAT BACKEND LARAVEL (BEBAS CORS & BEBAS CSRF)
    // ================================================================
    async function panggilGeminiAI(base64Image, namaItem) {
        const textContainer = document.getElementById("ai-text-tips-dynamic");
        textContainer.innerHTML = `<div class="ai-loading-pulsate"><i class="fa-solid fa-circle-notch fa-spin"></i> Menghubungi AI Outfit Planner via Server...</div>`;

        try {
            // Menembak rute lokal Laravel (Aman dari blokir CORS Browser)
            const response = await fetch('/api/gemini-recommendation', {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    image: base64Image,
                    name: namaItem
                })
            });

            const data = await response.json();
            
            if (response.ok && data.text) {
                // Sukses! Masukkan teks rekomendasi dari Gemini ke halaman web
                textContainer.innerHTML = data.text;
            } else {
                textContainer.innerHTML = `<p style="color: #d96a6a;"><i class="fa-solid fa-triangle-exclamation"></i> Server Menolak: ${data.error || 'Gagal memproses gambar'}</p>`;
            }

        } catch (error) {
            console.error("Fetch API Error Log:", error);
            textContainer.innerHTML = `<p style="color: #d96a6a;"><i class="fa-solid fa-triangle-exclamation"></i> Gagal terhubung ke endpoint server local.</p>`;
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
                        // 1. Ekstraksi warna dasar kain pakaian via ColorThief
                        const rgbDominan = colorThief.getColor(imgObj);
                        const hexDominan = rgbToHex(rgbDominan[0], rgbDominan[1], rgbDominan[2]);
                        document.getElementById("detected-color-indicator").style.backgroundColor = hexDominan;
                        document.getElementById("detected-color-name").textContent = hexDominan;
                        
                        // 2. Render Palet Rekomendasi Warna Pelengkap
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

                        // 3. Tembak Live Foto Unggahan ke Google Gemini AI
                        panggilGeminiAI(item.foto, item.nama);

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
                const bahuKiri = lm[11]; const bahuKanan = lm[12];
                const pinggangKiri = lm[23]; const pinggangKanan = lm[24];
                const pinggangTengah = { x: (pinggangKiri.x + pinggangKanan.x)/2, y: (pinggangKiri.y + pinggangKanan.y)/2 };

                const lebarBahuPixel = Math.abs(bahuKanan.x - bahuKiri.x) * canvasTop.width;
                const tinggiTorsoPixel = Math.abs(pinggangKiri.y - bahuKiri.y) * canvasTop.height;

                if (activeShirtImg && activeShirtImg.complete) {
                    const lebarBaju = lebarBahuPixel * 2.6; 
                    const tinggiBaju = tinggiTorsoPixel * 1.7;
                    const posX = ((bahuKiri.x + bahuKanan.x) / 2) * canvasTop.width - (lebarBaju / 2);
                    const posY = bahuKiri.y * canvasTop.height - (tinggiBaju * 0.32); // Posisi pas leher tubuh
                    ctxTop.drawImage(activeShirtImg, posX, posY, lebarBaju, tinggiBaju);
                }

                if (activePantsImg && activePantsImg.complete) {
                    const lebarCelana = lebarBahuPixel * 2.2;
                    const tinggiCelana = tinggiTorsoPixel * 2.6;
                    const posX = pinggangTengah.x * canvasBottom.width - (lebarCelana / 2);
                    const posY = pinggangTengah.y * canvasBottom.height - (tinggiCelana * 0.25); // Posisi pas pinggang
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
    btnCaptureFit?.addEventListener("click", () => {
        if (!isCameraOn) return;

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
        let historiPlanner = JSON.parse(localStorage.getItem("pickfit_captured_outfits")) || [];
        
        const packageOutfitBaru = {
            id: "fit_" + Date.now(),
            previewSnapshot: dataGambarOutfit,
            namaAtasan: document.getElementById("status-shirt").textContent,
            namaBawahan: document.getElementById("status-pants").textContent,
            tanggalJepret: new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
        };

        historiPlanner.unshift(packageOutfitBaru);
        localStorage.setItem("pickfit_captured_outfits", JSON.stringify(historiPlanner));

        alert("📸 Outfit Mix & Match berhasil diambil dan disimpan ke database Planner!");
        window.location.href = "/planner";
    });

    document.getElementById("btn-reset-fit")?.addEventListener("click", () => {
        activeShirtImg = null; activePantsImg = null;
        document.getElementById("slot-shirt-img").innerHTML = `<i class="fa-solid fa-shirt"></i>`;
        document.getElementById("slot-pants-img").innerHTML = `<i class="fa-solid fa-person-legs-reparations"></i>`;
        document.getElementById("status-shirt").textContent = "Belum memilih atasan";
        document.getElementById("status-pants").textContent = "Belum memilih bawahan";
        ctxTop?.clearRect(0, 0, canvasTop.width, canvasTop.height);
        ctxBottom?.clearRect(0, 0, canvasBottom.width, canvasBottom.height);
    });
});