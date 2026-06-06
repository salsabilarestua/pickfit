let date = new Date();
let currentMonth = date.getMonth();
let currentYear = date.getFullYear();
let plannerData = JSON.parse(localStorage.getItem('plannerData')) || {};
const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
let selectedDateKey = null;
let tempSelection = null;

// Render kalender
function renderCalendar() {
    const daysContainer = document.getElementById('calendarDays');
    const monthDisplay = document.getElementById('monthDisplay');
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    monthDisplay.innerText = `${monthNames[currentMonth]} ${currentYear}`;
    daysContainer.innerHTML = "";

    for (let i = 0; i < firstDay; i++) {
        daysContainer.innerHTML += `<div></div>`;
    }

    for (let d = 1; d <= daysInMonth; d++) {
        const dateKey = `${currentYear}-${currentMonth}-${d}`;
        const hasOutfit = plannerData[dateKey] ? 'has-outfit' : '';
        const dayEl = document.createElement('div');
        dayEl.className = `day ${hasOutfit}`;
        dayEl.innerText = d;
        
        // Status aktif
        if (selectedDateKey === dateKey) {
            dayEl.classList.add('active');
        }
        
        dayEl.onclick = function() {
            document.querySelectorAll('.day').forEach(el => el.classList.remove('active'));
            this.classList.add('active');
            selectDate(d, dateKey);
        };
        daysContainer.appendChild(dayEl);
    }
}

// Pilih tanggal
function selectDate(day, key) {
    selectedDateKey = key;
    tempSelection = null; 
    document.getElementById('selectedDateText').innerText = `OOTD Tanggal ${day}`;
    const preview = document.getElementById('outfitPreview');
    
    if (plannerData[key] && Array.isArray(plannerData[key])) {
        const imagesHtml = plannerData[key].map(src => 
            `<img src="${src}" style="width: 85px; height: 85px; object-fit: contain; margin: 5px; background: white; border-radius: 12px; border: 1px solid #eeece8; padding: 6px; box-shadow: 0 4px 10px rgba(0,0,0,0.02);">`
        ).join("");
        preview.innerHTML = `<div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; padding: 10px;">${imagesHtml}</div>`;
    } else {
        preview.innerHTML = `<p style="color: #ccc; font-size: 0.85rem;">Belum ada jadwal outfit</p>`;
    }
}

// Buka modal koleksi
document.getElementById('addOutfitBtn').onclick = () => {
    if (!selectedDateKey) return alert("Pilih tanggal di kalender dulu!");
    const modal = document.getElementById('modalKoleksi');
    const daftarKoleksi = document.getElementById('daftarKoleksi');
    const koleksi = JSON.parse(localStorage.getItem('koleksiOutfit')) || [];

    modal.style.display = 'flex';
    daftarKoleksi.innerHTML = "";

    if (koleksi.length === 0) {
        daftarKoleksi.innerHTML = "<p style='grid-column: span 3; padding: 20px; color: #999;'>Koleksi kosong. Buat dulu di Mix & Match!</p>";
        return;
    }

    koleksi.forEach(outfit => {
        const card = document.createElement('div');
        card.className = "koleksi-item-modal";
        const imgsHtml = outfit.items.map(url => `<img src="${url}" style="width:45px; height:45px; object-fit:contain;">`).join("");
        card.innerHTML = `<div class="mini-preview" style="display:flex; gap:5px; justify-content:center; flex-wrap:wrap;">${imgsHtml}</div>`;
        
        card.onclick = () => {
            tempSelection = outfit.items;
            const previewHtml = tempSelection.map(src => `<img src="${src}" style="width:85px; height:85px; object-fit:contain; margin:5px; background:white; border-radius:12px; border:1px solid #eeece8; padding:6px;">`).join("");
            document.getElementById('outfitPreview').innerHTML = `<div style="display:flex; flex-wrap:wrap; gap:8px; justify-content:center;">${previewHtml}</div>`;
            tutupModal();
        };
        daftarKoleksi.appendChild(card);
    });
};

// Simpan ke kalender
document.getElementById('savePlannerBtn').onclick = () => {
    if (!selectedDateKey) return alert("Pilih tanggal di kalender dulu!");
    if (!tempSelection) return alert("Pilih outfit dari koleksi dulu!");

    plannerData[selectedDateKey] = tempSelection;
    localStorage.setItem('plannerData', JSON.stringify(plannerData));

    alert("Berhasil disimpan ke kalender!");
    renderCalendar();
    tampilkanSemuaRencana();
    tempSelection = null;
};

// Bulan sebelumnya
document.getElementById('prevMonth').onclick = () => {
    currentMonth--;
    if (currentMonth < 0) { currentMonth = 11; currentYear--; }
    renderCalendar();
};

// Bulan berikutnya
document.getElementById('nextMonth').onclick = () => {
    currentMonth++;
    if (currentMonth > 11) { currentMonth = 0; currentYear++; }
    renderCalendar();
};

// Hapus jadwal outfit
document.getElementById('clearOutfitBtn').onclick = () => {
    if (selectedDateKey && plannerData[selectedDateKey]) {
        if(confirm("Hapus jadwal untuk tanggal ini?")) {
            const tempDay = selectedDateKey.split('-')[2];
            delete plannerData[selectedDateKey];
            localStorage.setItem('plannerData', JSON.stringify(plannerData));
            
            renderCalendar();
            tampilkanSemuaRencana();
            selectDate(tempDay, selectedDateKey);
        }
    } else {
        alert("Pilih tanggal yang ada jadwalnya untuk dihapus.");
    }
};

// Tampilkan daftar semua rencana
function tampilkanSemuaRencana() {
    const listRencana = document.getElementById('listRencana');
    if (!listRencana) return;
    listRencana.innerHTML = "";

    Object.keys(plannerData).forEach(key => {
        const item = plannerData[key];
        const parts = key.split('-');
        const dayLabel = parts[2] + " " + monthNames[parts[1]];
        
        const card = document.createElement('div');
        card.style.background = "white";
        card.style.padding = "20px";
        card.style.borderRadius = "20px";
        card.style.boxShadow = "0 8px 20px rgba(89,88,67,0.03)";
        card.style.textAlign = "center";
        card.style.border = "1px solid #f0edea";
        
        const imgsHtml = item.map(src => `<img src="${src}" style="width: 50px; height: 50px; object-fit: contain; margin: 3px; background: #faf9f6; padding: 4px; border-radius: 8px; border: 1px solid #f0edea;">`).join("");
        
        card.innerHTML = `
            <p style="font-weight:600; font-size:14px; margin-bottom:12px; color: #333;">${dayLabel}</p>
            <div style="display:flex; justify-content:center; flex-wrap: wrap; gap:4px;">${imgsHtml}</div>
        `;
        listRencana.appendChild(card);
    });
}

// Tutup modal
function tutupModal() {
    document.getElementById('modalKoleksi').style.display = 'none';
}

// Klik area luar modal
window.onclick = (event) => {
    if (event.target == document.getElementById('modalKoleksi')) tutupModal();
};

// Inisialisasi awal
renderCalendar();
tampilkanSemuaRencana();