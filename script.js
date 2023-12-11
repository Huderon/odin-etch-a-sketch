const canvas = document.querySelector(".etch-a-sketch__canvas");

function createGrid(rows) {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < Math.pow(rows, 2); i++) {
        const pixel = document.createElement("div");
        pixel.className = "etch-a-sketch__pixel";
        pixel.style.width = `${100 / rows}%`;
        fragment.appendChild(pixel);
    }
    canvas.appendChild(fragment);
}

createGrid(64);
