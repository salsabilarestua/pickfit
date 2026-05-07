@extends('layouts.app')

@section('content')

<section class="container" style="margin-top: 120px;">
    <div class="auth-card">
        <h2>Buat Akun Baru</h2>

@if(session('success'))
    <p style="color: green; margin-bottom: 15px;">
        {{ session('success') }}
    </p>
@endif

@if($errors->any())
    <ul style="color: red; margin-bottom: 15px;">
        @foreach($errors->all() as $error)
            <li>{{ $error }}</li>
        @endforeach
    </ul>
@endif
        <form action="/register" method="POST">
            @csrf

            <input type="text" name="name" placeholder="Nama Lengkap" required>

            <input type="email" name="email" placeholder="Email" required>

            <input type="password" name="password" placeholder="Password" required>

            <button type="submit" class="btn-black">
                DAFTAR
            </button>
        </form>

        <p style="margin-top: 15px;">
            Sudah punya akun?
            <a href="/masuk">Masuk</a>
        </p>
    </div>
</section>

@endsection