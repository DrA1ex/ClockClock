import {Glyphs} from "./digits.js";

export class ClockDrawer {
    constructor(parent, clockProto, settings) {
        this.settings = settings;
        this.parent = parent;
        this.proto = clockProto;
        this.clockElements = null;

        this._init();
    }

    drawClock() {
        const {LEFT_OFFSET, TOP_OFFSET, DIGIT_WIDTH} = this.settings;

        const now = new Date();
        const minutes = now.getMinutes();
        const hours = now.getHours();

        this._setDigit(LEFT_OFFSET, TOP_OFFSET, Math.floor(hours / 10));
        this._setDigit(LEFT_OFFSET + DIGIT_WIDTH, TOP_OFFSET, hours % 10);

        this._setDigit(LEFT_OFFSET + 2 + DIGIT_WIDTH * 2, TOP_OFFSET, Math.floor(minutes / 10));
        this._setDigit(LEFT_OFFSET + 2 + DIGIT_WIDTH * 3, TOP_OFFSET, minutes % 10);

        this._setSymbol(LEFT_OFFSET + DIGIT_WIDTH * 2, 1, Glyphs.SymbolsEnum.colon);
    }

    updateLighting() {
        const {lightX, lightY, intensity} = this.settings.THEME.theme();

        for (let i = 0; i < this.settings.ROWS; i++) {
            for (let j = 0; j < this.settings.COLS; j++) {
                const {elem} = this.clockElements[i][j];

                const trWidth = j - lightX;
                const trHeight = i - lightY;
                const distance = Math.sqrt(trWidth * trWidth + trHeight * trHeight);
                const intense = distance / this.settings.COLS / intensity;

                elem.style.setProperty("--cos_a", (-trWidth / distance).toString());
                elem.style.setProperty("--sin_a", (trHeight / distance).toString());
                elem.style.setProperty("--intensity", (intense).toString());
            }
        }
    }

    _init() {
        const {MARGIN, SIZE, ROWS, COLS, HOUR_HEIGHT, MINUTE_HEIGHT} = this.settings;

        this.proto.getElementsByClassName("hour")[0].style.height = HOUR_HEIGHT + "px";
        this.proto.getElementsByClassName("minute")[0].style.height = MINUTE_HEIGHT + "px";

        this.parent.style.setProperty("--rows", ROWS.toString());
        this.parent.style.setProperty("--cols", COLS.toString());

        this.parent.style.height = MARGIN + ROWS * (SIZE + MARGIN) + "px";
        this.parent.style.width = MARGIN + COLS * (SIZE + MARGIN) + "px";

        this.proto.removeAttribute("id");
        this.proto.style.height = SIZE + "px";
        this.proto.style.width = SIZE + "px";

        this.clockElements = new Array(ROWS);

        for (let i = 0; i < ROWS; i++) {
            const row = new Array(COLS);
            this.clockElements[i] = row;

            for (let j = 0; j < COLS; j++) {
                const elem = i === 0 && j === 0 ? this.proto : this.proto.cloneNode(true);
                row[j] = {
                    elem,
                    angle: [45, 45],
                };

                elem.style.top = MARGIN + i * (SIZE + MARGIN) + "px";
                elem.style.left = MARGIN + j * (SIZE + MARGIN) + "px";
                elem.style.setProperty("--x", j.toString());
                elem.style.setProperty("--y", i.toString());

                this.parent.appendChild(elem);
            }
        }

        this.updateLighting();
    }

    _setDigit(x, y, d) {
        const angles = Glyphs.convertGlyphToAngles(Glyphs.Digits[d]);
        this._setGlyphByAngles(x, y, angles);
    }

    _setSymbol(x, y, s) {
        const angles = Glyphs.convertGlyphToAngles(Glyphs.Symbols[s]);
        this._setGlyphByAngles(x, y, angles);
    }

    _setGlyphByAngles(x, y, angles) {
        for (let i = 0; i < angles.length; i++) {
            const row = this.clockElements[y + i];
            const rowAngle = angles[i];
            for (let j = 0; j < angles[i].length; j++) {
                this._setAngle(row[x + j], rowAngle[j]);
            }
        }
    }

    _setAngle(clock, angle) {
        const elem = clock.elem
        if (clock.angle.some((x, i) => x !== angle[i])) {
            const hour = elem.getElementsByClassName("hour")[0];
            const minute = elem.getElementsByClassName("minute")[0];

            minute.style.transform = `rotate(${angle[0]}deg)`;
            hour.style.transform = `rotate(${angle[1]}deg)`;
            clock.angle = angle.concat([]);
        }
    }
}