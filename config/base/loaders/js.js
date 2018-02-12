/**
 * @description js loader
 * @author Leon.Cai
 */
const Path = require("path"),
	_ = require("lodash");

module.exports = config => {
	let inputConfig = config.input,
		babelLoader = {
			loader: "babel-loader",
			options: {
				retainLines: true,
				cacheDirectory: true,
				sourceMap: true
			}
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
				fix: !true
			}
		};

	return {
		babelLoader,
		eslintLoader
	};
};
