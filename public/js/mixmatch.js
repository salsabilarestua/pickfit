window.onload = function () {
    const lemariList = document.getElementById("lemari-list");
    const canvas = document.getElementById("canvas");
    const instructionText = canvas ? canvas.querySelector("p") : null;

    if (!lemariList || !canvas) return;

    function updateInstruction() {
        const itemCount = canvas.querySelectorAll(".dropped-item").length;

        if (instructionText) {
            instructionText.style.display = itemCount > 0 ? "none" : "block";
        }
    }

    const draggableItems = lemariList.querySelectorAll(".lemari-item");

    if (draggableItems.length === 0) {
        lemariList.innerHTML += `
            <p style="color:#aaa; text-align:center; font-size:12px; padding:10px;">
                Tidak ada baju 'Siap Pakai'.<br>Cek status di Lemari!
            </p>
        `;
    }

    draggableItems.forEach((item) => {
        item.draggable = true;

        item.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("foto", item.dataset.foto);
            e.dataTransfer.setData("nama", item.dataset.nama);
        });
    });

    canvas.addEventListener("dragover", (e) => {
        e.preventDefault();
    });

    canvas.addEventListener("drop", (e) => {
        e.preventDefault();

        const src = e.dataTransfer.getData("foto");
        const nama = e.dataTransfer.getData("nama");

        if (!src) return;

        const img = document.createElement("img");
        img.src = src;
        img.alt = nama;
        img.className = "dropped-item";

        const rect = canvas.getBoundingClientRect();

        img.style.position = "absolute";
        img.style.width = "160px";
        img.style.left = e.clientX - rect.left - 80 + "px";
        img.style.top = e.clientY - rect.top - 80 + "px";
        img.style.cursor = "move";

        canvas.appendChild(img);

        updateInstruction();

        const removeItem = () => {
            img.remove();
            updateInstruction();
        };

        img.addEventListener("dblclick", removeItem);

        img.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            removeItem();
        });

        img.onmousedown = function (event) {
            if (event.button !== 0) return;

            let shiftX = event.clientX - img.getBoundingClientRect().left;
            let shiftY = event.clientY - img.getBoundingClientRect().top;

            function moveAt(pageX, pageY) {
                img.style.left = pageX - rect.left - shiftX + "px";
                img.style.top = pageY - rect.top - shiftY + "px";
            }

            function onMouseMove(event) {
                moveAt(event.clientX, event.clientY);
            }

            document.addEventListener("mousemove", onMouseMove);

            document.onmouseup = function () {
                document.removeEventListener("mousemove", onMouseMove);
                document.onmouseup = null;
            };
        };

        img.ondragstart = function () {
            return false;
        };
    });

    const saveBtn = document.getElementById("save-outfit");

    if (saveBtn) {
        saveBtn.addEventListener("click", async () => {
            const droppedItems = canvas.querySelectorAll(".dropped-item");

            if (droppedItems.length === 0) {
                return alert("Canvas masih kosong, nih!");
            }

            const outfitImages = Array.from(droppedItems).map(
                (item) => item.src
            );

            try {
                const response = await fetch("/mixmatch/save", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN": document
                            .querySelector('meta[name="csrf-token"]')
                            .getAttribute("content"),
                        "Accept": "application/json",
                    },
                    body: JSON.stringify({
                        items: outfitImages,
                    }),
                });

                const data = await response.json();

                if (data.success) {
                    alert("Outfit berhasil disimpan ke database!");

                    tampilkanSavedOutfits();
                } else {
                    alert(data.message || "Gagal menyimpan outfit.");
                }
            } catch (error) {
                console.error("Save outfit error:", error);

                alert("Terjadi error saat menyimpan outfit.");
            }
        });
    }

    tampilkanSavedOutfits();
};

async function tampilkanSavedOutfits() {
    const grid = document.getElementById("saved-outfits-grid");

    if (!grid) return;

    try {
        const response = await fetch("/mixmatch/outfits");

        const savedOutfits = await response.json();

        grid.innerHTML = "";

        savedOutfits.forEach((outfit) => {
            const card = document.createElement("div");

            card.className = "outfit-card";

            let imgsHtml = outfit.items
                .map(
                    (url) =>
                        `<img src="${url}" style="width:35px; height:35px; object-fit:contain; margin:2px;">`
                )
                .join("");

            card.innerHTML = `
                <div class="outfit-preview">${imgsHtml}</div>
                <button class="btn-delete-outfit" onclick="hapusOutfit(${outfit.id})">
                    Hapus
                </button>
            `;

            grid.appendChild(card);
        });
    } catch (error) {
        console.error("Gagal mengambil outfit:", error);
    }
}

window.hapusOutfit = async function (id) {
    if (!confirm("Yakin mau menghapus outfit ini dari koleksi?")) {
        return;
    }

    try {
        const response = await fetch(`/mixmatch/delete/${id}`, {
            method: "DELETE",
            headers: {
                "X-CSRF-TOKEN": document
                    .querySelector('meta[name="csrf-token"]')
                    .getAttribute("content"),
                "Accept": "application/json",
            },
        });

        const data = await response.json();

        if (data.success) {
            alert("Outfit berhasil dihapus!");

            tampilkanSavedOutfits();
        } else {
            alert(data.message || "Gagal menghapus outfit.");
        }
    } catch (error) {
        console.error("Delete outfit error:", error);

        alert("Terjadi error saat menghapus outfit.");
    }
};