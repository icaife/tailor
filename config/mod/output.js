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

	return {
		path: Path.join(basic.root, basic.dest),
		// pathinfo: true,
		publicPath: basic.cdn,
		filename: `${basic.assets}/${fileName}`,
		chunkFilename: `${basic.assets}/${chunkFilename}`
	};

};