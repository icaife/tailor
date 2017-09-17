/**
 * @description js loader
 * @author Leon.Cai
 */
const Path = require("path");

module.exports = (config) => {
    let tailorConfig = config.tailor;

    let babelLoader = {
            loader: "babel-loader",
            options: {
                presets: [
                    Path.join(tailorConfig.path, "./node_modules/babel-preset-es2015"),
                    Path.join(tailorConfig.path, "./node_modules/babel-preset-stage-2")
                ],
                babelrc: false,
                retainLines: true,
                cacheDirectory: true,
                // exclude: /node_modules|vendor/
            }
        },
        esLintLoader = {
            loader: "eslint-loader",
            options: {
                configFile: Path.join(config.root, ".eslintrc"),
                failOnWarning: false, // warning occured then stop
                failOnError: false, // error occured then stop
                cache: false, // disable cache
                emitError: true,
                emitOnWarning: false,
                quiet: false,
                exclude: /node_modules|vendor/
            }
        };

    return {
        babelLoader,
        esLintLoader
    };
};