import {Settings} from "./scripts/settings.js";
import {ClockDrawer} from "./scripts/clock.js";
import * as WallpaperEngine from "./scripts/wallpaper_engine.js";

const parent = document.getElementById("parent");
const proto = document.getElementById("proto");
const canvas = document.getElementById("canvas");

const settings = new Settings();
const clockDrawer = new ClockDrawer(parent, proto, canvas, settings);

const BACKGROUNDS = ["oled", "nasa_earth", "nasa_nebula", "nasa_tunnel", "new_zeland", "switzerland",
    "windows_blue", "windows_green", "windows_light", "color", "image"];

window.global = clockDrawer;

if (WallpaperEngine.IS_WALLPAPER_ENGINE) {
    WallpaperEngine.registerHandlers(settings);
}

if (settings.THEME.key) {
    settings.addClass(document.body, `${settings.THEME.key}-theme`);
}

if (BACKGROUNDS.includes(settings.params["bg"])) {
    settings.addClass(document.body, `${settings.params["bg"]}-bg`);
}

if (settings.params["mode"] === "fullscreen") {
    settings.addClass(document.body, "fullscreen-mode");

    const zoom = Math.min(
        document.body.clientWidth / parent.clientWidth,
        document.body.clientHeight / parent.clientHeight
    ) * 0.85;

    document.body.style.zoom = zoom.toString();
}

let flexEnabled = true;
if (settings.params["flex"] === "off") {
    flexEnabled = false;
}

if (settings.params["bg-color"]) {
    document.body.style.setProperty("--bg-color", settings.params["bg-color"]);
}

if (settings.params["bg-image"]) {
    document.body.style.setProperty("--bg-image", `url(${settings.params["bg-image"]})`);
}

setTimeout(clock, 100);
let lastFlexInitRow;
let lastFlexCol;

function clock() {
    const now = new Date();
    let hours = now.getHours();
    if (settings.TIME_FORMAT === 12) {
        hours = hours % 12 || 12;
    }

    const minutes = now.getMinutes();
    const secondsLeft = 60 - now.getSeconds();

    clockDrawer.mode = ClockDrawer.Mode.target;
    clockDrawer.setTime(hours, minutes);

    if (flexEnabled && secondsLeft > settings.FLEX_DELAY) {
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
            clockDrawer.setAngle(i, lastFlexInitRow, [135, 315]);
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