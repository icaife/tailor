/**
 * @description get entries
 * @author Leon.Cai
 */
"use strict";
const Extend = require("extend");

module.exports = (config) => {
	let basic = config.basic,
		Path = require("path");

	return Extend({
		path: Path.join(basic.root, basic.dest),
		// pathinfo: true,
		publicPath: basic.cdn,
		filename: `${basic.assets}/[name].[chunkhash:6].js`,
		chunkFilename: `${basic.assets}/[name].[chunkhash:6].js`
	}, {});
};