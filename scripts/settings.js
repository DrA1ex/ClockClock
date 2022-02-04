import {Glyphs} from "./digits.js";

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
    }

    addClass(element, name) {
        const oldValue = document.body.getAttribute("class");
        document.body.setAttribute("class", oldValue ? [name, oldValue].join(" ") : name);
    }
}