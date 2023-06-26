export const IS_WALLPAPER_ENGINE = !!window["wallpaperRegisterMediaStatusListener"];

function parsePositiveInteger(value) {
    if (Number.isInteger(value)) {
        return value;
    }

    const parsed = Number.parseInt(value);
    if (Number.isFinite(parsed) && parsed >= 0) {
        return parsed;
    }

    return undefined;
}

function parseRGB(value) {
    const parts = value.split(" ")
        .map(v => Number.parseFloat(v.trim() ?? 0))
        .map(v => Number.isFinite(v) ? v : 0)
        .map(v => Math.floor(v * 255));

    return `rgb(${parts.join(",")})`;
}

export function registerHandlers(settings) {
    const url = new URL(window.location);
    let timerId = -1;

    window.wallpaperPropertyListener = {
        applyUserProperties: function (props) {
            if (props.theme) url.searchParams.set("theme", props.theme.value);
            if (props.background) url.searchParams.set("bg", props.background.value);

            if (props.background_color) url.searchParams.set("bg-color", parseRGB(props.background_color.value));
            if (props.background_image) url.searchParams.set("bg-image", `file:///${props.background_image.value}`);

            if (props.flex) url.searchParams.set("flex", props.flex.value ? "on" : "off");
            if (props.time_format) url.searchParams.set("time_format", props.time_format.value ? "24" : "12");

            if (props.fps) url.searchParams.set("fps", parsePositiveInteger(props.fps.value));
            if (props.speed) url.searchParams.set("speed", parsePositiveInteger(props.speed.value));

            if (props.top) url.searchParams.set("top", parsePositiveInteger(props.top.value))
            if (props.left) url.searchParams.set("left", parsePositiveInteger(props.left.value))

            if (props.clock_size) url.searchParams.set("clock_size", parsePositiveInteger(props.clock_size.value));
            if (props.clock_margin) url.searchParams.set("clock_margin", parsePositiveInteger(props.clock_margin.value));
            if (props.clock_hour) url.searchParams.set("clock_hour", parsePositiveInteger(props.clock_hour.value));
            if (props.clock_minute) url.searchParams.set("clock_minute", parsePositiveInteger(props.clock_minute.value));
            if (props.clock_width) url.searchParams.set("clock_width", parsePositiveInteger(props.clock_width.value));

            if (timerId !== -1) {
                clearTimeout(timerId);
            }

            setTimeout(() => {
                window.location = url;
            }, 500);
        }
    }
}