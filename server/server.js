"use strict";

const
	Path = require("path"),
	Webpack = require("webpack"),
	BrowserSync = require("browser-sync"),
	Vinyl = require("vinyl-fs"),
	Constant = require("../constant"),
	bs = BrowserSync.create(),
	basic = Constant.basic,
	server = Constant.server;

let queue = [];

function reload(event, file) {
	queue.push(file);

	setTimeout(function() {
		file = queue[0];

		if (/\.css$/.test(file)) {
			Vinyl
				.src(file)
				.pipe(bs.stream({
					once: false
				}));
		} else {
			bs.reload();
		}
		queue.length = 0;
	}, 1000);
}

module.exports = {
	run: function(callback) {
		return new Promise((resolve, reject) => {
			bs.init({
				proxy: basic.domain,
				port: server.port,
				open: false,
				relaodDelay: 200,
				reloadDebounce: 1000
			}, function(e) {
				resolve(e);
				// bs.watch(Path.join(basic.root, basic.dest, "**/*.{php,html,js,css}"), reload);
			});
		});
	}
};

// const
// 	Webpack = require("webpack"),
// 	WebpackDevServer = require("webpack-dev-server"),
// 	webpackConfig = require("./webpack.config.js"),
// 	compiler = Webpack(webpackConfig),
// 	config = require("./constant").server,
// 	server = new WebpackDevServer(compiler, config.devServer);

// server.listen(8080);

// const Webpack = require("webpack"),
//     DevMiddleware = require("webpack-dev-middleware"),
//     HotMiddleware = require("webpack-hot-middleware"),
//     webpackConfig = require("./webpack.config.js"),
//     constant = require("./constant"),
//     serverConfig = constant.server,
//     compiler = Webpack(webpackConfig),
//     Http = require("http"),
//     Express = require("express"),
//     devMiddleware = DevMiddleware(compiler, serverConfig.devServer),
//     hotMiddleware = HotMiddleware(compiler),
//     app = new Express();

// compiler.plugin("compilation", function(compilation) {
//     compilation.plugin("html-webpack-plugin-after-emit", function(data, cb) {
//         console.log("html webpack plugin after emit..");
//         hotMiddleware.publish({
//             action: "reload"
//         });
//         cb();
//     });
// });

// app
//     .set("trust proxy", "loopback")
//     .use(devMiddleware)
//     .use(hotMiddleware)
//     .use(redirectMiddle)
//     .listen(serverConfig.port, serverConfig.host, function() {
//         // console.log(arguments);
//     });

// function redirectMiddle(req, res, next) {
//     let reqUrl = req.url;

//     if (!/^\/?assets/.test(reqUrl)) {

//     }

//     next();
// }
//
//
//