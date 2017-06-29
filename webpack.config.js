"use strict";

const
	Webpack = require("webpack"),
	Entry = require("./entry"),
	Output = require("./output"),
	Plugin = require("./plugin"),
	Path = require("path"),
	ExtractTextPlugin = require("extract-text-webpack-plugin"),
	basic = {
		root: Path.resolve(Path.join(__dirname, "../tffview")),
		src: "src",
		dest: "dest",
		htmlExt: "blade.php",
		jsExt: "js",
		cssExt: "css"
	},
	entry = Entry({
		basic: basic,
		suffix: "index",
		pattern: "**"
	});

module.exports = {
	context: Path.join(basic.root, basic.src),
	entry: entry,
	output: Output({
		path: Path.join(basic.root, basic.dest),
		pathinfo: true,
		publicPath: "",
		// basic: basic,
		filename: "[name].[chunkhash:6].js"
	}),
	module: {
		rules: [{
			test: /\.(html|\.blade.php)$/,
			use: "html"
		}, {
			test: /\.(css|less)$/,
			use: ExtractTextPlugin.extract({
				fallback: "style-loader",
				//TODO: resolve-url-loader 链接进来
				use: ["css-loader", "less-loader"]
			})
		}, {
			test: /\.(png|jpg|gif|jpeg)$/,
			use: "url-loader"
		}]
	},
	plugins: Plugin({
		entry: entry,
		basic: basic
	})
};