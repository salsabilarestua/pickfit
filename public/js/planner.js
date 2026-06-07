let currentDate = new Date();
let selectedDateString = null; 
let jepretanTerpilih = null; 

const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

// INITIALIZE KALENDER
function inisialisasiKalender() {
    const monthDisplay = document.getElementById("monthDisplay");
    const calendarDays = document.getElementById("calendarDays");
    const prevMonthBtn = document.getElementById("prevMonth");
    const nextMonthBtn = document.getElementById("nextMonth");

    if (!calendarDays || !monthDisplay) return;

    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        monthDisplay.textContent = `${months[month]} ${year}`;
        calendarDays.innerHTML = "";

        const firstDayIndex = new Date(year, month, 1).getDay();
        const lastDay = new Date(year, month + 1, 0).getDate();
        const prevLastDay = new Date(year, month, 0).getDate();

        for (let x = firstDayIndex; x > 0; x--) {
            const dayDiv = document.createElement("div");
            dayDiv.classList.add("day", "prev-date");
            dayDiv.textContent = prevLastDay - x + 1;
            calendarDays.appendChild(dayDiv);
        }

        for (let i = 1; i <= lastDay; i++) {
            const dayDiv = document.createElement("div");
            dayDiv.classList.add("day");
            dayDiv.textContent = i;

            const today = new Date();
            if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                dayDiv.classList.add("today");
            }

            dayDiv.addEventListener("click", () => {
                document.querySelectorAll("#calendarDays .day").forEach(d => d.classList.remove("selected-day"));
                dayDiv.classList.add("selected-day");
                
                const objekTanggal = new Date(year, month, i);
                selectedDateString = objekTanggal.toLocaleDateString('id-ID', { 
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                });

                const selectedDateText = document.getElementById("selectedDateText");
                if (selectedDateText) selectedDateText.textContent = selectedDateString;
            });

            calendarDays.appendChild(dayDiv);
        }
    }

    prevMonthBtn?.addEventListener("click", () => { currentDate.setMonth(currentDate.getMonth() - 1); renderCalendar(); });
    nextMonthBtn?.addEventListener("click", () => { currentDate.setMonth(currentDate.getMonth() + 1); renderCalendar(); });
    renderCalendar();
}

// AMBIL JEPRETAN (BUKA MODAL)
function inisialisasiFiturKoleksi() {
    const addOutfitBtn = document.getElementById("addOutfitBtn");
    const modalKoleksi = document.getElementById("modalKoleksi");
    const daftarKoleksi = document.getElementById("daftarKoleksi");
    const outfitPreview = document.getElementById("outfitPreview");

    addOutfitBtn?.addEventListener("click", async () => {
        if (!selectedDateString) {
            alert("⚠️ Pilih tanggal di kalender terlebih dahulu!");
            return;
        }

        modalKoleksi.style.display = "flex";
        daftarKoleksi.innerHTML = "<p style='text-align: center; grid-column: 1/-1;'>Mengambil riwayat jepretan Mix & Match...</p>";

        try {
            const response = await fetch('http://localhost:3000/api/mixmatch');
            if (!response.ok) throw new Error("404 Not Found");
            
            const listJepretan = await response.json();

            if (!listJepretan || listJepretan.length === 0) {
                daftarKoleksi.innerHTML = `
                    <div style="grid-column: 1/-1; text-align: center; color: #666; padding: 20px;">
                        <p style="margin: 0; font-size: 14px;">📸 Belum ada riwayat foto kombinasi.</p>
                        <small style="color: #999;">Buka menu Mix & Match dan jepret pakaian AR-mu terlebih dahulu!</small>
                    </div>`;
                return;
            }

            daftarKoleksi.innerHTML = "";
            listJepretan.forEach(item => {
                const itemCard = document.createElement("div");
                itemCard.style = "background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px; text-align: center; cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.05);";
                
                itemCard.innerHTML = `
                    <div style="width: 100%; height: 130px; background: #f8fafc; border-radius: 8px; overflow: hidden; margin-bottom: 8px; display: flex; align-items: center; justify-content: center;">
                        <img src="${item.preview_snapshot}" style="width: 100%; height: 100%; object-fit: contain;">
                    </div>
                    <p style="font-size: 13px; font-weight: bold; margin: 4px 0; color: #1e293b;">👕 ${item.nama_atasan}</p>
                    <p style="font-size: 11px; color: #64748b; margin: 0;">👖 ${item.nama_bawahan}</p>
                `;

                itemCard.addEventListener("click", () => {
                    jepretanTerpilih = item;
                    outfitPreview.innerHTML = `
                        <div style="text-align: center; width: 100%;">
                            <img src="${item.preview_snapshot}" style="max-width: 100%; max-height: 150px; object-fit: contain; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 5px;">
                            <h4 style="margin: 0; font-size: 13px; color: #0f172a;">Kombinasi Terpilih</h4>
                            <p style="margin: 2px 0; font-size: 11px; color: #475569;">${item.nama_atasan} & ${item.nama_bawahan}</p>
                        </div>
                    `;
                    tutupModal();
                });

                daftarKoleksi.appendChild(itemCard);
            });

        } catch (error) {
            daftarKoleksi.innerHTML = "<p style='color: #dc2626; grid-column: 1/-1; text-align: center;'>❌ Server gagal merespon rute jepretan.</p>";
        }
    });
}

// TUTUP MODAL KOLEKSI 
window.tutupModal = function() {
    const modalKoleksi = document.getElementById("modalKoleksi");
    if (modalKoleksi) modalKoleksi.style.display = "none";
}

//  SIMPAN JADWAL (KIRIM KE DB)
function inisialisasiTombolSimpan() {
    const savePlannerBtn = document.getElementById("savePlannerBtn");
    savePlannerBtn?.addEventListener("click", async () => {
        if (!selectedDateString || !jepretanTerpilih) {
            alert("⚠️ Lengkapi pilihan tanggal dan jepretan koleksi terlebih dahulu!");
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/planner', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idJepretan: jepretanTerpilih.id, tanggalRencana: selectedDateString })
            });

            if (response.ok) {
                alert(`📅 Sukses mendaftarkan OOTD untuk hari ${selectedDateString}!`);
                muatRiwayatRencana();
                document.getElementById("outfitPreview").innerHTML = `<p style="color: #ccc; font-size: 0.85rem;">Klik tanggal untuk melihat jadwal</p>`;
                jepretanTerpilih = null;
            }
        } catch (error) {
            console.error(error);
        }
    });
}

// TAMPILKAN RIWAYAT RENCANA 
async function muatRiwayatRencana() {
    const listHistoryOotd = document.getElementById("listRencana");
    if (!listHistoryOotd) return;

    try {
        const response = await fetch('http://localhost:3000/api/planner');
        if (!response.ok) return;
        const daftarRencana = await response.json();

        if (daftarRencana.length === 0) {
            listHistoryOotd.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #888; padding: 20px;">📅 Rencana OOTD di bawah ini masih kosong.</p>`;
            return;
        }

        listHistoryOotd.innerHTML = "";
        daftarRencana.forEach(item => {
            const card = document.createElement("div");
            card.style = "background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 15px; position: relative; display: flex; flex-direction: column; text-align: left;";

            card.innerHTML = `
                <button onclick="hapusJadwalOotd(${item.id})" style="position: absolute; top: 10px; right: 10px; background: #fee2e2; color: #dc2626; border: none; width: 24px; height: 24px; border-radius: 50%; cursor: pointer;">&times;</button>
                <div style="width: 100%; height: 160px; background: #f8fafc; border-radius: 10px; overflow: hidden; display: flex; align-items: center; justify-content: center; margin-bottom: 10px;">
                    <img src="${item.preview_snapshot}" style="width: 100%; height: 100%; object-fit: contain;">
                </div>
                <span style="font-size: 11px; color: #a1824a; font-weight: bold; display: block; margin-bottom: 4px;">📅 ${item.tanggal_rencana}</span>
                <h4 style="margin: 0; font-size: 14px; color: #0f172a;">${item.nama_atasan}</h4>
                <p style="margin: 0; font-size: 12px; color: #64748b;">${item.nama_bawahan}</p>
            `;
            listHistoryOotd.appendChild(card);
        });
    } catch (error) {
        console.error(error);
    }
}

//  HAPUS JADWAL PLANNER
window.hapusJadwalOotd = async function(id) {
    if (confirm("Hapus jadwal OOTD ini?")) {
        try {
            const response = await fetch(`http://localhost:3000/api/planner/${id}`, { method: "DELETE" });
            if (response.ok) { muatRiwayatRencana(); }
        } catch (error) { console.error(error); }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    inisialisasiKalender();
    inisialisasiFiturKoleksi();
    inisialisasiTombolSimpan();
    muatRiwayatRencana();
});