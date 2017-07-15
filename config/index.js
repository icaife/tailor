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
	params = {
		basic: mergedConfig.basic,
		constant: Constant
	},
	entry = Entry(params);

params.entry = entry;

let context = Path.resolve(basic.root, basic.src),
	output = Output(params),
	mod = Module(params),
	resolve = Resolve(params),
	resolveLoader = ResolveLoader(params),
	plugins = Plugin(params);

/**
 * TODO browser-sync
 */

let BrowserSync = require("browser-sync"),
	bs = BrowserSync.create(),
	Vinyl = require("vinyl-fs");

bs.init({
	proxy: "http://duang.tff.com",
	port: 8080,
	open: false,
	relaodDelay: 200,
	reloadDebounce: 1000
});

let queue = [];

function reload(event, file) {
	queue.push(file);

	setTimeout(function() {
		file = queue[0];
		if (/\.css$/.test(file)) {
			Vinyl
				.src(file)
				.pipe(bs.stream({
					once: false
				}));
		} else {
			bs.reload();
		}
		queue.length = 0;
	}, 1000);
}

bs.watch(Path.join(basic.root, basic.dest, "**/*.{php,html,js,css}"), reload);

module.exports = {
	basic: basic,
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