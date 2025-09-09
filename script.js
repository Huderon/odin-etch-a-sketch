const RESOLUTION = 16;
const form = document.getElementById("controls");
const colourPicker = form.elements["colour-picker"];
const opacitySlider = form.elements["opacity-slider"];
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
            colour: {r: 255, g: 255, b: 255, a: 1},
            previewColour: {r: 255, g: 255, b: 255, a: 1}
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

function hexToRGBA(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
        a: parseFloat(opacitySlider.value)
    } : null;
}

function generateRGBA(a) {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return {r, g, b, a}
}

function RGBAToString({r, g, b, a}) {
    return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function compositeRGBA(fg, bg) {
    if (bg === null) return fg;

    const a = fg.a + bg.a * (1 - fg.a);

    const r = Math.round((fg.r * fg.a + bg.r * bg.a * (1 - fg.a)) / a);
    const g = Math.round((fg.g * fg.a + bg.g * bg.a * (1 - fg.a)) / a);
    const b = Math.round((fg.b * fg.a + bg.b * bg.a * (1 - fg.a)) / a);

    return {r, g, b, a};
}

function getColour(colour) {
    let RGBA;
    switch (drawModeRadioGroup.value) {
        case "erase":
            RGBA = {r: 255, g: 255, b: 255, a: parseFloat(opacitySlider.value)};
            break;
        case "random":
            RGBA = generateRGBA(parseFloat(opacitySlider.value));
            break;
        case "static":
            RGBA = hexToRGBA(colourPicker.value);
            break;
        default:
            break;
    }
    return compositeRGBA(RGBA, colour)
}

function handleMouseEvents(e) {
    if (!e.target.classList.contains("etch-a-sketch__pixel")) return;
    const pixel = e.target;
    const pixelState = pixelColours.get(pixel);
    switch (e.type) {
        case "mouseover":
            pixelState.previewColour = getColour(pixelState.colour);
            pixel.style.backgroundColor = RGBAToString(pixelState.previewColour);
            if (e.buttons === 1) {
                pixelState.colour = pixelState.previewColour;
            }
            break;
        case "mouseout":
            pixel.style.backgroundColor = RGBAToString(pixelState.colour);
            break;
        case "mousedown":
            if (e.buttons === 0) return;
            pixelState.colour = pixelState.previewColour;
            pixel.style.backgroundColor = RGBAToString(pixelState.colour);
            pixelState.previewColour = getColour(pixelState.colour);
            pixel.style.backgroundColor = RGBAToString(pixelState.previewColour);
    }
}

createGrid(RESOLUTION);
