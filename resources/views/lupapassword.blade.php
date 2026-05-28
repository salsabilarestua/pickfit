<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lupa Password - PickFit</title>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Poppins:wght@300;400;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
</head>
<body>
    <div class="auth-wrapper">
        <div class="auth-card">
            <a href="/" class="btn-home">&larr; Home</a>
            
            <h2 class="serif">Lupa <span class="brand-color">Password?</span></h2>
            
            <p class="auth-subtitle">Masukkan Email Pemulihan</p>
            
            <form id="form-lupa-password" action="{{ route('password.email') }}" method="POST">
                @csrf
                <input type="email" name="email" placeholder="Email" required>
                
                <button type="submit" class="btn-black">KIRIM RESET LINK</button>
            </form>
            
            <p class="auth-switch">
                Belum punya akun? <a href="/daftar">Daftar Disini</a>
            </p>
        </div>
    </div>

    <script src="{{ asset('js/script.js') }}"></script>
</body>
</html>