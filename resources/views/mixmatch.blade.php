@extends('layouts.app')

@section('content')
<meta name="csrf-token" content="{{ csrf_token() }}">
<link rel="stylesheet" href="{{ asset('css/lemari.css') }}">
<link rel="stylesheet" href="{{ asset('css/mixmatch.css') }}">

<div class="mix-container">

    <div class="lemari-list" id="lemari-list">
    <h3>Ambil dari Lemari</h3>

    @forelse($wardrobes as $item)
        <div class="lemari-item"
             draggable="true"
             data-id="{{ $item->id }}"
             data-nama="{{ $item->nama_baju }}"
             data-foto="{{ asset('storage/' . $item->foto_baju) }}">

            <img src="{{ asset('storage/' . $item->foto_baju) }}"
                 alt="{{ $item->nama_baju }}">

            <p>{{ $item->nama_baju }}</p>
            </div>
        @empty
            <p>Lemari siap pakai kosong.</p>
        @endforelse

    </div>

    <div class="canvas-area" id="canvas">
        <p style="text-align:center; margin-top:200px; color:#aaa;">
            Drag item ke sini 👕
        </p>
    </div>

    <div class="action-area">
        <button id="save-outfit" class="btn-save">
            Simpan Outfit
        </button>
    </div>

    <div class="saved-outfits-container">
        <h3>Koleksi Outfit Kamu</h3>

        <div id="saved-outfits-grid" class="outfits-grid">
        </div>
    </div>

</div>

<script src="{{ asset('js/mixmatch.js') }}"></script>

@endsection