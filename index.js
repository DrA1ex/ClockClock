import {digits, symbolEnum, symbols} from "./digits.js";

const DIGIT_HEIGHT = digits[0].length
const DIGIT_WIDTH = digits[0][0].length

const TOP_OFFSET = 1;
const LEFT_OFFSET = 1;

const ROWS = 2 + DIGIT_HEIGHT;
const COLS = 4 + DIGIT_WIDTH * 4;

const SIZE = 36;
const MARGIN = 8;

const parent = document.getElementById("parent");
const proto = document.getElementById("proto");

parent.style.height = MARGIN + ROWS * (SIZE + MARGIN) + "px";
parent.style.width = MARGIN + COLS * (SIZE + MARGIN) + "px";

const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());
if (params.theme) {
    document.body.setAttribute("class", `${params.theme}-theme`);
}

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

function tick() {
    drawClock();

    setTimeout(tick, (60 - new Date().getSeconds()) * 1000);
}

tick();

function drawClock() {
    const now = new Date();
    const minutes = now.getMinutes();
    const hours = now.getHours();

    setDigit(LEFT_OFFSET, TOP_OFFSET, Math.floor(hours / 10));
    setDigit(LEFT_OFFSET + DIGIT_WIDTH, TOP_OFFSET, hours % 10);

    setDigit(LEFT_OFFSET + 2 + DIGIT_WIDTH * 2, TOP_OFFSET, Math.floor(minutes / 10));
    setDigit(LEFT_OFFSET + 2 + DIGIT_WIDTH * 3, TOP_OFFSET, minutes % 10);

    // colon
    setSymbol(LEFT_OFFSET + DIGIT_WIDTH * 2, 1, symbolEnum.colon);
}

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
