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
            intensity: 1
        };
    }

    get ["dark-gold"]() {
        return {
            lightY: this.settings.ROWS + 6,
            lightX: this.settings.COLS / 2,
            intensity: 1
        };
    }

    get ["light-gold"]() {
        return {
            lightY: this.settings.ROWS / 2,
            lightX: this.settings.COLS,
            intensity: 2
        };
    }
}

export class Settings {
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
    THEME;

    constructor() {
        const urlSearchParams = new URLSearchParams(window.location.search);
        this.params = Object.fromEntries(urlSearchParams.entries());

        this.DIGIT_HEIGHT = Glyphs.Digits[0].length
        this.DIGIT_WIDTH = Glyphs.Digits[0][0].length

        this.TOP_OFFSET = 1;
        this.LEFT_OFFSET = 1;

        this.ROWS = 2 + this.DIGIT_HEIGHT;
        this.COLS = 4 + this.DIGIT_WIDTH * 4;

        this.SIZE = ~~this.params["clock_size"] || 36;
        this.MARGIN = ~~this.params["clock_margin"] || 8;

        this.HOUR_HEIGHT = ~~this.params["clock_hour"] || (this.SIZE / 2 - 2);
        this.MINUTE_HEIGHT = ~~this.params["clock_minute"] || (this.SIZE / 2);

        this.THEME = new Themes(this);
    }


    addClass(element, name) {
        const oldValue = document.body.getAttribute("class");
        document.body.setAttribute("class", oldValue ? [name, oldValue].join(" ") : name);
    }
}