<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PickFit - Rekomendasi Warna</title>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Poppins:wght@400;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('css/warna.css') }}">
</head>
<body>

    <nav id="navbar">
        <a href="/" class="logo">Pick<span>Fit</span></a>
        <div class="menu-toggle" id="mobile-menu">
            <span></span>
            <span></span>
            <span></span>
        </div>
        <div class="nav-container" id="nav-container">
            <ul class="nav-links">
                <li><a href="/index.php">BERANDA</a></li>
                <li><a href="/index.php/lemari">LEMARI</a></li>
                <li><a href="/index.php/mixmatch">MIX & MATCH</a></li>
                <li><a href="/index.php/planner">PLANNER</a></li>
            </ul>
        </div>
    </nav>

    <section class="container" style="margin-top: 120px;">
        <h2 class="section-title">Rekomendasi Palet Warna</h2>
    
        <div class="palette-grid">
            <div class="palette-card" onclick="selectPalette('Earthy Nature')">
                <div class="color-previews">
                    <div class="color-box" style="background: #6b705c;" title="#6b705c"></div>
                    <div class="color-box" style="background: #a5a58d;" title="#a5a58d"></div>
                    <div class="color-box" style="background: #b7b7a4;" title="#b7b7a4"></div>
                    <div class="color-box" style="background: #ffe8d6;" title="#ffe8d6"></div>
                </div>
                <div class="palette-info">
                    <h3>Earthy Nature</h3>
                    <p>Cocok untuk tampilan kalem dan profesional.</p>
                </div>
            </div>

            <div class="palette-card" onclick="selectPalette('Soft Minimalist')">
                <div class="color-previews">
                    <div class="color-box" style="background: #cb997e;" title="#cb997e"></div>
                    <div class="color-box" style="background: #eddcd2;" title="#eddcd2"></div>
                    <div class="color-box" style="background: #fff1e6;" title="#fff1e6"></div>
                    <div class="color-box" style="background: #f0efeb;" title="#f0efeb"></div>
                </div>
                <div class="palette-info">
                    <h3>Soft Minimalist</h3>
                    <p>Palet andalan untuk gaya Capsule Wardrobe.</p>
                </div>
            </div>

            <div class="palette-card" onclick="selectPalette('Urban Bold')">
                <div class="color-previews">
                    <div class="color-box" style="background: #003049;" title="#003049"></div>
                    <div class="color-box" style="background: #d62828;" title="#d62828"></div>
                    <div class="color-box" style="background: #f77f00;" title="#f77f00"></div>
                    <div class="color-box" style="background: #fcbf49;" title="#fcbf49"></div>
                </div>
                <div class="palette-info">
                    <h3>Urban Bold</h3>
                    <p>Kombinasi berani untuk acara malam.</p>
                </div>
            </div>
        </div>
        
        <div id="feedback-message" class="hidden"></div>
    </section>

    <footer>
        <div class="footer-logo">Pick<span>Fit</span></div>
        <p>&copy; 2026 Pick Your Outfit by Group Localhost</p>
    </footer>

    <script src="{{ asset('js/script.js') }}"></script>
    <script src="{{ asset('js/warna.js') }}"></script>
</body>
</html>