import {digits, symbolEnum, symbols} from "./digits.js";

const ROWS = 6 + digits[0].length;
const COLS = 4 + (digits[0][0].length + 1) * 4;

const SIZE = 48;
const MARGIN = 8;

const parent = document.getElementById("parent");
const proto = document.getElementById("proto");

parent.style.height = MARGIN + ROWS * (SIZE + MARGIN) + "px";
parent.style.width = MARGIN + COLS * (SIZE + MARGIN) + "px";

const clockElements = new Array(ROWS);

proto.removeAttribute("id");
proto.style.height = SIZE + "px";
proto.style.width = SIZE + "px";

for (let i = 0; i < ROWS; i++) {
    const row = new Array(COLS);
    clockElements[i] = row;

    for (let j = 0; j < COLS; j++) {
        const elem = i === 0 && j === 0 ? proto : proto.cloneNode(true);
        row[j] = {
            elem,
            angle: [45, 45],
        };

        elem.style.top = MARGIN + i * (SIZE + MARGIN) + "px";
        elem.style.left = MARGIN + j * (SIZE + MARGIN) + "px";

        parent.appendChild(elem);
    }
}

// colon
setSymbol(11, 3, symbolEnum.colon);

function tick() {
    const now = new Date();
    const minutes = now.getSeconds();
    const hours = now.getMinutes();

    setDigit(1, 3, Math.floor(hours / 10))
    setDigit(6, 3, hours % 10)

    setDigit(14, 3, Math.floor(minutes / 10))
    setDigit(19, 3, minutes % 10)

    setTimeout(tick, 3000);
}

tick();

function setDigit(x, y, d) {
    const angles = convertGlyphToAngles(digits[d]);
    setGlyphByAngles(x, y, angles);
}

function setSymbol(x, y, s) {
    const angles = convertGlyphToAngles(symbols[s]);
    setGlyphByAngles(x, y, angles);
}

function setGlyphByAngles(x, y, angles) {
    for (let i = 0; i < angles.length; i++) {
        const row = clockElements[y + i];
        const rowAngle = angles[i];
        for (let j = 0; j < angles[i].length; j++) {
            setAngle(row[x + j], rowAngle[j]);
        }
    }
}

function convertGlyphToAngles(glyph) {
    const output = new Array(glyph.length);

    for (let i = 0; i < glyph.length; i++) {
        output[i] = new Array(glyph[i].length);
        for (let j = 0; j < glyph[i].length; j++) {
            output[i][j] = convertSymbolToAngle(glyph[i][j]);
        }
    }

    return output;
}

function convertSymbolToAngle(symbol) {
    switch (symbol) {
        case "╔":
            return [0, 270];

        case "╚":
            return [180, 270];

        case "╗":
            return [0, 90];

        case "╝":
            return [180, 90];

        case "║":
            return [180, 0];

        case "═":
            return [90, 270];

        default:
            return [45, 45];
    }
}

function setAngle(clock, angle) {
    const elem = clock.elem
    if (clock.angle.some((x, i) => x !== angle[i])) {
        const hour = elem.getElementsByClassName("hour")[0];
        const minute = elem.getElementsByClassName("minute")[0];

        minute.style.transform = `rotate(${angle[0]}deg)`;
        hour.style.transform = `rotate(${angle[1]}deg)`;
        clock.angle = angle.concat([]);
    }
}
