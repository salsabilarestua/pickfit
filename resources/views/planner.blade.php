<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Outfit Planner - PickFit</title>
    <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playfair+Display:wght@700&family=Poppins:wght@300;400;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('css/planner.css') }}">
</head>
<body>

    <nav id="navbar">
        <a href="/" class="logo">Pick<span>Fit</span></a>
        <ul class="nav-links">
            <li><a href="/index.php">BERANDA</a></li>
            <li><a href="/index.php/lemari">LEMARI</a></li>
            <li><a href="/index.php/mixmatch">MIX & MATCH</a></li>
            <li><a href="/index.php/planner" class="active">PLANNER</a></li>
        </ul>
    </nav>

    <div class="planner-container" style="margin-top: 120px;">
        <div class="planner-header">
            <h2 class="section-title">Outfit Calendar</h2>
        </div>

        <div class="calendar-wrapper">
            <div class="calendar-box">
                <div class="calendar-nav">
                    <button id="prevMonth" class="nav-btn">&lt;</button>
                    <h3 id="monthDisplay"></h3>
                    <button id="nextMonth" class="nav-btn">&gt;</button>
                </div>
                <div class="calendar-grid-header">
                    <div class="weekday">Min</div><div class="weekday">Sen</div>
                    <div class="weekday">Sel</div><div class="weekday">Rab</div>
                    <div class="weekday">Kam</div><div class="weekday">Jum</div>
                    <div class="weekday">Sab</div>
                </div>
                <div id="calendarDays" class="calendar-days"></div>
            </div>

            <div class="outfit-details">
                <h3 id="selectedDateText">Pilih Tanggal</h3>
                <div class="selected-outfit-card">
                    <div id="outfitPreview" class="outfit-preview-box">
                        <p style="color: #ccc; font-size: 0.85rem;">Klik tanggal untuk melihat jadwal</p>
                    </div>
                    <div class="action-buttons">
                        <button class="btn-black" id="addOutfitBtn">Pilih dari Koleksi</button>
                        <button id="savePlannerBtn" style="background: #28a745; color: white; width: 100%; padding: 12px; border-radius: 50px; border: none; font-weight: 600; margin-top: 10px; cursor: pointer;">Simpan ke Kalender</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="saved-plans-section" style="margin-top: 50px;">
            <h3 style="font-family: 'Playfair Display', serif; margin-bottom: 20px;">Rencana OOTD Kamu</h3>
            <div id="listRencana" class="plans-grid"></div>
        </div>
    </div>

    <div id="modalKoleksi" class="modal">
        <div class="modal-content">
            <h3>Pilih dari Koleksi Anda</h3>
            <div id="daftarKoleksi" class="koleksi-grid-modal"></div>
            <button onclick="tutupModal()" class="btn-close">Batal</button>
        </div>
    </div>

    <footer>
        <div class="footer-logo">Pick<span>Fit</span></div>
        <p>&copy; 2026 Pick Your Outfit by Group Localhost</p>
    </footer>
    <script src="{{ asset('js/planner.js') }}"></script>
</body>
</html>