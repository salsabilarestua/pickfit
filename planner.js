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
        
        // MENAMPILKAN NAMA PLAN DI DALAM TANGGAL
        let planNameHtml = "";
        if (plannerData[dateKey] && plannerData[dateKey].name) {
            planNameHtml = `<span class="day-plan-name" style="font-size: 10px; color: #c9a38d; display: block; margin-top: 5px; font-weight: normal; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; width: 100%; text-align: center;">${plannerData[dateKey].name}</span>`;
        }

        dayEl.innerHTML = `<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%;">
                            <span>${d}</span>
                            ${planNameHtml}
                           </div>`;
        
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
    const nameInput = document.getElementById('outfitNameInput');
    
    if (plannerData[key]) {
        const items = Array.isArray(plannerData[key]) ? plannerData[key] : plannerData[key].items;
        const name = plannerData[key].name || "";
        
        nameInput.value = name;
        const imagesHtml = items.map(src => `<img src="${src}" style="width: 60px; height: 60px; object-fit: contain; margin: 2px;">`).join("");
        preview.innerHTML = `<div style="display: flex; flex-wrap: wrap; justify-content: center;">${imagesHtml}</div>`;
    } else {
        nameInput.value = "";
        preview.innerHTML = `<p style="color: #ccc; font-size: 0.85rem;">Belum ada jadwal outfit</p>`;
    }
}

document.getElementById('addOutfitBtn').onclick = () => {
    if (!selectedDateKey) return alert("Pilih tanggal di kalender dulu!");
    document.getElementById('modalKoleksi').style.display = 'flex';
    const daftarKoleksi = document.getElementById('daftarKoleksi');
    const koleksi = JSON.parse(localStorage.getItem('koleksiOutfit')) || [];

    daftarKoleksi.innerHTML = "";
    koleksi.forEach(outfit => {
        const card = document.createElement('div');
        card.className = "koleksi-item-modal";
        const imgsHtml = outfit.items.map(url => `<img src="${url}" style="width:35px; height:35px; object-fit:contain;">`).join("");
        card.innerHTML = `<div class="mini-preview">${imgsHtml}</div>`;
        
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
    const nameInput = document.getElementById('outfitNameInput');
    
    if (!selectedDateKey) return alert("Pilih tanggal di kalender dulu!");
    
    let finalItems = tempSelection;
    if (!finalItems && plannerData[selectedDateKey]) {
        finalItems = Array.isArray(plannerData[selectedDateKey]) ? plannerData[selectedDateKey] : plannerData[selectedDateKey].items;
    }

    if (!finalItems) return alert("Pilih baju dulu dari koleksi!");

    // SIMPAN DATA SEBAGAI OBJEK (BAJU + NAMA)
    plannerData[selectedDateKey] = {
        items: finalItems,
        name: nameInput.value
    };

    localStorage.setItem('plannerData', JSON.stringify(plannerData));
    alert("Berhasil disimpan!");
    renderCalendar();
    tampilkanSemuaRencana();
};

// Fungsi pendukung lainnya (Sama seperti sebelumnya)
document.getElementById('prevMonth').onclick = () => { currentMonth--; if (currentMonth < 0) { currentMonth = 11; currentYear--; } renderCalendar(); };
document.getElementById('nextMonth').onclick = () => { currentMonth++; if (currentMonth > 11) { currentMonth = 0; currentYear++; } renderCalendar(); };
document.getElementById('clearOutfitBtn').onclick = () => {
    if (selectedDateKey && plannerData[selectedDateKey]) {
        if(confirm("Hapus jadwal ini?")) {
            delete plannerData[selectedDateKey];
            localStorage.setItem('plannerData', JSON.stringify(plannerData));
            renderCalendar();
            tampilkanSemuaRencana();
            selectDate(selectedDateKey.split('-')[2], selectedDateKey);
        }
    }
};

function tampilkanSemuaRencana() {
    const listRencana = document.getElementById('listRencana');
    if (!listRencana) return;
    listRencana.innerHTML = "";
    Object.keys(plannerData).forEach(key => {
        const data = plannerData[key];
        const items = Array.isArray(data) ? data : data.items;
        const name = data.name || "Tanpa Nama";
        const parts = key.split('-');
        const card = document.createElement('div');
        card.style = "background: white; padding: 15px; border-radius: 15px; text-align:center; box-shadow: 0 2px 5px rgba(0,0,0,0.1);";
        card.innerHTML = `<p style="font-weight:600; font-size:12px;">${parts[2]} ${monthNames[parts[1]]} - ${name}</p>`;
        listRencana.appendChild(card);
    });
}

function tutupModal() { document.getElementById('modalKoleksi').style.display = 'none'; }
window.onclick = (e) => { if (e.target == document.getElementById('modalKoleksi')) tutupModal(); };

renderCalendar();
tampilkanSemuaRencana();