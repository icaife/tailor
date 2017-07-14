"use strict";

// const
// 	Webpack = require("webpack"),
// 	WebpackDevServer = require("webpack-dev-server"),
// 	webpackConfig = require("./webpack.config.js"),
// 	compiler = Webpack(webpackConfig),
// 	config = require("./constant").server,
// 	server = new WebpackDevServer(compiler, config.devServer);

// server.listen(8080);

const Webpack = require("webpack"),
	DevMiddleware = require("webpack-dev-middleware"),
	HotMiddleware = require("webpack-hot-middleware"),
	webpackConfig = require("./webpack.config.js"),
	constant = require("./constant"),
	serverConfig = constant.server,
	compiler = Webpack(webpackConfig),
	Http = require("http"),
	Express = require("express"),
	devMiddleware = DevMiddleware(compiler, serverConfig.devServer),
	hotMiddleware = HotMiddleware(compiler),
	app = new Express();

compiler.plugin("compilation", function(compilation) {
	compilation.plugin("html-webpack-plugin-after-emit", function(data, cb) {
		console.log("html webpack plugin after emit..");
		hotMiddleware.publish({
			action: "reload"
		});
		cb();
	});
});

app
	.set("trust proxy", "loopback")
	.use(devMiddleware)
	.use(hotMiddleware)
	.use(redirectMiddle)
	.listen(serverConfig.port, serverConfig.host, function() {
		// console.log(arguments);
	});

function redirectMiddle(req, res, next) {
	let reqUrl = req.url;

	if (!/^\/?assets/.test(reqUrl)) {

	}

	next();
}