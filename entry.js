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
		pattern = config.pattern,
		suffix = config.suffix,
		ext = basic.jsExt,
		options = {
			cwd: cwd,
			sync: true
		},
		glob = new Glob.Glob(`${pattern}/${suffix}.${ext}`, options),
		dirs = glob.found;

	dirs.forEach(function(dir) {
		let name = dir.replace(new RegExp(`/${suffix}$`, "ig"), "");

		entry[name] = [Path.join(dir)][0];
	});

	return entry;
}