import {Glyphs} from "./digits.js";
import {createGradient, ease, getPosAtCircle, range} from "./utils.js";

const THEME_GRADIENT = {};

export class ClockDrawer {
    static Mode = {target: 0, flex: 1};

    constructor(parent, clockProto, canvas, settings) {
        this.settings = settings;
        this.parent = parent;
        this.proto = clockProto;
        this.canvas = canvas;
        this.drawCtx = this.canvas.getContext("2d");
        this.clockElements = null;
        this.columnConfig = null;

        this.mode = ClockDrawer.Mode.target;

        this._init();
    }

    render() {
        const theme = this.settings.THEME.theme();

        if (theme.gradient) {
            if (!THEME_GRADIENT[theme]) {
                THEME_GRADIENT[theme] = createGradient(this.drawCtx, theme.gradient.angle, theme.gradient.colors, this.settings.MINUTE_HEIGHT);
            }

            this.drawCtx.fillStyle = THEME_GRADIENT[theme];
            this.drawCtx.strokeStyle = THEME_GRADIENT[theme];
        } else {
            this.drawCtx.fillStyle = theme.color;
            this.drawCtx.strokeStyle = theme.color;
        }
        this.drawCtx.lineWidth = this.settings.WIDTH || theme.width;

        for (let i = 0; i < this.settings.ROWS; i++) {
            const row = this.clockElements[i];
            for (let j = 0; j < this.settings.COLS; j++) {
                const clock = row[j];
                let changed;
                if (this.mode === ClockDrawer.Mode.flex && this.columnConfig[j].flex) {
                    changed = this.renderFlex(i, j, clock);
                } else {
                    changed = this.renderClock(i, j, clock);
                }

                if (changed) {
                    this._drawArrows(clock, theme);
                }

            }
        }
    }

    renderClock(row, col, clock) {
        if (!clock.active) {
            return false;
        }

        let changed = false;
        for (let k = 0; k < clock.angle.length; k++) {
            if (clock.angle[k] !== clock.targetAngle[k]) {
                clock.angle[k] = ease(clock.angle[k], clock.targetAngle[k], this.settings.ANIMATION_SPEED_DEG) % 360
                changed = true;
            }
        }

        clock.active = changed;
        return changed;
    }

    renderFlex(row, col, clock) {
        if (this.columnConfig[col].flex) {
            for (let k = 0; k < clock.angle.length; k++) {
                clock.angle[k] = (clock.angle[k] + this.settings.ANIMATION_SPEED_DEG) % 360;
            }

            return true;
        }

        return false;
    }

    setTime(hour, minute) {
        const {LEFT_OFFSET, TOP_OFFSET, DIGIT_WIDTH, ROWS, COLS} = this.settings;

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
                    this.setAngle(i, j, defaultPosition)
                }
            }
        }

        this._setDigit(LEFT_OFFSET, TOP_OFFSET, Math.floor(hour / 10));
        this._setDigit(LEFT_OFFSET + DIGIT_WIDTH, TOP_OFFSET, hour % 10);

        this._setDigit(LEFT_OFFSET + 2 + DIGIT_WIDTH * 2, TOP_OFFSET, Math.floor(minute / 10));
        this._setDigit(LEFT_OFFSET + 2 + DIGIT_WIDTH * 3, TOP_OFFSET, minute % 10);

        this._setSymbol(LEFT_OFFSET + DIGIT_WIDTH * 2, TOP_OFFSET, Glyphs.SymbolsEnum.colon);
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

        this.columnConfig = new Array(COLS);
        for (let i = 0; i < COLS; i++) {
            this.columnConfig[i] = {
                flex: false
            }
        }

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
            const rowAngle = angles[i];
            for (let j = 0; j < angles[i].length; j++) {
                this.setAngle(y + i, x + j, rowAngle[j]);
            }
        }
    }

    setAngle(row, col, angle) {
        this._setAngle(this.clockElements[row][col], angle);
    }

    _setAngle(clock, angle) {
        if (clock.angle.some((x, i) => x !== angle[i])) {
            clock.targetAngle = angle.concat([]);
            clock.active = true;
        }
    }

    _drawArrows(clock, theme) {
        const {HOUR_HEIGHT, MINUTE_HEIGHT, SIZE, WIDTH} = this.settings;
        const clockWidth = WIDTH || theme.width;
        const ctx = this.drawCtx;

        ctx.save();
        ctx.translate(clock.origin[0], clock.origin[1]);

        ctx.clearRect(-SIZE / 2 - clockWidth / 2, -SIZE / 2 - clockWidth / 2, SIZE + clockWidth, SIZE + clockWidth);

        ctx.beginPath();
        ctx.arc(0, 0, clockWidth / 2, 0, Math.PI * 2)
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(...getPosAtCircle(clock.angle[0], HOUR_HEIGHT));
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, 0)
        ctx.lineTo(...getPosAtCircle(clock.angle[1], MINUTE_HEIGHT));
        ctx.stroke();

        ctx.restore();
    }
}