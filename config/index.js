/**
 * @description config index
 * @author Leon.Cai
 */
"use strict";

const
	Path = require("path"),
	Entry = require("./mod/entry"),
	Module = require("./mod/module"),
	Output = require("./mod/output"),
	Plugin = require("./mod/plugin"),
	Resolve = require("./mod/resolve"),
	ResolveLoader = require("./mod/resolve-loader"),
	CommonConfig = require("./common"),
	basic = CommonConfig.basic,
	context = Path.resolve(basic.root, basic.src),
	entry = Entry({
		basic: basic
	}),
	output = Output({
		basic: basic,
		entry: entry
	}),
	mod = Module({
		basic: basic,
		entry: entry
	}),
	resolve = Resolve({
		basic: basic,
		entry: entry
	}),
	resolveLoader = ResolveLoader({
		basic: basic,
		entry: entry
	}),
	plugins = Plugin({
		basic: basic,
		entry: entry
	});

module.exports = {
	webpack: {
		context: context,
		entry: entry,
		module: mod,
		output: output,
		resolve: resolve,
		resolveLoader: resolveLoader,
		plugins: plugins,
		profile: true,
		watch: true,
	}
};