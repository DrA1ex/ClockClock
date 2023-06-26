import {Glyphs} from "./digits.js";

export class Themes {
    constructor(settings) {
        this.settings = settings;
    }

    get key() {
        return this.settings.params["theme"];
    }

    theme() {
        return this[this.key] || this.light;
    }

    get light() {
        return {
            lightY: -6,
            lightX: this.settings.COLS / 2,
            intensity: 1,
            color: "black",
            gradient: null,
            width: 4
        };
    }

    get dark() {
        return {
            lightY: -6,
            lightX: this.settings.COLS / 2,
            intensity: 1,
            color: "white",
            gradient: null,
            width: 4
        };
    }

    get ["dark-gold"]() {
        return {
            lightY: this.settings.ROWS + 6,
            lightX: this.settings.COLS / 2,
            intensity: 1,
            color: "#e6b77f",
            gradient: {angle: 45, colors: [["#e2af75", 0], ["#deb682", 1]]},
            width: 4
        };
    }

    get ["light-gold"]() {
        return {
            lightY: this.settings.ROWS / 2,
            lightX: this.settings.COLS,
            intensity: 2,
            color: "#c99e65",
            gradient: {angle: 0, colors: [["#c99e65", 0], ["#d6b07f", 0.3], ["#c5995b", 1]]},
            width: 4
        };
    }

    get ["dark-noir"]() {
        return {
            lightY: -6,
            lightX: this.settings.COLS / 2,
            intensity: 1,
            color: "#383838",
            gradient: {angle: 45, colors: [["#282828", 0], ["#2f2f2f", 1]]},
            width: 8
        };
    }

    get ["blue-coated"]() {
        return {
            lightY: -6,
            lightX: this.settings.COLS / 2,
            intensity: 1,
            color: "#242424",
            gradient: {angle: 45, colors: [["#b3b6bc", 0], ["#8a8b8c", 0.2], ["#cacacb", 0.9]]},
            width: 4
        };
    }

    get oled() {
        return {
            lightY: -6,
            lightX: this.settings.COLS / 2,
            intensity: 1,
            color: "#323232",
            width: 4
        }
    }

    get glass() {
        return {
            lightY: -6,
            lightX: this.settings.COLS / 2,
            intensity: 1,
            color: "black",
            gradient: null,
            width: 4
        };
    }
}

export class Settings {
    FLEX_DELAY = 8;
    FLEX_INIT_PHASE_DELAY = 1.2;
    FLEX_PHASE_DELAY = 0.2;

    TARGET_FPS;
    ANIMATION_SPEED_DEG;

    TIME_FORMAT;

    DIGIT_HEIGHT;
    DIGIT_WIDTH;
    TOP_OFFSET;
    LEFT_OFFSET;
    ROWS;
    COLS;
    SIZE;
    MARGIN;
    HOUR_HEIGHT;
    MINUTE_HEIGHT;
    WIDTH;
    THEME;

    constructor() {
        const urlSearchParams = new URLSearchParams(window.location.search);
        this.params = Object.fromEntries(urlSearchParams.entries());

        this.TARGET_FPS = ~~this.params["fps"] || 60;

        this.TIME_FORMAT = ~~this.params["time_format"] === 12 ? 12 : 24;

        const speedValue = Number.parseFloat(this.params["speed"]);
        this.ANIMATION_SPEED_DEG = (speedValue > 0 && Number.isFinite(speedValue) ? speedValue : 60) / this.TARGET_FPS;

        this.DIGIT_HEIGHT = Glyphs.Digits[0].length;
        this.DIGIT_WIDTH = Glyphs.Digits[0][0].length;

        this.TOP_OFFSET = ~~(this.params["top"] ?? 1);
        this.LEFT_OFFSET = ~~(this.params["left"] ?? 1);

        this.ROWS = this.TOP_OFFSET * 2 + this.DIGIT_HEIGHT;
        this.COLS = this.LEFT_OFFSET * 2 + this.DIGIT_WIDTH * 4 + 2;

        this.SIZE = ~~this.params["clock_size"] || 36;
        this.MARGIN = ~~this.params["clock_margin"] || 8;

        this.HOUR_HEIGHT = ~~this.params["clock_hour"] || (this.SIZE / 2 - 2);
        this.MINUTE_HEIGHT = ~~this.params["clock_minute"] || (this.SIZE / 2);
        this.WIDTH = ~~this.params["clock_width"];

        this.THEME = new Themes(this);
    }


    addClass(element, name) {
        const oldValue = document.body.getAttribute("class");
        document.body.setAttribute("class", oldValue ? [name, oldValue].join(" ") : name);
    }
}