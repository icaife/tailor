/**
 * @description module config
 * @author Leon.Cai
 * @see https://flyyang.github.io/2017/03/09/使用happypack将vuejs项目webpack初始化构建速度提升50/
 * @see https://github.com/amireh/happypack/wiki/Loader-Compatibility-List
 * @see https://github.com/amireh/happypack/issues/84
 */
"use strict";

const ExtractTextPlugin = require("extract-text-webpack-plugin"),
	HappyPack = require("happypack"),
	OS = require("os"),
	happyThreadPool = HappyPack.ThreadPool({
		size: OS.cpus().length
	});

/**
 * js handler
 * @return {Array} [description]
 */
function jsHandler(config, loaders) {
	let inputConfig = config.input,
		jsConfig = inputConfig.js,
		use = [];

	if (config.parallel) {
		use.push(loaders.happyJsLoader);
	} else {
		use.push(loaders.babelLoader, loaders.eslintLoader);
	}

	return {
		test: new RegExp(`\\.(${jsConfig.ext.join("|")})$`, "i"),
		exclude: /node_modules|vendor/,
		use: use
	};
}

/**
 * html handler
 * @param  {Object} loaders [description]
 * @param  {Object} config  [description]
 * @return {Array}         [description]
 */
function htmlHandler(config, loaders) {
	let inputConfig = config.input,
		htmlConfig = inputConfig.html;

	return {
		test: new RegExp(`\\.(${htmlConfig.ext.join("|")})$`, "i"),
		use: [loaders.artTemplateLoader, loaders.stringReplaceLoader]
	};
}

/**
 * style handler
 * @param  {Object} loaders [description]
 * @param  {Object} config  [description]
 * @return {Array}         [description]
 */
function styleHandler(config, loaders) {
	let inputConfig = config.input,
		outputConfig = config.output,
		styleInputConfig = inputConfig.style,
		styleOutputConfig = outputConfig.style,
		use = [];

	// use.push(loaders.stringReplaceLoader);
	use.push(loaders.cssLoader);

	if (styleOutputConfig.optm) {
		use.push(loaders.postcssLoader); //TODO in happypack,must separate file.postcss.config.js
	}

	if (config.parallel) {
		use.push(loaders.happyStyleLoader);
	} else {
		use.push(loaders.lessLoader);
	}

	return {
		test: new RegExp(`\\.(${styleInputConfig.ext.join("|")})$`, "i"),
		use: ExtractTextPlugin.extract({
			fallback: loaders.styleLoader.loader,
			use: use
		})
	};
}

/**
 * image handler
 * @param  {Object} loaders [description]
 * @param  {Object} config  [description]
 * @return {Array}         [description]
 */
function imageHandler(config, loaders) {
	let inputConfig = config.input,
		outputConfig = config.output,
		imageInputConfig = inputConfig.image,
		imageOutputConfig = outputConfig.image,
		rule = {
			test: new RegExp(`\\.(${imageInputConfig.ext.join("|")})$`, "i"),
			use: [loaders.fileLoader]
		};

	if (imageOutputConfig.optm) {
		// rule.use.push(loaders.imageLoader);
	}

	return rule;
}

/**
 * file handler
 * @param  {Object} loaders [description]
 * @param  {Object} config  [description]
 * @return {Array}         [description]
 */
function fileHandler(config, loaders) {
	let inputConfig = config.input,
		fileConfig = inputConfig.file;

	return {
		test: new RegExp(`\\.(${fileConfig.ext.join("|")})$`, "i"),
		use: [loaders.fileLoader]
	};
}

function vueHandler(config, loaders) {
	return {
		test: /\.vue$/,
		use: [loaders.vueLoader]
	};
}

module.exports = (config, loaders) => {
	let jsRule = jsHandler(config, loaders),
		htmlRule = htmlHandler(config, loaders),
		styleRule = styleHandler(config, loaders),
		imageRule = imageHandler(config, loaders),
		fileRule = fileHandler(config, loaders),
		vueRule = vueHandler(config, loaders);

	return {
		rules: {
			js: jsRule,
			html: htmlRule,
			style: styleRule,
			image: imageRule,
			file: fileRule,
			vue: vueRule
		},
		loaders: loaders
	};
};
