@extends('layouts.app')

@section('content')

<section class="profile-wrapper">

    <div class="profile-card">

        {{-- LEFT SIDE --}}
        <div class="profile-left">

            <div class="profile-img-container">
                👗
            </div>

            <h2>{{ Auth::user()->name }}</h2>

            <p style="color:#777; margin:10px 0 20px;">
                {{ Auth::user()->email }}
            </p>

            <span class="signature-hero">
                Style by You
            </span>

            <form action="/logout" method="POST">
                @csrf

                <button type="submit" class="btn-logout">
                    Logout
                </button>
            </form>

        </div>

        {{-- RIGHT SIDE --}}
        <div class="profile-right">

            <h2 style="margin-bottom: 25px;">
                Dashboard Saya
            </h2>

            <div style="
                display:grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap:20px;
                width:100%;
            ">

                {{-- TOTAL LEMARI --}}
                <div style="
                    background:#faf7f4;
                    padding:25px;
                    border-radius:18px;
                    text-align:center;
                ">
                    <h3 style="font-size:2rem; color:#c9a38d;">
                        {{ $totalWardrobe ?? 0 }}
                    </h3>

                    <p>Total Lemari</p>
                </div>

                {{-- TOTAL OUTFIT --}}
                <div style="
                    background:#faf7f4;
                    padding:25px;
                    border-radius:18px;
                    text-align:center;
                ">
                    <h3 style="font-size:2rem; color:#c9a38d;">
                        {{ $totalOutfit ?? 0 }}
                    </h3>

                    <p>Mix & Match</p>
                </div>

                {{-- TOTAL PLANNER --}}
                <div style="
                    background:#faf7f4;
                    padding:25px;
                    border-radius:18px;
                    text-align:center;
                ">
                    <h3 style="font-size:2rem; color:#c9a38d;">
                        {{ $totalPlanner ?? 0 }}
                    </h3>

                    <p>Planner Aktif</p>
                </div>

            </div>

            <div style="
                margin-top:30px;
                padding:20px;
                background:white;
                border:1px solid #eee;
                border-radius:18px;
            ">
                <h3 style="margin-bottom:10px;">
                    Ringkasan Akun
                </h3>

                <p><strong>Nama:</strong> {{ Auth::user()->name }}</p>

                <p><strong>Email:</strong> {{ Auth::user()->email }}</p>

                <p><strong>Bergabung:</strong>
                    {{ Auth::user()->created_at->format('d M Y') }}
                </p>
            </div>

        </div>

    </div>

</section>

@endsection