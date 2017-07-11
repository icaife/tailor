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
/**
 * @description webpack.config.js
 * @type {Object}
 * @author Leon.Cai
 */

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
    devServer: {
        contentBase: Path.join(basic.root, basic.dest, basic.assets),
        compress: true,
        port: 8888,
        hot: true,
        disableHostCheck: true,
        // lazy: true,
        // filename:"",
        watchContentBase: true,
        inline: true,
        // colors: true,
        // proxy: {
        //     "/": {
        //         target: "http://www.baidu.com",
        //         secure: true
        //     }
        // }
    },
    profile: true,
    watch: true
});