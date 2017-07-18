/**
 * @tailor start
 * @author Leon.Cai
 */
const
	Shell = require("shelljs"),
	Webpack = require("webpack"),
	Constant = require("./constant"),
	Config = require("./config"),
	Server = require("./server");

Shell.exec("webpack --colors --config webpack.config.js");

if (Config.basic.env === Constant.env.development) {
	Serve.run();
}