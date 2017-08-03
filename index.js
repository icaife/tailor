/**
 * @tailor start
 * @author Leon.Cai
 */
"use strict";

const
	Path = require("path"),
	Shell = require("shelljs"),
	Log = require("./lib/util/log"),
	Webpack = require("webpack"),
	Constant = require("./constant"),
	Config = require("./config"),
	Serve = require("./server");

Log.info("work path-> " + Path.join(Config.basic.root));

if (Config.basic.env === Constant.env.development) {
	Serve.run();
} else {
	Shell.exec("webpack --colors --config webpack.config.js");
}