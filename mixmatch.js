document.addEventListener("DOMContentLoaded", () => {
    const lemariList = document.getElementById("lemari-list");
    const canvas = document.getElementById("canvas");

    const koleksi = JSON.parse(localStorage.getItem("lemariPickFit")) || [];

    // tampilkan item lemari
    koleksi.forEach((item) => {
        const div = document.createElement("div");
        div.className = "item";
        div.draggable = true;
        div.innerHTML = `<img src="${item.foto}" />`;

        div.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("src", item.foto);
        });

        lemariList.appendChild(div);
    });

    // WAJIB
    canvas.addEventListener("dragover", (e) => {
        e.preventDefault();
    });

    // DROP
    canvas.addEventListener("drop", (e) => {
    e.preventDefault();

    const src = e.dataTransfer.getData("src");

    const img = document.createElement("img");
    img.src = src;
    img.className = "dropped";

    img.style.left = e.offsetX + "px";
    img.style.top = e.offsetY + "px";
    img.style.position = "absolute";
    img.style.width = "120px";

    canvas.appendChild(img);

    let offsetX, offsetY;
    let isDragging = false;
    let isRotating = false;
    let angle = 0;
    let scale = 1;

    // ================= DRAG =================
    img.addEventListener("mousedown", (e) => {
        if (e.button === 2) {
            isRotating = true;
            return;
        }

        isDragging = true;
        offsetX = e.offsetX;
        offsetY = e.offsetY;
    });

    document.addEventListener("mousemove", (e) => {
        if (isDragging) {
            img.style.left = (e.pageX - canvas.offsetLeft - offsetX) + "px";
            img.style.top = (e.pageY - canvas.offsetTop - offsetY) + "px";
        }

        if (isRotating) {
            angle += 2;
            img.style.transform = `rotate(${angle}deg) scale(${scale})`;
        }
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
        isRotating = false;
    });

    // ================= RESIZE (SCROLL) =================
    img.addEventListener("wheel", (e) => {
        e.preventDefault();

        if (e.deltaY < 0) {
            scale += 0.1;
        } else {
            scale -= 0.1;
        }

        img.style.transform = `rotate(${angle}deg) scale(${scale})`;
    });

    // disable klik kanan menu
img.addEventListener("contextmenu", (e) => e.preventDefault());
    }); // tutup drop

}); // ⬅️ INI YANG KURANG (DOMContentLoaded)