"use strict";

const
	Webpack = require("webpack"),
	DevMiddleware = require("webpack-dev-middleware"),
	HotMiddleware = require("webpack-hot-middleware"),
	Config = require("../config"),
	basic = Config.basic,
	webpackConfig = Config.webpack,
	serverConfig = Config.server;

function redirectMiddle(req, res, next) {
	let reqUrl = req.url;

	if (!/^\/?assets/.test(reqUrl)) {}

	next();
}

function run() {
	const
		compiler = Webpack(webpackConfig),
		Http = require("http"),
		Express = require("express"),
		devMiddleware = DevMiddleware(compiler, serverConfig.devServer),
		hotMiddleware = HotMiddleware(compiler),
		app = new Express();

	compiler.plugin("compilation", function(compilation) {
		// compilation.plugin("html-webpack-plugin-after-emit", function(data, cb) {
		// 	console.log("[HMR] html changed,refresh page..");
		// 	hotMiddleware.publish({
		// 		action: "reload"
		// 	});
		// 	cb();
		// });

		compilation.plugin("succeed-module", function(module) {
			let resource = module.resource;

			if (new RegExp(`.(${basic.html.ext.join("|")})$`.replace(/\./g, "\\."), "i").test(resource)) {
				hotMiddleware.publish({
					action: "reload",
					src: resource
				});
			}
		});
	});

	app
		.set("trust proxy", "loopback")
		.use(devMiddleware)
		.use(hotMiddleware)
		.use(redirectMiddle)
		.listen(serverConfig.port, serverConfig.host, function(err) {
			if (err) {
				throw new Error(err);
			}
		});
}

module.exports = {
	run: run
};