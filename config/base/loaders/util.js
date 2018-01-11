/**
 * loader for util
 */
const StringReplaceWebpackPlugin = require("string-replace-webpack-plugin");

module.exports = config => {
	let outputConfig = config.output,
		stringReplaceLoader = {
			loader: StringReplaceWebpackPlugin.replace({
				//TODO replace something
				replacements: [
					{
						pattern: /<script[^>]+src="([^"]+)"[^>]*?>[\s\S]*?<\/script>/gim,
						replacement: function(match, src, offset, string) {
							let result = /^(\w+:)?(\/\/)/.test(src)
								? src
								: `${outputConfig.publicPath}${
										outputConfig.js.path
									}/${src}`.replace(/\\/g, "/");

							return match.toString().replace(src, result);
						}
					},
					{
						pattern: /<link[^>]+href="([^"]+)"[^>]*?\/?\/?>/gim,
						replacement: function(match, src, offset, string) {
							let result = /^(\w+:)?(\/\/)/.test(src)
								? src
								: `${outputConfig.publicPath}${
										outputConfig.js.path
									}/${src}`.replace(/\\/g, "/");

							return match.toString().replace(src, result);
						}
					},
					{
						pattern: /@font-face\s*{(.*?)}/gim,
						replacement: function(match, src, offset, string) {
							return match
								.toString()
								.replace(/url\("([\s\S]+")\)/gim, "url('$1')");
						}
					}
				]
			})
		},
		toStringLoader = {
			loader: "to-string-loader"
		},
		cacheLoader = {
			loader: "cache-loader",
			options: {}
		},
		threadLoader = {
			loader: "thread-loader",
			options: {}
		};

	return {
		stringReplaceLoader,
		cacheLoader,
		threadLoader,
		toStringLoader
	};
};
