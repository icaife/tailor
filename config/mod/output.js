/**
 * @description get entries
 * @author Leon.Cai
 */
"use strict";
const
	Path = require("path");

module.exports = (config) => {
	let basic = config.basic,
		outputConfig = basic.output,
		fileName = outputConfig.useHash ? `[name].[chunkhash:${outputConfig.hashLen}].js` : '[name].js',
		chunkFilename = outputConfig.useHash ? `[name].[chunkhash:${outputConfig.hashLen}].js` : "[name].js";

	let output = {
		path: Path.join(basic.root, basic.dest),
		publicPath: /\/$/.test(basic.cdn) ? basic.cdn : basic.cdn + "/",
		filename: `${basic.assets}/${fileName}`,
		chunkFilename: `${basic.assets}/${chunkFilename}`,
		sourceMapFilename: `${basic.assets}/[name].map`,
		pathinfo: true,
		libraryTarget: "umd",
		library: basic.globalVars
	};

	return output;
};