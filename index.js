/**
 * @tailor start
 * @author Leon.Cai
 */
"use strict";

const
	Path = require("path"),
	Shell = require("shelljs"),
	Webpack = require("webpack"),
	Constant = require("./constant"),
	Config = require("./config"),
	Serve = require("./server");

console.log("[tailor]work path: " + Path.join(Config.basic.root));

if (Config.basic.env === Constant.env.development) {
	Serve.run();
} else {
	Shell.exec("webpack --colors --config webpack.config.js");
}