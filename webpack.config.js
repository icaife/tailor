/**
 * @description webpack config
 * @author Leon.Cai
 */
"use strict";

const
    Webpack = require("webpack"),
    Merge = require("webpack-merge"),
    Entry = require("./mod/entry"),
    Output = require("./mod/output"),
    Module = require("./mod/module"),
    Resolve = require("./mod/resolve"),
    Plugin = require("./mod/plugin"),
    Path = require("path"),
    ExtractTextPlugin = require("extract-text-webpack-plugin"),
    basic = {
        cur: Path.resolve(__dirname),
        root: Path.resolve(Path.join(__dirname, "../tffview")),
        src: "src",
        dest: "dest",
        views: "views",
        env: "dev",
        assets: "assets",
        cdn: "//cdn.tff.com/",
        entryPrefix: "index",
        entryExt: "js",
        entryGlob: "**",
        htmlExt: "blade.php",
        jsExt: "js",
        cssExt: "css"
    },
    entry = Entry({
        basic: basic
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