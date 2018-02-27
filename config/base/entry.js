/**
 * @description get entries
 * @author Leon.Cai
 */

"use strict";

const _ = require("lodash"),
	Glob = require("glob"),
	Path = require("path"),
	ENV = require("../../constant/env.js"),
	FSE = require("fs-extra"),
	Crypto = require("crypto");

module.exports = config => {
	let inputConfig = config.input,
		outputConfig = config.output,
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
		dllEntries = entryConfig.dll || {},
		commonEntries = entryConfig.common || {},
		entries = {},
		htmlInputConfig = inputConfig.html,
		pageInputExt = htmlInputConfig.ext[0];

	//change dll entry name,for cdn cache

	for (let dllName in dllEntries) {
		let modules = dllEntries[dllName];

		let hash = Crypto.createHash("md5");
		hash.update(modules.join(""));

		let name =
			dllName + "" + hash.digest("hex").slice(-outputConfig.hashLen);

		entries[name] = dllEntries[name] = modules;

		delete dllEntries[dllName];
	}

	_.merge(entries, commonEntries);

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
