<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ubah Password - PickFit</title>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Poppins:wght@300;400;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
</head>
<body>
    <div class="auth-wrapper">
        <div class="auth-card">
            <a href="/" class="btn-home">&larr; Home</a>
            
            <h2 class="serif">Ubah <span class="brand-color">Password</span></h2>
            <p class="auth-subtitle">Ubah Password untuk Mengakses Akun</p>
            
            <form id="form-update-password" action="{{ route('password.update') }}" method="POST">
                @csrf
                <input type="hidden" name="token" value="{{ $request->route('token') }}">
                <input type="hidden" name="email" value="{{ $request->email }}">
                
                <input type="password" name="password" placeholder="Password Baru" required>
                <input type="password" name="password_confirmation" placeholder="Konfirmasi Password" required>
                
                <button type="submit" class="btn-black">KONFIRMASI</button>
            </form>
        </div>
    </div>

    <script src="{{ asset('js/script.js') }}"></script>
</body>
</html>