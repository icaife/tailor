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
		resolve: {
			alias: {
				"@": Path.resolve(basic.src)
			},
			modules: [Path.resolve(basic.src), "node_modules"],
			extensions: [".js", ".json", ".less", ".css", ".art", ".html", ".blade.php"]
		},
		resolveLoader: {
			modules: [Path.resolve(basic.cur, "node_modules"), "node_modules"],
			extensions: [".js", ".json", ".less", ".css", ".art", ".html", ".blade.php"]
		}
	};
};