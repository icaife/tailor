"use strict";

const
	Webpack = require("webpack"),
	Path = require("path"),
	HtmlWebpackPlugin = require("html-webpack-plugin"),
	StringReplaceWebpackPlugin = require("string-replace-webpack-plugin"),
	HtmlWebpackReplaceurlPlugin = require("html-webpack-replaceurl-plugin"),
	ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = (config) => {
	let plugin = [],
		entry = config.entry || {},
		basic = config.basic,
		htmlExt = config.htmlExt;

	Object.keys(entry).forEach((page) => {
		let item = entry[page],
			obj = Path.parse(page),
			fileName = `${obj.dir}/${obj.name}.${basic.htmlExt}`;

		plugin.push(new HtmlWebpackPlugin({
			filename: `${fileName}`,
			template: `${basic.root}/${basic.src}/${fileName}`,
			inject: false
		}));
	});

	plugin.push(new Webpack.optimize.UglifyJsPlugin());
	plugin.push(new ExtractTextPlugin("[name].[chunkhash:6].css"));
	plugin.push(new HtmlWebpackReplaceurlPlugin({
		mainFilePrefix: {
			js: "index",
			css: "index"
		}
	}));

	return plugin;
}