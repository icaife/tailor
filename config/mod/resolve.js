/**
 * @description webpack resolve
 * @author Leon.Cai
 */
"use strict";
const Path = require("path");

module.exports = (config) => {
	let entry = config.entry,
		basic = config.basic;

	return {
		alias: { //TODO
			"@": Path.resolve(basic.root, basic.src),
			"common": "@/common",
			"lib": "common/lib",
			"vendor": "common/vendor",
			"jquery": "vendor/jquery.js",
			"vue": "vendor/vue.js",
		},
		modules: [Path.resolve(basic.cur, "./node_modules"), /*Path.resolve(basic.src),*/ "./node_modules"],
		extensions: [".js", ".json", ".less", ".css", ".art", ".html", ".blade.php"],
		// cacheWithContext: false,
	};
};