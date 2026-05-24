<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PICKFIT - Your Style</title>
    <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playfair+Display:wght@700&family=Poppins:wght@300;400;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
</head>
<body>

    <nav id="navbar">
        <a href="/" class="logo">Pick<span>Fit</span></a>

        <div class="nav-container" id="nav-list">
            <ul class="nav-links">
                <li><a href="/" class="active">BERANDA</a></li>
                <li><a href="/lemari">LEMARI</a></li>
                <li><a href="/mixmatch">MIX & MATCH</a></li>
                <li><a href="/planner">PLANNER</a></li>
            </ul>

            <div id="guest-menu">
                @if(request()->get('login') == 'true')
                    <a href="/profil" class="btn-black">PROFIL</a>
                @else
                    <a href="/masuk" class="btn-link">Masuk</a>
                    <a href="/daftar" class="btn-black">DAFTAR</a>
                @endif
            </div>

            <div id="user-menu" style="display: none;">
                <a href="/profil" class="btn-black">PROFIL</a>
                <button id="logout-btn" class="btn-link" style="border:none; background:none; cursor:pointer;">Keluar</button>
            </div>
        </div>
    </nav>

    <header class="hero" style="background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('{{ asset('images/home.jpg') }}'); background-size: cover; background-position: center; background-repeat: no-repeat;">       
        <div class="hero-content">
            <span class="signature-hero">Style by You</span> 
            <h1>Tentukan Gaya Terbaikmu</h1>
            <p>PICK YOUR OUTFIT EASILY</p>
            <button class="btn-nude" onclick="location.href='/lemari'">MULAI SEKARANG</button>
        </div>
    </header>

    <section class="container">
        <h2 class="section-title">Kategori OOTD</h2>
        <div class="category-grid">
        
            <div class="category-item" onclick="location.href='/kategori'" style="cursor: pointer;">
                <img src="{{ asset('images/formal.jpg') }}" alt="Formal">
                <div class="overlay"><h3>Acara Formal</h3></div>
            </div>

            <div class="category-item item-large">
                <img src="{{ asset('images/secc.avif') }}" alt="Main">
                <div class="overlay-center">
                    <p class="signature-light">Inspirasi</p>
                    <h2 class="cat-brand">PICKFIT</h2>
                    <a href="/kategori" class="btn-see-all" style="text-decoration: none;">Lihat Semua</a>
                </div>
            </div>

            <div class="category-item" onclick="location.href='/kategori'" style="cursor: pointer;">
                <img src="{{ asset('images/casual.avif') }}" alt="Harian">
                <div class="overlay"><h3>Gaya Harian</h3></div>
            </div>

            <div class="category-item" onclick="location.href='/kategori'" style="cursor: pointer;">
                <img src="{{ asset('images/wedding.jpg') }}" alt="Wedding">
                <div class="overlay"><h3>Wedding Invite</h3></div>
            </div>

            <div class="category-item" onclick="location.href='/kategori'" style="cursor: pointer;">
                <img src="{{ asset('images/date.jpg') }}" alt="Date">
                <div class="overlay"><h3>Date Night</h3></div>
            </div>

        </div>
    </section>
    
    <section class="color-section">
        <div class="color-header">
            <h2 class="section-title" style="margin-top: 10px; margin-bottom: 10px;">Eksplorasi Warna</h2>
            <p class="color-subtitle">Pilih palet warna yang sesuai dengan *skin tone* dan *mood* outfit harianmu.</p>
        </div>

        <div class="color-preview-grid">
            <div class="color-preview-card">
                <div class="color-palette-bar">
                    <span style="background-color: #c9a38d;"></span>
                    <span style="background-color: #8b6f5e;"></span>
                    <span style="background-color: #e6beaa;"></span>
                    <span style="background-color: #5c4a3c;"></span>
                </div>
                <div class="color-card-info">
                    <h3>Warm Earth Tone</h3>
                    <p>Cokelat, Nude, Terakota</p>
                </div>
            </div>

            <div class="color-preview-card">
                <div class="color-palette-bar">
                    <span style="background-color: #d4e2d4;"></span>
                    <span style="background-color: #f7d6c8;"></span>
                    <span style="background-color: #f4f0db;"></span>
                    <span style="background-color: #ccd4bf;"></span>
                </div>
                <div class="color-card-info">
                    <h3>Soft Pastel</h3>
                    <p>Sage, Dusty Pink, Cream</p>
                </div>
            </div>

            <div class="color-preview-card">
                <div class="color-palette-bar">
                    <span style="background-color: #1a1a1a;"></span>
                    <span style="background-color: #7f8c8d;"></span>
                    <span style="background-color: #bdc3c7;"></span>
                    <span style="background-color: #f5f5f5;"></span>
                </div>
                <div class="color-card-info">
                    <h3>Minimalist Mono</h3>
                    <p>Hitam, Abu-abu, Putih</p>
                </div>
            </div>
        </div>

        <div class="color-action-center">
            <a href="/warna" class="btn-explore-color">Lihat Detail Palet</a>
        </div>
    </section>

    <footer>
        <div class="footer-logo">Pick<span>Fit</span></div>
        <p>&copy; 2026 Pick Your Outfit by Group Localhost</p>
    </footer>

    <script src="{{ asset('js/script.js') }}"></script>
</body>