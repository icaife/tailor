/**
 * loader for util
 */
const
    StringReplaceWebpackPlugin = require("string-replace-webpack-plugin");

module.exports = (config) => {
    let outputConfig = config.output;

    let
        stringReplaceLoader = {
            loader: StringReplaceWebpackPlugin.replace({ //TODO replace something
                replacements: [{
                    pattern: /<script[^>]+src="([^"]+)"[^>]*?>[\s\S]*?<\/script>/img,
                    replacement: function(match, src, offset, string) {
                        let result = /^(\w+:)?(\/\/)/.test(src) ? src : (`${outputConfig.publicPath}/${outputConfig.js.path}/${src}`).replace(/\\/g, "/");

                        return match.toString().replace(src, result);
                    }
                }],
                options: {}
            })
        },
        cacheLoader = {
            loader: "cache-loader",
            option: {}
        },
        threadLoader = {
            loader: "thread-loader",
            option: {}
        };

    return {
        stringReplaceLoader,
        cacheLoader,
        threadLoader
    };
};