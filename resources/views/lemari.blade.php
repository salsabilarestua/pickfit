<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lemari Saya - PICKFIT</title>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Poppins:wght@300;400;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('css/lemari.css') }}">
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
                <li><a href="/">Beranda</a></li>
                <li><a href="/lemari" class="active">Lemari</a></li>
                <li><a href="/mixmatch">Mix & Match</a></li>
                <li><a href="/planner">Planner</a></li>
            </ul>
        </div>
    </nav>

    <section class="container" style="margin-top: 100px;">
        <h2 class="section-title">Lemari Saya</h2>
        
        <div class="auth-card" style="margin: 0 auto 50px auto; max-width: 500px;">
            <h3>Tambah Koleksi Baru</h3>
            <input type="text" id="nama-baju" placeholder="Nama Baju (ex: Kaos Hitam)">

            <input type="file" id="foto-baju" accept="image/*" style="padding: 10px 0;">
            <button id="btn-tambah" class="btn-black" style="width: 100%; margin-top: 10px;">UNGGAH KE LEMARI</button>
        </div>

        <div id="grid-lemari">
            </div>
    </section>

    <footer>
        <div class="footer-logo">Pick<span>Fit</span></div>
        <p>&copy; 2026 Pick Your Outfit by Group Localhost</p>
    </footer>

    <script src="{{ asset('js/lemari.js') }}"></script>
</body>