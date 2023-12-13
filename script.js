const RESOLUTION = 16;
const DEFAULT_COLOR = "#000000";
const resetButton = document.querySelector(".etch-a-sketch__reset-button");
const canvas = document.querySelector(".etch-a-sketch__canvas");
resetButton.addEventListener("click", resetGrid);
canvas.addEventListener("mouseover", handleMouseEvents);
canvas.addEventListener("mouseout", handleMouseEvents);
canvas.addEventListener("mousedown", handleMouseEvents);

function createGrid(rows) {
    const fragment = document.createDocumentFragment();
    const pixelWidth = 100 / rows;
    for (let i = 0; i < Math.pow(rows, 2); i++) {
        const pixel = document.createElement("div");
        pixel.className = "etch-a-sketch__pixel";
        pixel.style.width = `${pixelWidth}%`;
        fragment.appendChild(pixel);
    }
    canvas.innerHTML = "";
    canvas.appendChild(fragment);
}

function resetGrid() {
    const rows = prompt("How many rows? (Between 16 and 100)", "16");
    if (rows === null) return;
    if (isNaN(rows) || rows < 16 || rows > 100) {
        alert("Invalid input!");
        return;
    }
    createGrid(rows);
}

function handleMouseEvents(e) {
    if (!e.target.classList.contains("etch-a-sketch__pixel")) return;

    switch (e.type) {
        case "mouseover":
            if (e.buttons === 1) {
                e.target.style.backgroundColor = DEFAULT_COLOR;
                e.target.classList.add("etch-a-sketch__pixel--active");
            } else {
                originalColor = window.getComputedStyle(e.target).backgroundColor;
                e.target.style.backgroundColor = DEFAULT_COLOR;
            }
            break;
        case "mouseout":
            if (e.target.classList.contains("etch-a-sketch__pixel--active"))
                return;
            e.target.style.backgroundColor = originalColor;
            break;
        case "mousedown":
            if (e.buttons !== 1) return;
            e.target.style.backgroundColor = DEFAULT_COLOR;
            e.target.classList.add("etch-a-sketch__pixel--active");
            break;
    }
}

createGrid(RESOLUTION);
