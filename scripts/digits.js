export class Glyphs {
    static Digits = [
        [
            "╔══╗",
            "║╔╗║",
            "║║║║",
            "║║║║",
            "║╚╝║",
            "╚══╝",
        ], [
            "╔═╗.",
            "╚╗║.",
            ".║║.",
            ".║║.",
            "╔╝╚╗",
            "╚══╝",
        ], [
            "╔══╗",
            "╚═╗║",
            "╔═╝║",
            "║╔═╝",
            "║╚═╗",
            "╚══╝",
        ], [
            "╔══╗",
            "╚═╗║",
            "╔═╝║",
            "╚═╗║",
            "╔═╝║",
            "╚══╝",
        ], [
            "╔╗╔╗",
            "║║║║",
            "║╚╝║",
            "╚═╗║",
            "..║║",
            "..╚╝",
        ], [
            "╔══╗",
            "║╔═╝",
            "║╚═╗",
            "╚═╗║",
            "╔═╝║",
            "╚══╝",
        ], [
            "╔══╗",
            "║╔═╝",
            "║╚═╗",
            "║╔╗║",
            "║╚╝║",
            "╚══╝",
        ], [
            "╔══╗",
            "╚═╗║",
            "..║║",
            "..║║",
            "..║║",
            "..╚╝",
        ], [
            "╔══╗",
            "║╔╗║",
            "║╚╝║",
            "║╔╗║",
            "║╚╝║",
            "╚══╝",
        ], [
            "╔══╗",
            "║╔╗║",
            "║╚╝║",
            "╚═╗║",
            "╔═╝║",
            "╚══╝",
        ]
    ];

    static Symbols = [
        [
            "..",
            "╔╗",
            "╚╝",
            "╔╗",
            "╚╝",
            "..",
        ]
    ]
    static SymbolsEnum = {
        colon: 0
    }

    static convertGlyphToAngles(glyph) {
        const output = new Array(glyph.length);

        for (let i = 0; i < glyph.length; i++) {
            output[i] = new Array(glyph[i].length);
            for (let j = 0; j < glyph[i].length; j++) {
                output[i][j] = this._convertSymbolToAngle(glyph[i][j]);
            }
        }

        return output;
    }

    static _convertSymbolToAngle(symbol) {
        switch (symbol) {
            case "╔":
                return [0, 90];

            case "╚":
                return [0, 270];

            case "╗":
                return [180, 90];

            case "╝":
                return [180, 270];

            case "║":
                return [270, 90];

            case "═":
                return [0, 180];

            default:
                return [135, 135];
        }
    }
}
