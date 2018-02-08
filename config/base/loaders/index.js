/**
 * @description loaders
 * @author Leon.Cai
 * @see https://doc.webpack-china.org/loaders
 *
 */
const FileLoader = require("./file.js"),
	HtmlLoader = require("./html.js"),
	ImageLoader = require("./image.js"),
	JSLoader = require("./js.js"),
	StyleLoader = require("./style.js"),
	VueLoader = require("./vue.js"),
	UtilLoader = require("./util.js"),
	happyLoader = require("./happypack.js");

let loaders = null;

function init(config) {
	if (loaders) {
		return loaders;
	}

	let file = FileLoader(config),
		html = HtmlLoader(config),
		image = ImageLoader(config),
		js = JSLoader(config),
		style = StyleLoader(config),
		vue = VueLoader(config),
		util = UtilLoader(config),
		happy = happyLoader;

	loaders = Object.assign({}, file, html, image, js, style, vue, util, happy);

	return loaders;
}

module.exports = init;
