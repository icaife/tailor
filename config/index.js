/**
 * @description config index
 * @author Leon.Cai
 */
"use strict";

const
	_ = require("lodash"),
	Path = require("path"),
	Entry = require("./mod/entry"),
	Module = require("./mod/module"),
	Output = require("./mod/output"),
	Plugin = require("./mod/plugin"),
	Resolve = require("./mod/resolve"),
	Constant = require("../constant"),
	ResolveLoader = require("./mod/resolve-loader"),
	ENV = Constant.env[process.env.NODE_ENV] ? Constant.env[process.env.NODE_ENV] : Constant.env.development;

let
	mergedConfig = _.merge({}, _.clone(require("./common")), _.clone(require(`./${ENV}`))),
	basic = mergedConfig.basic,
	entry = Entry({
		basic: basic
	}),
	params = {
		basic: mergedConfig.basic,
		entry: entry
	},
	context = Path.resolve(basic.root, basic.src),
	output = Output(params),
	mod = Module(params),
	resolve = Resolve(params),
	resolveLoader = ResolveLoader(params),
	plugins = Plugin(params);

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