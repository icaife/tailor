"use strict";

const
	Webpack = require("webpack"),
	Path = require("path"),
	HtmlWebpackPlugin = require("html-webpack-plugin"),
	StringReplaceWebpackPlugin = require("string-replace-webpack-plugin"),
	HtmlWebpackReplaceurlPlugin = require("html-webpack-replaceurl-plugin"),
	ExtractTextPlugin = require("extract-text-webpack-plugin");

/**
 * html webpack replace plugin
 * @param {Object} options 
 */
var HtmlWebpackPluginReplace = function(options){
    this.options = Object.assign({
        replace : function(html){
            return html;
        }
    },options);
};

/**
 * apply function from compiler
 * @param  {[type]} compiler [description]
 * @return {[type]}          [description]
 */
HtmlWebpackPluginReplace.prototype.apply = function (compiler){
    let that = this;
    compiler.plugin("compilation", function (compilation){
        compilation.plugin("html-webpack-plugin-before-html-processing", (htmlPluginData, callback) => {
            that.replace(compilation,htmlPluginData,callback);
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
HtmlWebpackPluginReplace.prototype.replace = function(compilation,htmlPluginData,callback){
    let html = htmlPluginData.html,
        outputName = htmlPluginData.outputName,
        assets = htmlPluginData.assets,
        chunks = Object.keys(assets.chunks || {}),
        js = assets.js || [],
        css = assets.css || [],
        options = this.options;

    htmlPluginData.html = options.replace(html,{
        chunks : chunks,
        js : js,
        css : css,
        htmlPluginData : htmlPluginData
    });

    callback(null,htmlPluginData);
};
　
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

	plugin.push(new Webpack.optimize.UglifyJsPlugin());
	plugin.push(new ExtractTextPlugin("[name].[chunkhash:6].css"));
	// plugin.push(new HtmlWebpackReplaceurlPlugin({
	// 	mainFilePrefix: {
	// 		js: "index",
	// 		css: "index"
	// 	}
	// }));
    plugin.push(new HtmlWebpackPluginReplace({
        replace : function(html,obj){
            console.log(html,obj);
            return html;
        }
    }));


	return plugin;
}