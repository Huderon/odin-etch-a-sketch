const RESOLUTION = 16;
const form = document.getElementById("controls");
const colourPicker = form.elements["colour-picker"];
const drawModeRadioGroup = form.elements["draw-mode"];
const resetButton = form.elements["reset-button"];
const canvas = document.querySelector(".etch-a-sketch__canvas");

const pixelColours = new WeakMap();

resetButton.addEventListener("click", (e) => {
    e.preventDefault();
    resetGrid();
});
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
        pixelColours.set(pixel, {
            colour: null,
            previewColour: null
        });
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

function getColour() {
    switch (drawModeRadioGroup.value) {
        case "erase":
            return "";
        case "random":
            const r = Math.floor(Math.random() * 256);
            const g = Math.floor(Math.random() * 256);
            const b = Math.floor(Math.random() * 256);
            return `rgb(${r}, ${g}, ${b})`;
        case "static":
            return colourPicker.value;
        default:
            break;
    }
}

function handleMouseEvents(e) {
    if (!e.target.classList.contains("etch-a-sketch__pixel")) return;
    const pixel = e.target;
    const pixelState = pixelColours.get(pixel);
    switch (e.type) {
        case "mouseover":
            pixelState.previewColour = getColour();
            pixel.style.backgroundColor = pixelState.previewColour;
            if (e.buttons === 1) {
                pixelState.colour = pixelState.previewColour;
            }
            break;
        case "mouseout":
            pixel.style.backgroundColor = pixelState.colour;
            break;
        case "mousedown":
            if (e.buttons === 0) return;
            pixelState.colour = pixelState.previewColour;
            pixel.style.backgroundColor = pixelState.colour;
    }
}

createGrid(RESOLUTION);
