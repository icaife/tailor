/**
 * @description webpack resolve
 * @author Leon.Cai
 */
"use strict";
const
	_ = require("lodash"),
	Path = require("path");

/**
 *
 *
 *
 *
 * externals
 * 		script.src -> global var-> externals
 * output
 * 		libraryTarget: umd cmd
 * 		library require name
 *
 */

module.exports = (config) => {
	let entry = config.entry,
		basic = config.basic;

	console.log(Path.resolve(basic.cur, "./node_modules"));

	return {
		alias: _.merge({
			"root": Path.resolve(basic.root),
			"@": `root/${basic.src}`,
		}, basic.alias),
		modules: [Path.resolve(basic.cur, "./node_modules"), "./node_modules"].concat(basic.modules),
		extensions: [".js", ".less", ".css", ".html"].concat(basic.extensions),
		// cacheWithContext: false,
	};
};