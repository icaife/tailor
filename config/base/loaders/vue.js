/**
 * @description loader for vue
 * @author Leon.Cai
 */

module.exports = config => {
	let outputConfig = config.output,
		styleLoaders = require("./style.js")(config),
		jsLoaders = require("./js.js")(config);

	let vueLoader = {
		//@see https://github.com/vuejs/vue-loader/blob/master/docs/en/options.md
		//@see https://vue-loader.vuejs.org/zh-cn/
		//@see https://vue-loader.vuejs.org/zh-cn/configurations/advanced.html
		loader: "vue-loader",
		options: {
			cssSourceMap: false,
			sourceMap: false,
			esModule: !true,
			transformToRequire: {
				img: ["src", "data-src", "data-original"] //TODO
			},
			loaders: {
				js: [jsLoaders.babelLoader, jsLoaders.eslintLoader],
				css: [
					styleLoaders.cssLoader,
					styleLoaders.postcssLoader,
					styleLoaders.lessLoader
				]
				// html: webpackCombineLoaders()
			},
			extractCSS: true,
			hotReload: config.env === "dev"
		}
	};

	return {
		vueLoader
	};
};
