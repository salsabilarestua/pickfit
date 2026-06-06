<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Masuk - PickFit</title>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Poppins:wght@300;400;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
</head>
<body>
    <div class="auth-wrapper">
        <div class="auth-card">
            <a href="/" class="btn-home">&larr; Home</a>
            
            <h2 class="serif">Masuk <span class="brand-color">PickFit</span></h2>
            <p class="auth-subtitle">Welcome Back</p>
            
            <form id="form-login" action="/?login=true" method="GET">
                <input type="email" name="email" placeholder="Email" required>
                <input type="password" name="password" placeholder="Password" required>
                
                <button type="submit" class="btn-black">MASUK</button>
            </form>
            
            <p class="auth-switch">
                Belum punya akun? <a href="/daftar">Daftar Yuk</a><br>
                atau <a href="/lupapassword">Lupa Password?</a>
            </p>
        </div>
    </div>

    <script src="{{ asset('js/script.js') }}"></script>
</body>
</html>