import {Glyphs} from "./digits.js";

function range(from, to) {
    function* _range(from, to) {
        for (let i = from; i < to; ++i) {
            yield i;
        }
    }

    return Array.from(_range(from, to));
}

export class ClockDrawer {
    constructor(parent, clockProto, settings) {
        this.settings = settings;
        this.parent = parent;
        this.proto = clockProto;
        this.clockElements = null;

        this._init();
    }

    render() {
        const {ANIMATION_SPEED_DEG} = this.settings;

        for (let i = 0; i < this.settings.ROWS; i++) {
            for (let j = 0; j < this.settings.COLS; j++) {
                const clock = this.clockElements[i][j];
                if (!clock.active) {
                    continue;
                }

                let changed = false;
                for (let k = 0; k < clock.angle.length; k++) {
                    if (clock.angle[k] !== clock.targetAngle[k]) {
                        if (clock.angle[k] < clock.targetAngle[k]) {
                            clock.angle[k] += ANIMATION_SPEED_DEG;
                        } else {
                            clock.angle[k] -= ANIMATION_SPEED_DEG;
                        }

                        clock.arrows[k].style.transform = `rotate(${clock.angle[k]}deg)`;
                        changed = true;
                    }
                }

                clock.active = changed;
            }
        }
    }

    drawClock() {
        const {LEFT_OFFSET, TOP_OFFSET, DIGIT_WIDTH, ROWS, COLS} = this.settings;

        const now = new Date();
        const minutes = now.getMinutes();
        const hours = now.getHours();

        const defaultPosition = Glyphs._convertSymbolToAngle(".")

        const emptyZones = [
            [range(0, TOP_OFFSET), range(0, COLS)],
            [range(TOP_OFFSET, ROWS - TOP_OFFSET), range(0, LEFT_OFFSET)],
            [range(TOP_OFFSET, ROWS - TOP_OFFSET), range(COLS - LEFT_OFFSET, COLS)],
            [range(ROWS - TOP_OFFSET, ROWS), range(0, COLS)],
        ];

        for (const zones of emptyZones) {
            for (const i of zones[0]) {
                for (const j of zones[1]) {
                    this._setAngle(this.clockElements[i][j], defaultPosition)
                }
            }
        }

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
                const hour = elem.getElementsByClassName("hour")[0];
                const minute = elem.getElementsByClassName("minute")[0];

                row[j] = {
                    active: false,
                    elem,
                    arrows: [hour, minute],
                    angle: [0, 0],
                    targetAngle: [0, 0]
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
        if (clock.angle.some((x, i) => x !== angle[i])) {
            clock.targetAngle = angle.concat([]);
            clock.active = true;
        }
    }
}