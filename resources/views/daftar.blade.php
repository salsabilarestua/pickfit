<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daftar - PickFit</title>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Poppins:wght@300;400;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
</head>
<body>
    <div class="auth-wrapper"> 
        <div class="auth-card"> 
            <a href="/" class="btn-home">&larr; Home</a>

            <h2 class="serif" style="margin-top: 15px;">Daftar <span class="brand-color">PickFit</span></h2>
            
            <form action="{{ route('register.post') }}" method="POST">
                @csrf
                
                <input type="text" name="name" placeholder="Nama Lengkap" value="{{ old('name') }}" required>
                <input type="email" name="email" placeholder="Email" value="{{ old('email') }}" required>
                <input type="password" name="password" placeholder="Password" required>
                
                <button type="submit" class="btn-black">DAFTAR SEKARANG</button>

                <p style="margin-top:20px; font-size:0.8rem;">Sudah punya akun? <a href="/masuk">Masuk Disini</a></p>
            </form>
        </div>
    </div>

    <script src="{{ asset('js/script.js') }}"></script>
</body>
</html>