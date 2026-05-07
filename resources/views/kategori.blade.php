@extends('layouts.app')

@section('content')

<link rel="stylesheet" href="{{ asset('css/kategori.css') }}">

<div class="kategori-container">
    <div class="header-section">
        <h2 class="section-title">Inspirasi OOTD</h2>
        <p class="subtitle">Temukan gaya terbaik untuk setiap momenmu</p>
    </div>

    <div class="filter-wrapper">
        <button class="btn-filter active" onclick="filterKategori('all')">Semua</button>
        <button class="btn-filter" onclick="filterKategori('formal')">Formal</button>
        <button class="btn-filter" onclick="filterKategori('casual')">Casual</button>
        <button class="btn-filter" onclick="filterKategori('wedding')">Wedding Invite</button>
        <button class="btn-filter" onclick="filterKategori('date')">Date Night</button>
    </div>

    <div id="gallery-grid" class="gallery-grid">
    </div>
</div>

<script src="{{ asset('js/kategori.js') }}"></script>

@endsection