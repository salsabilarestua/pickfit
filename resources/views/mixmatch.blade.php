<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>PickFit - Mix & Match</title>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="{{ asset('css/mixmatch.css') }}">
</head>
<body class="mixmatch-page">

    <nav class="navbar">
        <div class="nav-container">
            <a href="/" class="logo">Pick<span style="color:#c9a38d;">Fit</span></a>
            <ul class="nav-links">
                <li><a href="/">Beranda</a></li>
                <li><a href="/lemari">Lemari</a></li>
                <li><a href="/mixmatch" class="active">Mix & Match</a></li>
                <li><a href="/planner">Planner</a></li>
            </ul>
        </div>
    </nav>

    <div class="container-mixmatch">
        <div class="grid-mixmatch">
            
            <div class="card-section camera-side">
                <div class="section-header-text">
                    <h2 class="title-serif"><i class="fa-solid fa-camera"></i>Try-On <span>Camera</span></h2>
                    <p class="subtitle">Arahkan kamera ke badan untuk mencoba kombinasi baju & celana sekaligus</p>
                </div>
                
                <div class="video-box-container">
                    <div id="camera-loading" class="camera-placeholder" style="display: none;">
                        <i class="fa-solid fa-spinner fa-spin fa-2x"></i>
                        <p style="margin-top: 10px;">Menghubungkan Kamera AR...</p>
                    </div>
                    <video id="webcam" autoplay playsinline muted></video>
                    <canvas id="ar-canvas-bottom"></canvas>
                    <canvas id="ar-canvas-top"></canvas>
                </div>

                <div class="camera-control-area" style="display: flex; gap: 15px; justify-content: center; margin-top: 20px;">
                    <button id="btn-toggle-cam" class="btn-black-elipse">
                        <i id="cam-icon" class="fa-solid fa-video"></i> <span id="cam-text">AKTIFKAN KAMERA</span>
                    </button>
                    <button id="btn-capture-fit" class="btn-capture-snapshot" style="display: none;">
                        <i class="fa-solid fa-camera-retro"></i> JEPRET & SIMPAN KE PLANNER
                    </button>
                </div>
            </div>

            <div class="card-section control-side">
                <div class="section-header-text">
                    <h2 class="title-serif"><i class="fa-solid fa-wand-magic-sparkles"></i> AI <span>Outfit</span></h2>
                    <p class="subtitle">Pilih item pakaian di lemarimu untuk mulai Try-On</p>
                </div>

                <div class="closet-section">
                    <h3 class="panel-title">Pakaian di Lemari Kamu</h3>
                    <div id="closet-items" class="closet-vertical-grid"></div>
                </div>

                <div class="status-section">
                    <div class="status-header-flex">
                        <h3 class="panel-title">Pakaian yang dipilih</h3>
                        <span id="btn-reset-fit" class="reset-link"><i class="fa-solid fa-rotate-left"></i> Reset</span>
                    </div>
                    <div class="status-flex-slots">
                        <div class="slot-box">
                            <div id="slot-shirt-img" class="slot-thumbnail-empty"><i class="fa-solid fa-shirt"></i></div>
                            <span id="status-shirt" class="slot-label">Belum memilih atasan</span>
                        </div>
                        <div class="slot-box">
                            <div id="slot-pants-img" class="slot-thumbnail-empty"><i class="fa-solid fa-person-legs-reparations"></i></div>
                            <span id="status-pants" class="slot-label">Belum memilih bawahan</span>
                        </div>
                    </div>
                </div>
            </div> </div> <div id="ai-planner-box" class="ai-detector-panel-wide" style="display: none; margin-top: 25px;">
            <div class="panel-header-ai">
                <h3><i class="fa-solid fa-microchip"></i> AI Rekomendasi Warna & Kecocokan</h3>
            </div>
            
            <div class="detector-body-wide">
                <div class="color-meta-row" style="display: flex; align-items: center; gap: 20px; margin-bottom: 20px; flex-wrap: wrap;">
                    <div class="dominant-color-row" style="display: flex; align-items: center; gap: 10px;">
                        <span class="ai-section-sub-title" style="font-weight: 600;">Warna Dasar:</span>
                        <div id="detected-color-indicator" class="color-circle-large"></div>
                        <span class="color-name-text" id="detected-color-name" style="font-family: monospace; font-size: 14px;">#------</span>
                    </div>
                    
                    <div class="palette-wrapper" style="display: flex; align-items: center; gap: 10px;">
                        <span class="ai-section-sub-title" style="font-weight: 600;">Rekomendasi Palet:</span>
                        <div id="recommended-colors-list" class="palette-output-row" style="display: flex; gap: 10px;"></div>
                    </div>
                </div>

                <hr style="border: 0; border-top: 1px dashed #e0e0e0; margin-bottom: 20px;">

                <div id="ai-text-tips-dynamic" class="ai-suggestion-paragraph-live-wide">
                    </div>
            </div>
        </div>

    <footer>
        <div class="footer-logo">Pick<span>Fit</span></div>
        <p>&copy; 2026 Pick Your Outfit by Group Localhost</p>
    </footer>

    </div> <script src="https://cdn.jsdelivr.net/npm/@mediapipe/pose"></script>
    <script src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/color-thief/2.3.0/color-thief.umd.js"></script>
    <script src="{{ asset('js/mixmatch.js') }}"></script>
</body>
</html>