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
			alias: { //TODO
				"@": Path.resolve(basic.root, basic.src),
				"lib": "@/common/lib",
				"jquery": "lib/jquery/jquery-3.2.1.js",
				"vue": "lib/vue/vue-2.3.3.js",
			},
			modules: [Path.resolve(basic.src), "node_modules"],
			extensions: [".js", ".json", ".less", ".css", ".art", ".html", ".blade.php"],
			// cacheWithContext: false,
		},
		resolveLoader: {
			modules: [Path.resolve(basic.cur, "node_modules"), "node_modules"],
			extensions: [".js", ".json", ".less", ".css", ".art", ".html", ".blade.php"],
			// cacheWithContext: false,
		}
	};
};