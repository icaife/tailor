/**
 * @description config index
 * @author Leon.Cai
 */
"use strict";

const
	_ = require("lodash"),
	Util = require("../Util"),
	Path = require("path"),
	Entry = require("./mod/entry"),
	Module = require("./mod/module"),
	Output = require("./mod/output"),
	Plugin = require("./mod/plugin"),
	Resolve = require("./mod/resolve"),
	Constant = require("../constant"),
	ResolveLoader = require("./mod/resolve-loader");

let
	env = Constant.env[process.env.NODE_ENV] ? Constant.env[process.env.NODE_ENV] : Constant.env.development,
	commonConfig = require("./common"),
	envConfig = require(`./${env}`),
	projRoot = Util.findRoot("../", commonConfig.basic.configFile),
	projConfig = require(Path.join(projRoot, commonConfig.basic.configFile))[env];

//find project root
projConfig.basic.root = projRoot;

let
	mergedConfig = _.merge({
		constant: Constant
	}, commonConfig, envConfig, projConfig),
	basic = mergedConfig.basic,
	server = mergedConfig.server;

let
	entry = Entry(mergedConfig),
	params = _.merge({
		entry: entry
	}, mergedConfig);

let
	context = Path.resolve(basic.root, basic.src),
	output = Output(params),
	mod = Module(params),
	resolve = Resolve(params),
	resolveLoader = ResolveLoader(params),
	plugins = Plugin(params);

module.exports = {
	basic: basic,
	server: server,
	webpack: {
		context: context,
		entry: entry,
		module: mod,
		output: output,
		resolve: resolve,
		resolveLoader: resolveLoader,
		plugins: plugins,
		profile: true,
		watch: basic.env === Constant.env.development,
		// node: {
		// 	fs: "empty"
		// }
	}
};