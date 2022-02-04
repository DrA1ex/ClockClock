import {Settings} from "./scripts/settings.js";
import {ClockDrawer} from "./scripts/clock.js";

const settings = new Settings();

const parent = document.getElementById("parent");
const proto = document.getElementById("proto");

const clockDrawer = new ClockDrawer(parent, proto, settings);

setTimeout(tick, 100);

function tick() {
    clockDrawer.drawClock();

    setTimeout(tick, (60 - new Date().getSeconds()) * 1000);
}
