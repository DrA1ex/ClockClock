import path from "path";
import url from "url";
import glob from "glob";

import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";
import fs from "fs";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const isDev = process.env.DEV === "1";

export default {
    mode: "production",
    entry: {
        "main": {
            import: [
                "./index.js",
                ...glob.sync("./scripts/**/*.js"),
                ...glob.sync("./style/**/*.css"),
            ]
        },
    },
    devtool: 'source-map',
    experiments: {
        topLevelAwait: true,
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle/[contenthash].js",
        assetModuleFilename: "assets/[contenthash][ext]",
        publicPath: isDev ? undefined : "/ClockClock/"
    },
    optimization: {
        splitChunks: {chunks: 'all'},
        usedExports: true,
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            }, {
                test: /\.html$/i,
                loader: "html-loader",
            }
        ],
    },
    plugins: [
        new CssMinimizerPlugin(),
        new MiniCssExtractPlugin({
            filename: "style/[contenthash].css",
            ignoreOrder: false,
        }),
        new CopyPlugin({
            patterns: [
                {from: "./LICENSE", to: "./"}
            ]
        }),
        new HtmlWebpackPlugin({
            templateContent: fs.readFileSync(path.resolve(__dirname, "index.html"), {encoding: "utf-8"})
                .replaceAll(/\s*<script.*?>.*?<\/script>/igm, "")
                .replaceAll(/\s*<link.*?>/igm, ""),
            inject: "body",
            chunks: ["main"]
        })
    ]
};