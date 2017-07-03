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
		//todo:alias
		resolve: {
			alias: {},
			// modules: [Path.resolve(basic.cur), "node_modules"],
			extensions: [".js", ".json", ".less", ".css"]
		},
		resolveLoader: {
			modules: [Path.resolve(basic.cur, "node_modules"), "node_modules"],
			extensions: [".js", ".json", ".less", ".css"]
		}
	};
};