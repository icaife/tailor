/**
 * @description get entries
 * @author Leon.Cai
 */
"use strict";

const
	_ = require("lodash"),
	Glob = require("glob"),
	Path = require("path");

module.exports = (config) => {
	let entry = {},
		plugins = [],
		basic = config.basic,
		envs = config.constant.env,
		cwd = Path.join(basic.root, basic.src);

	if (basic.env !== envs.dll) {
		let entryConfig = basic.entry,
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

			entry[mod] = [`./${dir}`];
		});
	} else {
		_.merge(entry, basic.vendor);
	}

	return Object.assign({}, entry);
};