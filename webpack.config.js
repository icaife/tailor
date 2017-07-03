/**
 * @description webpack config
 * @author Leon.Cai
 */
"use strict";

const
    Webpack = require("webpack"),
    Merge = require("webpack-merge"),
    Entry = require("./entry"),
    Output = require("./output"),
    Module = require("./module"),
    Resolve = require("./resolve"),
    Plugin = require("./plugin"),
    Path = require("path"),
    ExtractTextPlugin = require("extract-text-webpack-plugin"),
    basic = {
        cur: Path.resolve(__dirname),
        root: Path.resolve(Path.join(__dirname, "../tffview")),
        src: "src",
        dest: "dest",
        htmlExt: "blade.php",
        jsExt: "js",
        cssExt: "css",
        views: "views",
        assets: "assets",
        env: "dev"
    },
    entry = Entry({
        basic: basic,
        suffix: "index",
        pattern: "**"
    });

module.exports = Merge({
    context: Path.join(basic.root, basic.src),
    entry: entry,
    output: Output({
        basic: basic,
        entry: entry
    }),
    module: Module({
        basic: basic,
        entry: entry
    })
}, {
    profile: true,
    resolve: Resolve({
        basic: basic,
        entry: entry
    }).resolve,
    resolveLoader: Resolve({
        basic: basic,
        entry: entry
    }).resolveLoader,
    plugins: Plugin({
        basic: basic,
        entry: entry
    })
});