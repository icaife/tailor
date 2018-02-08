/**
 * @description get entries
 * @author Leon.Cai
 */

"use strict";

const _ = require("lodash"),
	Glob = require("glob"),
	Path = require("path"),
	ENV = require("../../constant/env.js"),
	FSE = require("fs-extra");

module.exports = config => {
	let inputConfig = config.input,
		cwd = Path.join(config.root, inputConfig.path),
		entryConfig = inputConfig.entry,
		glob = "**",
		prefix = entryConfig.prefix,
		ext = entryConfig.ext,
		options = {
			cwd: cwd,
			sync: true
		},
		globInstance = new Glob.Glob(`${glob}/${prefix}.${ext}`, options),
		dirs = globInstance.found,
		entries = _.merge({}, entryConfig.include || {}),
		htmlInputConfig = inputConfig.html,
		pageInputExt = htmlInputConfig.ext[0];

	if (config.env !== ENV.dll) {
		dirs.forEach(function(dir) {
			let name = dir.replace(/\.[^.]+$/gi, "").replace(/\\/g, "/");

			config.reg.lastIndex = 0;

			let template = `${name}.${pageInputExt}`;

			if (
				FSE.pathExistsSync(
					`${config.root}/${inputConfig.path}/${template}`
				) &&
				config.reg.test(name)
			) {
				entries[name] = [`./${dir}`];
			}
		});
	}

	return entries;
};
