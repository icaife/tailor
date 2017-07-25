/**
 * @description webpack resolve
 * @author Leon.Cai
 */
"use strict";
const
	_ = require("lodash"),
	Path = require("path");

module.exports = (config) => {
	let entry = config.entry,
		basic = config.basic;

	return {
		alias: _.merge({
			"@": Path.resolve(basic.root, basic.src)
		}, basic.alias),
		modules: [Path.resolve(basic.cur, "./node_modules"), /*Path.resolve(basic.src),*/ "./node_modules"],
		extensions: [".js", ".json", ".less", ".css", ".art", ".html", ".blade.php"],
		// cacheWithContext: false,
	};
};