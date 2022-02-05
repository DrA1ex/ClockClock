import {Glyphs} from "./digits.js";

const PI_DEG = Math.PI / 180;
const THEME_GRADIENT = {};

function range(from, to) {
    function* _range(from, to) {
        for (let i = from; i < to; ++i) {
            yield i;
        }
    }

    return Array.from(_range(from, to));
}

function degToRad(deg) {
    return deg * PI_DEG;
}

function getPosAtCircle(angle, radius) {
    return [radius * Math.cos(degToRad(angle)), radius * Math.sin(degToRad(angle))];
}

export class ClockDrawer {
    constructor(parent, clockProto, canvas, settings) {
        this.settings = settings;
        this.parent = parent;
        this.proto = clockProto;
        this.canvas = canvas;
        this.drawCtx = this.canvas.getContext("2d");
        this.clockElements = null;

        this._init();
    }

    render() {
        const {ANIMATION_SPEED_DEG} = this.settings;
        const theme = this.settings.THEME.theme();

        if (theme.gradient) {
            if (!THEME_GRADIENT[theme]) {
                const [x1, y1] = getPosAtCircle(theme.gradient.angle, theme.width / 2);
                const gradient = this.drawCtx.createLinearGradient(-x1, -y1, x1, y1);
                for (const [color, stop] of theme.gradient.colors) {
                    gradient.addColorStop(stop, color);
                }

                THEME_GRADIENT[theme] = gradient;
            }

            this.drawCtx.fillStyle = THEME_GRADIENT[theme];
            this.drawCtx.strokeStyle = THEME_GRADIENT[theme];
        } else {
            this.drawCtx.fillStyle = theme.color;
            this.drawCtx.strokeStyle = theme.color;
        }
        this.drawCtx.lineWidth = theme.width;

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
                            clock.angle[k] = (clock.angle[k] + ANIMATION_SPEED_DEG) % 360;
                        } else {
                            clock.angle[k] = (clock.angle[k] - ANIMATION_SPEED_DEG) % 360;
                        }

                        changed = true;
                    }
                }

                if (changed) {
                    this._drawArrows(clock, theme);
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
        const {MARGIN, SIZE, ROWS, COLS} = this.settings;

        this.parent.style.setProperty("--rows", ROWS.toString());
        this.parent.style.setProperty("--cols", COLS.toString());

        const canvasHeight = MARGIN + ROWS * (SIZE + MARGIN);
        const canvasWidth = MARGIN + COLS * (SIZE + MARGIN);

        this.canvas.height = canvasHeight * 4;
        this.canvas.width = canvasWidth * 4;
        this.drawCtx.scale(4, 4);

        this.canvas.style.height = canvasHeight + "px";
        this.canvas.style.width = canvasWidth + "px";

        this.parent.style.height = canvasHeight + "px";
        this.parent.style.width = canvasWidth + "px";

        this.proto.removeAttribute("id");
        this.proto.style.height = SIZE + "px";
        this.proto.style.width = SIZE + "px";

        this.clockElements = new Array(ROWS);

        for (let i = 0; i < ROWS; i++) {
            const row = new Array(COLS);
            this.clockElements[i] = row;

            for (let j = 0; j < COLS; j++) {
                const elem = i === 0 && j === 0 ? this.proto : this.proto.cloneNode(true);

                const top = MARGIN + i * (SIZE + MARGIN);
                const left = MARGIN + j * (SIZE + MARGIN);

                elem.style.top = top + "px";
                elem.style.left = left + "px";
                elem.style.setProperty("--x", j.toString());
                elem.style.setProperty("--y", i.toString());

                row[j] = {
                    active: false,
                    elem,
                    origin: [left + SIZE / 2 + 2, top + SIZE / 2 + 2], // +2 for container and clock border
                    angle: [0, 0],
                    targetAngle: [0, 0]
                };

                this.parent.appendChild(elem);
            }
        }

        this.updateLighting();
        this.render();
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

    _drawArrows(clock, theme) {
        const {HOUR_HEIGHT, MINUTE_HEIGHT, SIZE} = this.settings;
        const ctx = this.drawCtx;

        ctx.save();
        ctx.translate(clock.origin[0], clock.origin[1]);

        ctx.clearRect(-SIZE / 2 - theme.width / 2, -SIZE / 2 - theme.width / 2,
            SIZE + theme.width, SIZE + theme.width);

        ctx.beginPath();
        ctx.arc(0, 0, theme.width / 2, 0, Math.PI * 2)
        ctx.fill();

        ctx.beginPath();
        {
            const [x1, y1] = getPosAtCircle(clock.angle[0], HOUR_HEIGHT);
            ctx.moveTo(0, 0);
            ctx.lineTo(x1, y1);
        }
        ctx.stroke();

        ctx.beginPath();
        {
            const [x1, y1] = getPosAtCircle(clock.angle[1], MINUTE_HEIGHT);
            ctx.moveTo(0, 0)
            ctx.lineTo(x1, y1);
        }
        ctx.stroke();

        ctx.restore();
    }
}