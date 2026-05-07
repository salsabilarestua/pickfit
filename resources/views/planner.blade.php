@extends('layouts.app')

@section('content')

<link rel="stylesheet" href="{{ asset('css/planner.css') }}">

<div class="planner-container">
    <div class="planner-header">
        <h2 class="section-title">Outfit Calendar</h2>
        <p class="subtitle">Atur OOTD kamu bulan ini</p>
    </div>

    <div class="calendar-wrapper">
        <div class="calendar-box">
            <div class="calendar-nav">
                <button id="prevMonth" class="nav-btn">&lt;</button>
                <h3 id="monthDisplay"></h3>
                <button id="nextMonth" class="nav-btn">&gt;</button>
            </div>

            <div class="calendar-grid-header">
                <div class="weekday">Min</div>
                <div class="weekday">Sen</div>
                <div class="weekday">Sel</div>
                <div class="weekday">Rab</div>
                <div class="weekday">Kam</div>
                <div class="weekday">Jum</div>
                <div class="weekday">Sab</div>
            </div>

            <div id="calendarDays" class="calendar-days"></div>
        </div>

        <div class="outfit-details">
            <h3 id="selectedDateText">Pilih Tanggal</h3>

            <div class="selected-outfit-card">
                <div id="outfitPreview" class="outfit-preview-box">
                    <p>Klik tanggal untuk melihat jadwal</p>
                </div>

                <div class="action-buttons">
                    <button class="btn-black" id="addOutfitBtn">
                        Pilih dari Koleksi
                    </button>

                    <button id="savePlannerBtn" style="background: #28a745; color: white; width: 100%; padding: 12px; border-radius: 50px; border: none; font-weight: 600; margin-top: 10px; cursor: pointer;">
                        Simpan ke Kalender
                    </button>

                    <button class="btn-delete-plan" id="clearOutfitBtn">
                        Hapus Jadwal
                    </button>
                </div>
            </div>
        </div>
    </div>

    <div class="saved-plans-section" style="margin-top: 50px;">
        <h3 style="font-family: 'Playfair Display', serif; margin-bottom: 20px;">
            Rencana OOTD Kamu
        </h3>

        <div id="listRencana" class="plans-grid"></div>
    </div>
</div>

<div id="modalKoleksi" class="modal">
    <div class="modal-content">
        <h3>Pilih dari Koleksi Anda</h3>

        <div id="daftarKoleksi" class="koleksi-grid-modal"></div>

        <button onclick="tutupModal()" class="btn-close">
            Batal
        </button>
    </div>
</div>
<script>
    window.userOutfits = @json($outfits);
    window.userPlans = @json($plans);
</script>
<script src="{{ asset('js/planner.js') }}"></script>

@endsection