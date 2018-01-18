/**
 * @description js loader
 * @author Leon.Cai
 */
const readJson = require("../../../lib/util/read-json.js"),
	Path = require("path"),
	_ = require("lodash");

function babelrcHandler(config) {
	let babelrcPath = Path.join(config.root, ".babelrcx"),
		babelrcJson = readJson(babelrcPath),
		babelPresetPrefix = "babel-preset-",
		babelPluginPrefix = "babel-plugin-";

	if (babelrcJson.presets) {
		babelrcJson.presets = handle(babelrcJson.presets, babelPresetPrefix);
	}

	if (babelrcJson.plugins) {
		babelrcJson.plugins = handle(babelrcJson.plugins, babelPluginPrefix);
	}

	function handle(arr, prefix) {
		return arr.map(item => {
			let name = null,
				preset = null,
				type = null;

			if (typeof item === "string") {
				name = item;
				type = "string";
			} else if (item instanceof Array) {
				name = item[0];
				type = "array";
			}

			name = name.replace(prefix, "");
			preset = require.resolve(`${prefix}${name}`);

			if (type === "string") {
				item = preset;
			} else if (type === "array") {
				item[0] = preset;
			}

			return item;
		});
	}

	return babelrcJson;
}

module.exports = config => {
	let babelrc = babelrcHandler(config),
		babelLoader = {
			loader: "babel-loader",
			options: _.merge(
				{
					/**
					 * @see http://babeljs.io/docs/usage/api/
					 * @see http://babeljs.io/docs/plugins/#plugin-preset-paths
					 * @see http://babeljs.io/docs/plugins/#plugin-preset-ordering
					 * @see https://github.com/babel/babel/pull/3207
					 */
					presets: [
						[require.resolve("babel-preset-env")],
						{
							targets: {
								browsers: ["last 2 versions", "ie 9"],
								modules: false
							}
						}
					],
					babelrc: false,
					retainLines: true,
					cacheDirectory: true,
					sourceRoot: config.tailor.path
				},
				babelrc
			)
			// exclude: /vendor/
		},
		eslintLoader = {
			/**
			 * @see https://www.npmjs.com/package/eslint-loader
			 */
			loader: "eslint-loader",
			// exclude: /node_modules|vendor/,
			options: {
				configFile: Path.join(config.root, ".eslintrc"),
				failOnWarning: false, // warning occured then stop
				failOnError: false, // error occured then stop
				cache: false, // disable cache
				emitError: true,
				emitOnWarning: false,
				quiet: false,
				exclude: /node_modules|vendor/ //TODO
			}
		};

	return {
		babelLoader,
		eslintLoader
	};
};
