<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Profil Saya - PICKFIT</title>
    <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playfair+Display:wght@700&family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
</head>
<body class="profile-page">

    <nav id="navbar">
        <a href="/" class="logo">Pick<span>Fit</span></a>
        <div class="nav-container" id="nav-container">
            <ul class="nav-links">
                <li><a href="/">BERANDA</a></li>
                <li><a href="/lemari">LEMARI</a></li>
                <li><a href="/mixmatch">MIX & MATCH</a></li>
                <li><a href="/planner">PLANNER</a></li>
            </ul>
        </div>
    </nav>

    <main class="profile-wrapper" style="margin-top: 120px;">
        <div class="profile-card">
            <div class="profile-left">
                <div class="profile-img-container">
                    <div class="gender-anim">
                        <span>👦</span>
                        <span>👧</span>
                    </div>
                </div>
                <h3 class="signature-hero">Halo, <span>{{ Auth::user()->name }}</span>!</h3>
                
                <form action="{{ route('logout.post') }}" method="POST">
                    @csrf
                    <button type="submit" class="btn-logout">Keluar Akun</button>
                </form>
            </div>

            <div class="profile-right">
                <h2>Informasi Profil</h2>
                <hr class="divider">
                
                <div class="profile-info-group">
                    <label>Nama Pengguna</label>
                    <p>{{ Auth::user()->name }}</p>
                </div>
                <div class="profile-info-group" style="margin-top: 15px;">
                    <label>Email Terdaftar</label>
                    <p>{{ Auth::user()->email }}</p>
                </div>
            </div>
        </div>
    </main>

    <script src="{{ asset('js/script.js') }}"></script>
</body>
</html>