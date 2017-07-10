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
    Config = require("./mod/config"),
    Path = require("path"),
    ExtractTextPlugin = require("extract-text-webpack-plugin"),
    basic = Config.basic,
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
    }),
    profile: true,
    // watch: true
});