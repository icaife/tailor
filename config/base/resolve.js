/**
 * @description webpack resolve
 * @author Leon.Cai
 */
"use strict";
const
    _ = require("lodash"),
    Path = require("path");

/**
 *
 *
 *
 *
 * externals
 * 		script.src -> global var-> externals
 * output
 * 		libraryTarget: umd cmd
 * 		library require name
 *
 */

module.exports = (config) => {
    let tailorConfig = config.tailor,
        resolveConfig = config.resolve,
        inputConfig = config.input;

    return {
        alias: _.merge({
            "root": Path.resolve(config.root),
            "@": `root/${inputConfig.path}`,
        }, resolveConfig.alias),
        modules: [Path.resolve(tailorConfig.path, "./node_modules")].concat(resolveConfig.modules),
        extensions: resolveConfig.extensions,
        // cacheWithContext: false,
    };
};