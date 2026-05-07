@extends('layouts.app')

@section('content')

<link rel="stylesheet" href="{{ asset('css/warna.css') }}">

<section class="container" style="padding-top: 130px;">

    <h2 class="section-title">Rekomendasi Palet Warna</h2>

    <p class="subtitle">
        Pilih kombinasi warna terbaik untuk gaya harian, formal, maupun acara spesialmu.
    </p>

    <div class="palette-grid">

        {{-- EARTHY NATURE --}}
        <div class="palette-card" onclick="selectPalette('Earthy Nature')">

            <div class="color-previews">
                <div class="color-box" style="background: #6b705c;" title="#6b705c"></div>
                <div class="color-box" style="background: #a5a58d;" title="#a5a58d"></div>
                <div class="color-box" style="background: #b7b7a4;" title="#b7b7a4"></div>
                <div class="color-box" style="background: #ffe8d6;" title="#ffe8d6"></div>
            </div>

            <div class="palette-info">
                <h3>Earthy Nature</h3>
                <p>Cocok untuk tampilan kalem, elegan, dan profesional.</p>
            </div>

        </div>

        {{-- SOFT MINIMALIST --}}
        <div class="palette-card" onclick="selectPalette('Soft Minimalist')">

            <div class="color-previews">
                <div class="color-box" style="background: #cb997e;" title="#cb997e"></div>
                <div class="color-box" style="background: #eddcd2;" title="#eddcd2"></div>
                <div class="color-box" style="background: #fff1e6;" title="#fff1e6"></div>
                <div class="color-box" style="background: #f0efeb;" title="#f0efeb"></div>
            </div>

            <div class="palette-info">
                <h3>Soft Minimalist</h3>
                <p>Palet ideal untuk capsule wardrobe dan clean aesthetic.</p>
            </div>

        </div>

        {{-- URBAN BOLD --}}
        <div class="palette-card" onclick="selectPalette('Urban Bold')">

            <div class="color-previews">
                <div class="color-box" style="background: #003049;" title="#003049"></div>
                <div class="color-box" style="background: #d62828;" title="#d62828"></div>
                <div class="color-box" style="background: #f77f00;" title="#f77f00"></div>
                <div class="color-box" style="background: #fcbf49;" title="#fcbf49"></div>
            </div>

            <div class="palette-info">
                <h3>Urban Bold</h3>
                <p>Kombinasi berani untuk event malam dan statement look.</p>
            </div>

        </div>

    </div>

    {{-- FEEDBACK MESSAGE --}}
    <div id="feedback-message" class="hidden"></div>

</section>

<script src="{{ asset('js/warna.js') }}"></script>

@endsection