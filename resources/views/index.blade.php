@extends('layouts.app')

@section('content')

<header class="hero">       
    <div class="hero-content">
        <span class="signature-hero">Style by You</span> 
        <h1>Tentukan Gaya Terbaikmu</h1>
        <p>PICK YOUR OUTFIT EASILY</p>
        <button class="btn-nude" onclick="location.href='/lemari'">
            MULAI SEKARANG
        </button>
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
                <a href="/kategori" class="btn-outline" style="text-decoration: none; display: inline-block;">
                    Lihat Semua
                </a>
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

        <div class="color-banner-box">
            <h2>Bingung Pilih Kombinasi Warna?</h2>

            <p>
                Temukan palet warna terbaik yang sesuai dengan karakter,
                agenda, dan style kamu hari ini agar tampil lebih percaya diri.
            </p>

            <a href="/warna" class="btn-black">
                Cek Rekomendasi Warna
            </a>
        </div>
    
    </div>
</section>

@endsection