/**
 * @description plugins for webpack config
 * @author Leon.Cai
 */
"use strict";

const
    Webpack = require("webpack"),
    Path = require("path"),
    HtmlWebpackPlugin = require("html-webpack-plugin"),
    StringReplaceWebpackPlugin = require("string-replace-webpack-plugin"),
    HtmlWebpackReplaceurlPlugin = require("html-webpack-replaceurl-plugin"),
    CleanWebpackPlguin = require("clean-webpack-plugin"),
    UglifyJsPlugin = Webpack.optimize.UglifyJsPlugin,
    ModuleConcatenationPlugin = Webpack.optimize.ModuleConcatenationPlugin,
    ExtractTextPlugin = require("extract-text-webpack-plugin");

/**
 * html webpack replace plugin
 * @param {Object} options 
 */
var HtmlWebpackPluginReplace = function(options) {
    this.options = Object.assign({
        replace: function(html) {
            return html;
        }
    }, options);
};

/**
 * apply function from compiler
 * @param  {[type]} compiler [description]
 * @return {[type]}          [description]
 */
HtmlWebpackPluginReplace.prototype.apply = function(compiler) {
    let that = this;
    compiler.plugin("compilation", function(compilation) {
        compilation.plugin("html-webpack-plugin-before-html-processing", (htmlPluginData, callback) => {
            that.replace(compilation, htmlPluginData, callback);
        });
    });
};

/**
 * replace function
 * @param  {Compilation}   compilation    [description]
 * @param  {Object}   htmlPluginData [description]
 * @param  {Function} callback       [description]
 * @return {Void}                  [description]
 */
HtmlWebpackPluginReplace.prototype.replace = function(compilation, htmlPluginData, callback) {
    let html = htmlPluginData.html,
        outputName = htmlPluginData.outputName,
        assets = htmlPluginData.assets,
        chunks = Object.keys(assets.chunks || {}),
        js = assets.js || [],
        css = assets.css || [],
        options = this.options;

    htmlPluginData.html = options.replace(html, {
        chunks: chunks,
        js: js,
        css: css,
        htmlPluginData: htmlPluginData
    });

    callback(null, htmlPluginData);
};　
function addJs(js) {
    var str = "";

    js.forEach((item) => {
        str += `<script src="${item}" type="text/javascript" defer="true"></script>`;
    });

    return `\n@push("scripts")\n${str}\n@endpush\n`;
}

function addCss(css) {
    var str = "";

    css.forEach((item) => {
        str += `<link href="${item}" rel="stylesheet">`;
    });

    return `\n@push("styles")\n${str}\n@endpush\n`;
}


module.exports = (config) => {
    let plugin = [],
        entry = config.entry || {},
        basic = config.basic,
        htmlExt = config.htmlExt;

    Object.keys(entry).forEach((page) => {
        let item = entry[page],
            obj = Path.parse(page),
            fileName = `${page}.${basic.htmlExt}`;

        plugin.push(new HtmlWebpackPlugin({
            filename: `${fileName}`,
            template: `${fileName}`,
            inject: false
        }));
    });

    plugin.push(new CleanWebpackPlguin([basic.dest], { //clean dirs
        root: basic.root,
        verbose: true
    }));
    // plugin.push(new ExtractTextPlugin({
    //     filename: "[name].[contenthash:6].css",
    //     allChunks: !true
    // }));
    plugin.push(new UglifyJsPlugin());
    plugin.push(new ModuleConcatenationPlugin());
    plugin.push(new HtmlWebpackPluginReplace({ //add js and css to file end
        replace: function(html, obj) {
            //todo
            html = html.replace(/$/, addCss(obj.css) + addJs(obj.js));
            return html;
        }
    }));
    //todo: ProvidePlugin

    return plugin;
}