@extends('layouts.app')

@section('content')

<link rel="stylesheet" href="{{ asset('css/lemari.css') }}">

<section class="container" style="margin-top: 50px;">

    <h2 class="section-title">Lemari Saya</h2>

    @if(session('success'))
        <p style="color: green; text-align:center; margin-bottom: 15px;">
            {{ session('success') }}
        </p>
    @endif

    @if($errors->any())
        <ul style="color:red; margin-bottom: 15px; text-align:center; list-style:none;">
            @foreach($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
    @endif

    {{-- FORM TAMBAH BAJU --}}
    <div class="auth-card" style="margin: 0 auto 50px auto; max-width: 500px;">

        <h3>Tambah Koleksi Baru</h3>

        <form action="/lemari/store" method="POST" enctype="multipart/form-data">
            @csrf

            <input type="text"
                   name="nama_baju"
                   placeholder="Nama Baju (ex: Kaos Hitam)"
                   required>

            <select name="status_baju"
                    style="width: 100%; padding: 12px; margin: 10px 0; border: 1px solid #ddd; border-radius: 8px;">
                <option value="Siap Pakai">Siap Pakai</option>
                <option value="Dicuci">Sedang Dicuci</option>
            </select>

            <input type="file"
                   name="foto_baju"
                   accept="image/*"
                   required
                   style="padding: 10px 0;">

            <button type="submit"
                    class="btn-black"
                    style="width: 100%; margin-top: 10px;">
                UNGGAH KE LEMARI
            </button>
        </form>

    </div>

    {{-- GRID LEMARI --}}
    <div id="grid-lemari" class="wardrobe-grid">

        @forelse($wardrobes as $item)

            <div class="wardrobe-card">

                {{-- FOTO --}}
                <img src="{{ asset('storage/' . $item->foto_baju) }}"
                     alt="{{ $item->nama_baju }}">

                {{-- NAMA --}}
                <h4>{{ $item->nama_baju }}</h4>

                {{-- STATUS CLICK TOGGLE --}}
                <form action="/lemari/update-status/{{ $item->id }}"
                      method="POST"
                      style="width:100%; margin-bottom: 12px;">
                    @csrf
                    @method('PUT')

                    <input type="hidden"
                           name="status_baju"
                           value="{{ $item->status_baju == 'Siap Pakai' ? 'Dicuci' : 'Siap Pakai' }}">

                    <button type="submit"
                            class="status-badge {{ $item->status_baju == 'Siap Pakai' ? 'status-siap' : 'status-cuci' }}"
                            style="width:100%; border:none; cursor:pointer;">
                        {{ $item->status_baju == 'Siap Pakai' ? 'SIAP PAKAI' : 'SEDANG DICUCI' }}
                    </button>
                </form>

                {{-- DELETE --}}
                <form action="/lemari/delete/{{ $item->id }}"
                      method="POST"
                      style="width:100%;"
                      onsubmit="return confirm('Yakin ingin menghapus item ini?');">
                    @csrf
                    @method('DELETE')

                    <button type="submit" class="btn-delete">
                        Hapus Item
                    </button>
                </form>

            </div>

        @empty

            <p style="text-align:center; width:100%;">
                Lemari kamu masih kosong.
            </p>

        @endforelse

    </div>

</section>

@endsection