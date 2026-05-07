@extends('layouts.app')

@section('content')

<section class="container" style="margin-top: 120px;">
    <div class="auth-card">

        <h2>Masuk ke Akun</h2>

        @if(session('error'))
            <p style="color:red;">{{ session('error') }}</p>
        @endif

        @if(session('success'))
            <p style="color:green;">{{ session('success') }}</p>
        @endif

        <form action="/login" method="POST">
            @csrf

            <input type="email" name="email" placeholder="Email" required>

            <input type="password" name="password" placeholder="Password" required>

            <button type="submit" class="btn-black">
                MASUK
            </button>
        </form>

        <p>
            Belum punya akun?
            <a href="/daftar">Daftar</a>
        </p>

    </div>
</section>

@endsection