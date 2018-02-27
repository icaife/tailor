/**
 * @description dev config
 * @author Leon.Cai
 */

const Path = require("path"),
	Base = require("./base"),
	Webpack = require("webpack"),
	Log = require("../lib/util/log"),
	ENV = require("../constant/env.js");

/**
 * handler for webpack config
 * @return {[type]} [description]
 */
function generateConfig(config) {
	let outputConfig = config.output,
		publicPath = /\/$/.test(outputConfig.publicPath)
			? outputConfig.publicPath
			: outputConfig.publicPath + "/";

	outputConfig.publicPath = publicPath.replace(/([\w_-]+)\/+/g, "$1/");

	let base = Base(config),
		inputConfig = config.input,
		context = Path.resolve(config.root, inputConfig.path),
		entry = entryHandler(config, base.entry),
		module = moduleHandler(config, base.module),
		plugins = pluginsHandler(config, base.plugins),
		devtool = config.devtool;

	if (!Object.keys(entry).length) {
		Log.error(`no entry found,plz check.`);
		process.exit(1);
	}

	return {
		target: "web",
		cache: !!config.cache,
		bail: false,
		context: context,
		entry: entry,
		module: module,
		plugins: plugins,
		output: base.output,
		resolve: base.resolve,
		resolveLoader: base.resolveLoader,
		profile: false,
		externals: config.externals || {},
		watch: config.watch, //middleware default true
		/**
		 * @see https://juejin.im/post/58293502a0bb9f005767ba2f
		 */
		devtool: devtool
	};
}

/**
 * handler for entry
 * @return {Object}
 */
function entryHandler(config, entry) {
	let tailorConfig = config.tailor,
		outputConfig = config.output,
		hotClient = Path.resolve(
			`${tailorConfig.path}/lib/helper/hot-client.js`
		),
		hotClientQuery = `?path=${
			outputConfig.publicPath
		}__webpack_hmr&reload=true`;

	if (config.env === ENV.dev) {
		//if dev,add hot client in entry
		Object.keys(entry).forEach(page => {
			let chunks = entry[page] || [];

			chunks.unshift(hotClient + hotClientQuery);
		});
	}

	return entry;
}

/**
 * handler for module config
 * @param  {Object} config [description]
 * @param  {Object} module [description]
 * @return {Object}        [description]
 */
function moduleHandler(config, module) {
	let rules = module.rules,
		htmlRule = rules.html,
		jsRule = rules.js,
		styleRule = rules.style,
		imageRule = rules.image,
		fileRule = rules.file,
		vueRule = rules.vue;

	//js rule
	//TODO

	//style rule
	//TODO

	//image rule
	//TODO

	let result = {
		rules: [htmlRule, jsRule, styleRule, imageRule, fileRule, vueRule],
		noParse: [/vendor/]
	};

	return result;
}

/**
 * generate plugins
 * @return {Array} [description]
 */
function pluginsHandler(config, plugins) {
	let commonPlugin = plugins.common,
		htmlPlugin = plugins.html,
		stylePlugin = plugins.style,
		devPlugin = plugins.dev,
		dllPlugin = plugins.dll,
		result = [];

	result.push(...dllPlugin);

	if (config.env === ENV.dev) {
		result.push(...devPlugin);
	} else {
		result.push(...plugins.optm);
	}

	result.push(
		...commonPlugin,
		...htmlPlugin,
		...stylePlugin,
		...plugins.lint
	);

	return result;
}

module.exports = generateConfig;
