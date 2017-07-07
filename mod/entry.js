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
		glob = basic.entryGlob,
		prefix = basic.entryPrefix,
		ext = basic.entryExt,
		options = {
			cwd: cwd,
			sync: true
		},
		globInstance = new Glob.Glob(`${glob}/${prefix}.${ext}`, options),
		dirs = globInstance.found;

	dirs.forEach(function(dir) {
		let name = dir.replace(/\.[^.]+$/ig, ""),
			mod = Path.join(name.replace(/[\/\\]+[^\/\\]+$/, ""), prefix).replace(/\\/g, "/");

		entry[mod] = `./${dir}`;
	});

	return entry;
}