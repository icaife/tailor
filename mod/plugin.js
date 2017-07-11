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
    ManifestPlugin = require("webpack-manifest-plugin"),
    UglifyJsPlugin = Webpack.optimize.UglifyJsPlugin,
    ModuleConcatenationPlugin = Webpack.optimize.ModuleConcatenationPlugin,
    ExtractTextPlugin = require("extract-text-webpack-plugin"),
    StyleExtHtmlWebpackPlugin = require("style-ext-html-webpack-plugin"),
    CopyWebpackPlugin = require("copy-webpack-plugin");

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
    let that = this,
        opts = that.options,
        config = opts.config;

    compiler.plugin("compilation", function(compilation) {
        compilation.plugin("html-webpack-plugin-before-html-processing", (htmlPluginData, callback) => {
            that.replace(compilation, htmlPluginData, callback);
        });
    });

    compiler.plugin("make", function(compilation, callback) {
        compilation.plugin("normal-module-loader", function(loaderContext, module) {
            let issuer = module.issuer;

            if (issuer) {
                let code = module.issuer._source._value,
                    modName = issuer.context.replace(Path.join(config.basic.root, config.basic.src), "").replace(/[\\\/]/g, "/");

                // module.issuer._source._value = code.replace(/(require\.ensure\([\s\S]+,[\s\S]+)\)/img, `$1,"${modName}/_parts")`);
                // console.log(module.issuer._source._value);
            }
        });
        callback();
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

//TODO
function addJs(js) {
    let items = [];

    js.forEach((item) => {
        item = item.replace(/\\/g, "/");
        items.push(`<script src="${item}" type="text/javascript" defer="true"></script>`);
    });

    return `\n@prepend("scripts-head")\n${items.join("\n")}\n@endprepend\n`;
}

function addCss(css) {
    let items = [];

    css.forEach((item) => {
        item = item.replace(/\\/g, "/");
        items.push(`<link href="${item}" rel="stylesheet">`);
    });

    return `\n@prepend("styles-head")\n${items.join("\n")}\n@endprepend\n`;
}

module.exports = (config) => {
    let plugin = [],
        entry = config.entry || {},
        basic = config.basic,
        htmlExt = config.htmlExt;

    Object.keys(entry).forEach((page) => {
        let item = entry[page],
            obj = Path.parse(page),
            fileName = `${page}.${basic.htmlExt}`,
            opts = {
                filename: `${basic.views}/${fileName}`,
                template: `${fileName}`,
                inject: false
            };

        plugin.push(new HtmlWebpackPlugin(opts));
    });

    plugin.push(
        new CleanWebpackPlguin([basic.dest], { //clean dirs
            root: basic.root,
            verbose: true
        }),
        new ExtractTextPlugin({ //extract css
            filename: `${basic.assets}/[name].[contenthash:6].css`,
            allChunks: true
        }),
        new UglifyJsPlugin({
            // mangle : false,
            // debug: true,
            // drop_console: true
        }),
        new ModuleConcatenationPlugin(),
        new HtmlWebpackPluginReplace({ //add js and css to file end
            replace: (html, obj) => {
                //todo
                html = html.replace(/$/, addCss(obj.css) + addJs(obj.js));
                return html;
            },
            config: config
        }),
        new ManifestPlugin({
            fileName: `${basic.assets}/manifest.json`,
            publicPath: `${basic.cdn}`
        }), /*new StyleExtHtmlWebpackPlugin()*/
        new CopyWebpackPlugin([{
            context: Path.join(basic.root, basic.src),
            from: {
                glob: "**/*.{blade.php,html}",
                dot: true
            },
            to: Path.join(basic.root, basic.dest, basic.views)
        }]));

    //todo: ProvidePlugin
    return plugin;
}