/**
 * @description module for style
 * @author Leon.Cai
 */
const PostcssPlugins = require("./postcss-plugins.js");

module.exports = config => {
	let postcssPlugins = PostcssPlugins(config),
		sourceMap = !!config.devtool;

	let styleLoader = {
			loader: "style-loader",
			options: {}
		},
		cssLoader = {
			loader: "css-loader",
			options: {
				importLoaders: 1,
				minimize: !true,
				sourceMap: sourceMap
			}
		},
		postcssLoader = {
			loader: "postcss-loader",
			options: {
				plugins: postcssPlugins,
				sourceMap: sourceMap
			}
		},
		lessLoader = {
			loader: "less-loader",
			options: {
				sourceMap: sourceMap,
				compress: false
				// plugin: {}
			}
		};

	return {
		styleLoader,
		cssLoader,
		postcssLoader,
		lessLoader
	};
};
