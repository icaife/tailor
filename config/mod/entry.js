/**
 * @description get entries
 * @author Leon.Cai
 */
"use strict";

const
	Glob = require("glob"),
	Path = require("path");

module.exports = (config) => {
	let entry = {},
		plugins = [],
		basic = config.basic,
		cwd = Path.join(basic.root, basic.src),
		entryConfig = basic.entry,
		glob = entryConfig.glob,
		prefix = entryConfig.prefix,
		ext = entryConfig.ext,
		options = {
			cwd: cwd,
			sync: true
		},
		globInstance = new Glob.Glob(`${glob}/${prefix}.${ext}`, options),
		dirs = globInstance.found;

	dirs.forEach(function(dir) {
		let name = dir.replace(/\.[^.]+$/ig, ""),
			mod = Path.join(name.replace(/[\/\\]+[^\/\\]+$/, ""), prefix).replace(/\\/g, "/");

		entry[mod] = [`./${dir}` /*, "webpack-hot-middleware/client?reload=true&path=http://localhost:8080/__webpack_hmr"*/ ];
	});

	return Object.assign(entry, {});
}