let date = new Date();
let currentMonth = date.getMonth();
let currentYear = date.getFullYear();
let plannerData = JSON.parse(localStorage.getItem('plannerData')) || {};
const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
let selectedDateKey = null;
let tempSelection = null;

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
        
        dayEl.onclick = function() {
            document.querySelectorAll('.day').forEach(el => el.classList.remove('active'));
            this.classList.add('active');
            selectDate(d, dateKey);
        };
        daysContainer.appendChild(dayEl);
    }
}

function selectDate(day, key) {
    selectedDateKey = key;
    tempSelection = null; 
    document.getElementById('selectedDateText').innerText = `OOTD Tanggal ${day}`;
    const preview = document.getElementById('outfitPreview');
    
    if (plannerData[key] && Array.isArray(plannerData[key])) {
        const imagesHtml = plannerData[key].map(src => 
            `<img src="${src}" style="width: 70px; height: 70px; object-fit: contain; margin: 5px; background: white; border-radius: 10px; border: 1px solid #eee; padding: 5px;">`
        ).join("");
        preview.innerHTML = `<div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 5px; padding: 10px;">${imagesHtml}</div>`;
    } else {
        preview.innerHTML = `<p style="color: #ccc; font-size: 0.85rem;">Belum ada jadwal outfit</p>`;
    }
}

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
        const imgsHtml = outfit.items.map(url => `<img src="${url}" style="width:35px; height:35px; object-fit:contain;">`).join("");
        card.innerHTML = `<div class="mini-preview" style="display:flex; gap:3px; justify-content:center;">${imgsHtml}</div>`;
        
        card.onclick = () => {
            tempSelection = outfit.items;
            const previewHtml = tempSelection.map(src => `<img src="${src}" style="width:60px; height:60px; object-fit:contain; margin:5px;">`).join("");
            document.getElementById('outfitPreview').innerHTML = `<div style="display:flex; flex-wrap:wrap; gap:5px; justify-content:center;">${previewHtml}</div>`;
            tutupModal();
        };
        daftarKoleksi.appendChild(card);
    });
};

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

document.getElementById('prevMonth').onclick = () => {
    currentMonth--;
    if (currentMonth < 0) { currentMonth = 11; currentYear--; }
    renderCalendar();
};

document.getElementById('nextMonth').onclick = () => {
    currentMonth++;
    if (currentMonth > 11) { currentMonth = 0; currentYear++; }
    renderCalendar();
};

document.getElementById('clearOutfitBtn').onclick = () => {
    if (selectedDateKey && plannerData[selectedDateKey]) {
        if(confirm("Hapus jadwal untuk tanggal ini?")) {
            delete plannerData[selectedDateKey];
            localStorage.setItem('plannerData', JSON.stringify(plannerData));
            renderCalendar();
            tampilkanSemuaRencana();
            selectDate(selectedDateKey.split('-')[2], selectedDateKey);
        }
    } else {
        alert("Pilih tanggal yang ada jadwalnya untuk dihapus.");
    }
};

function tampilkanSemuaRencana() {
    const listRencana = document.getElementById('listRencana');
    if (!listRencana) return;
    listRencana.innerHTML = "";

    Object.keys(plannerData).forEach(key => {
        const item = plannerData[key];
        const parts = key.split('-');
        const dayLabel = parts[2] + " " + monthNames[parts[1]];
        
        const card = document.createElement('div');
        card.style = "background: white; padding: 15px; border-radius: 15px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); text-align:center;";
        const imgsHtml = item.map(src => `<img src="${src}" style="width:40px; margin:2px;">`).join("");
        
        card.innerHTML = `
            <p style="font-weight:600; font-size:14px; margin-bottom:10px;">${dayLabel}</p>
            <div style="display:flex; justify-content:center; gap:5px;">${imgsHtml}</div>
        `;
        listRencana.appendChild(card);
    });
}

function tutupModal() {
    document.getElementById('modalKoleksi').style.display = 'none';
}

window.onclick = (event) => {
    if (event.target == document.getElementById('modalKoleksi')) tutupModal();
};

renderCalendar();
tampilkanSemuaRencana();