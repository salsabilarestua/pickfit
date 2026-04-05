window.onload = function() {
    const lemariList = document.getElementById("lemari-list");
    const canvas = document.getElementById("canvas");
    const instructionText = canvas.querySelector("p");
    let koleksiLemari = JSON.parse(localStorage.getItem("lemariPickFit")) || [];

    function updateInstruction() {
        const itemCount = canvas.querySelectorAll(".dropped-item").length;
        if (instructionText) {
            instructionText.style.display = itemCount > 0 ? "none" : "block";
        }
    }

    lemariList.innerHTML = "<h3>Ambil dari Lemari</h3>";
    const bajuSiap = koleksiLemari.filter(item => (item.status === 'siap' || !item.status));

    if (bajuSiap.length === 0) {
        lemariList.innerHTML += "<p style='color:#aaa; text-align:center; font-size:12px; padding:10px;'>Tidak ada baju 'Siap Pakai'.<br>Cek status di Lemari!</p>";
    }

    bajuSiap.forEach((item) => {
        const div = document.createElement("div");
        div.className = "item-wrapper";
        div.draggable = true;
        div.innerHTML = `
            <img src="${item.foto}" draggable="false">
            <span class="status-badge status-tersedia">Siap Pakai</span>
        `;
        div.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text/plain", item.foto);
        });
        lemariList.appendChild(div);
    });

    canvas.addEventListener("dragover", (e) => e.preventDefault());

    canvas.addEventListener("drop", (e) => {
        e.preventDefault();
        const src = e.dataTransfer.getData("text/plain");
        if (!src) return;

        const img = document.createElement("img");
        img.src = src;
        img.className = "dropped-item"; 
        const rect = canvas.getBoundingClientRect();
        img.style.position = "absolute";
        img.style.width = "160px";
        img.style.left = (e.clientX - rect.left - 80) + "px";
        img.style.top = (e.clientY - rect.top - 80) + "px";
        img.style.cursor = "move";

        canvas.appendChild(img);
        updateInstruction();

        const removeItem = () => { img.remove(); updateInstruction(); };
        img.addEventListener("dblclick", removeItem);
        img.addEventListener("contextmenu", (e) => { e.preventDefault(); removeItem(); });

        img.onmousedown = function(event) {
            if (event.button !== 0) return;
            let shiftX = event.clientX - img.getBoundingClientRect().left;
            let shiftY = event.clientY - img.getBoundingClientRect().top;

            function moveAt(pageX, pageY) {
                img.style.left = pageX - rect.left - shiftX + 'px';
                img.style.top = pageY - rect.top - shiftY + 'px';
            }
            function onMouseMove(event) { moveAt(event.clientX, event.clientY); }
            document.addEventListener('mousemove', onMouseMove);
            document.onmouseup = function() {
                document.removeEventListener('mousemove', onMouseMove);
                document.onmouseup = null;
            };
        };
        img.ondragstart = function() { return false; };
    });

    const saveBtn = document.getElementById("save-outfit");
    if (saveBtn) {
        saveBtn.addEventListener("click", () => {
            const droppedItems = canvas.querySelectorAll(".dropped-item");
            if (droppedItems.length === 0) return alert("Canvas masih kosong, nih!");

            const outfitImages = Array.from(droppedItems).map(item => item.src);
            let savedOutfits = JSON.parse(localStorage.getItem("savedOutfits")) || [];
            
            const newOutfit = {
                id: Date.now(),
                date: new Date().toLocaleString(),
                items: outfitImages
            };

            savedOutfits.push(newOutfit);
            localStorage.setItem("savedOutfits", JSON.stringify(savedOutfits));
            localStorage.setItem("koleksiOutfit", JSON.stringify(savedOutfits));
            
            alert("Outfit cantikmu berhasil disimpan ke koleksi!");
            tampilkanSavedOutfits();
        });
    }

    tampilkanSavedOutfits();
};

function tampilkanSavedOutfits() {
    const grid = document.getElementById("saved-outfits-grid");
    if (!grid) return;
    
    const savedOutfits = JSON.parse(localStorage.getItem("savedOutfits")) || [];
    grid.innerHTML = "";

    savedOutfits.forEach((outfit, index) => {
        const card = document.createElement("div");
        card.className = "outfit-card";
        let imgsHtml = outfit.items.map(url => 
            `<img src="${url}" style="width:35px; height:35px; object-fit:contain; margin:2px;">`
        ).join("");

        card.innerHTML = `
            <div class="outfit-preview">${imgsHtml}</div>
            <button class="btn-delete-outfit" onclick="hapusOutfit(${index})">Hapus</button>
        `;
        grid.appendChild(card);
    });
}

window.hapusOutfit = function(index) {
    if (confirm("Yakin mau menghapus outfit ini dari koleksi?")) {
        let savedOutfits = JSON.parse(localStorage.getItem("savedOutfits")) || [];
        savedOutfits.splice(index, 1);
        localStorage.setItem("savedOutfits", JSON.stringify(savedOutfits));
        localStorage.setItem("koleksiOutfit", JSON.stringify(savedOutfits));
        tampilkanSavedOutfits();
    }
};