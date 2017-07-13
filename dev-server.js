"use strict";

const
	Webpack = require("webpack"),
	WebpackDevServer = require("webpack-dev-server"),
	webpackConfig = require("./webpack.config.js"),
	compiler = Webpack(webpackConfig),
	config = require("./constant").server,
	server = new WebpackDevServer(compiler, config.devServer);

server.listen(8080);