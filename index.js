import {Settings} from "./scripts/settings.js";
import {ClockDrawer} from "./scripts/clock.js";

const parent = document.getElementById("parent");
const proto = document.getElementById("proto");
const canvas = document.getElementById("canvas");

const settings = new Settings();
const clockDrawer = new ClockDrawer(parent, proto, canvas, settings);

window.global = clockDrawer;

if (settings.THEME.key) {
    settings.addClass(document.body, `${settings.THEME.key}-theme`);
}

if (settings.params["bg"] === "oled") {
    settings.addClass(document.body, "oled-bg");
}

if (settings.params["mode"] === "fullscreen") {
    settings.addClass(document.body, "fullscreen-mode");

    const zoom = Math.min(
        document.body.clientWidth / parent.clientWidth,
        document.body.clientHeight / parent.clientHeight
    ) * 0.85;

    document.body.style.zoom = zoom.toString();
}

setTimeout(clock, 100);
let lastFlexInitRow;
let lastFlexCol;

function clock() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const secondsLeft = 60 - now.getSeconds();

    clockDrawer.mode = ClockDrawer.Mode.target;
    clockDrawer.setTime(hours, minutes);

    if (secondsLeft > settings.FLEX_DELAY) {
        setTimeout(() => {
            for (const item of clockDrawer.columnConfig) {
                item.flex = false;
            }

            lastFlexInitRow = lastFlexCol = settings.COLS;

            flex(secondsLeft - settings.FLEX_DELAY);
        }, settings.FLEX_DELAY * 1000);
    } else {
        setTimeout(clock, secondsLeft * 1000);
    }
}

function flex(left) {
    if (lastFlexInitRow > 0) {
        --lastFlexInitRow;
        for (let i = 0; i < settings.ROWS; i++) {
            clockDrawer.setAngle(clockDrawer.clockElements[i][lastFlexInitRow], [135, 315]);
        }
    } else if (lastFlexCol > 0) {
        clockDrawer.mode = ClockDrawer.Mode.flex;
        clockDrawer.columnConfig[--lastFlexCol].flex = true;
    }

    if (left > 0) {
        const delay = lastFlexInitRow > 0 ? settings.FLEX_INIT_PHASE_DELAY : settings.FLEX_PHASE_DELAY;
        setTimeout(() => flex(left - delay), delay * 1000);
    } else {
        setTimeout(clock, settings.FLEX_PHASE_DELAY * 1000);
    }
}


setInterval(() => clockDrawer.render(), 1000 / settings.TARGET_FPS);