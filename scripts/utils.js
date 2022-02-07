const PI_DEG = Math.PI / 180;

export function range(from, to) {
    function* _range(from, to) {
        for (let i = from; i < to; ++i) {
            yield i;
        }
    }

    return Array.from(_range(from, to));
}

export function degToRad(deg) {
    return deg * PI_DEG;
}

export function getPosAtCircle(angle, radius) {
    return [radius * Math.cos(degToRad(angle)), radius * Math.sin(degToRad(angle))];
}


export function ease(current, target, step, threshold = 15, slowDown = 0.3, eps = 1e-3) {
    if (target === 0) { //Handle rotation through circle (360°)
        target = 360;
    }
    const diff = Math.abs(target - current)
    if (diff <= eps) {
        return target;
    }

    if (diff < threshold) {
        const past = (threshold - diff) / threshold;
        const factor = 1 - past * (2 - past);
        const next = current + Math.max(step * factor, step * slowDown);
        return next < target ? next : target
    }


    return current + step;
}

export function createGradient(ctx, angle, colors, size) {
    const [x1, y1] = getPosAtCircle(angle, size);
    const gradient = ctx.createLinearGradient(-x1, -y1, x1, y1);
    for (const [color, stop] of colors) {
        gradient.addColorStop(stop, color);
    }
    return gradient;
}

export function circleDegDiff(angle1, angle2) {
    return Math.abs((angle1 || 360) - (angle2 || 360)) % 360;
}