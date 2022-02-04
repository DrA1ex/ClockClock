import {Settings} from "./scripts/settings.js";
import {ClockDrawer} from "./scripts/clock.js";


const parent = document.getElementById("parent");
const proto = document.getElementById("proto");
const canvas = document.getElementById("canvas");

const settings = new Settings();
const clockDrawer = new ClockDrawer(parent, proto, canvas, settings);

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

setTimeout(tick, 100);

function tick() {
    clockDrawer.drawClock();

    setTimeout(tick, (60 - new Date().getSeconds()) * 1000);
}


setInterval(() => clockDrawer.render(), 1000 / settings.TARGET_FPS);