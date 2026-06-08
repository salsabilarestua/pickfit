<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inspirasi OOTD - PICKFIT</title>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Poppins:wght@300;400;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
    <link rel="stylesheet" href="{{ asset('css/kategori.css') }}">
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
                <li><a href="/index.php/index.php/mixmatch">MIX & MATCH</a></li>
                <li><a href="/index.php/planner">PLANNER</a></li>
            </ul>
        </div>
    </nav>

    <div class="kategori-container" style="margin-top: 120px;">
        <div class="header-section">
            <h2 class="section-title">Inspirasi OOTD</h2>
            <p class="subtitle">Temukan gaya terbaik untuk setiap momenmu</p>
        </div>

        <div class="filter-wrapper">
            <button class="btn-filter active" onclick="filterKategori('all')">Semua</button>
            <button class="btn-filter" onclick="filterKategori('formal')">Formal</button>
            <button class="btn-filter" onclick="filterKategori('casual')">Casual</button>
            <button class="btn-filter" onclick="filterKategori('wedding')">Wedding Invite</button>
            <button class="btn-filter" onclick="filterKategori('date')">Date Night</button>
        </div>

        <div id="gallery-grid" class="gallery-grid"></div>
    </div>

    <footer>
        <div class="footer-logo">Pick<span>Fit</span></div>
        <p>&copy; 2026 Pick Your Outfit by Group Localhost</p>
    </footer>

    <script src="{{ asset('js/script.js') }}"></script>
    <script src="{{ asset('js/kategori.js') }}"></script>
</body>
</html>