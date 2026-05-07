<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PickFit</title>

    <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playfair+Display:wght@700&family=Poppins:wght@300;400;600&display=swap" rel="stylesheet">

    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
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
            <li>
                <a href="/" class="{{ request()->path() == '/' ? 'active' : '' }}">
                    Beranda
                </a>
            </li>

            <li>
                <a href="/kategori" class="{{ request()->is('kategori') ? 'active' : '' }}">
                    Inspirasi
                </a>
            </li>

            <li>
                <a href="/lemari" class="{{ request()->is('lemari') ? 'active' : '' }}">
                    Lemari
                </a>
            </li>

            <li>
                <a href="/mixmatch" class="{{ request()->is('mixmatch') ? 'active' : '' }}">
                    Mix & Match
                </a>
            </li>
            <li>
                <a href="/warna" class="{{ request()->is('warna') ? 'active' : '' }}">
                    Warna
                </a>
            </li>
            <li>
                <a href="/planner" class="{{ request()->is('planner') ? 'active' : '' }}">
                    Planner
                </a>
            </li>
        </ul>

        <div class="auth-buttons">

            @guest
                <a href="/masuk" class="btn-link {{ request()->is('masuk') ? 'active' : '' }}">
                    Masuk
                </a>

                <a href="/daftar" class="btn-black {{ request()->is('daftar') ? 'active' : '' }}">
                    DAFTAR
                </a>
            @endguest

            @auth
                <a href="/profile" class="btn-link" style="color: var(--orange-accent); font-weight: 600;">
                    {{ Auth::user()->name }}
                </a>

                <form action="/logout" method="POST" style="display:inline;">
                    @csrf

                    <button type="submit" class="btn-black">
                        LOGOUT
                    </button>
                </form>
            @endauth

        </div>

    </div>
</nav>

@yield('content')

<footer>
    <div class="footer-logo">Pick<span>Fit</span></div>
    <p>&copy; 2026 Pick Your Outfit by Group Localhost</p>
</footer>

<script src="{{ asset('js/script.js') }}"></script>

</body>
</html>