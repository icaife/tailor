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
 * externals
 * 		script.src -> global var-> externals
 * output
 * 		libraryTarget: umd cmd
 * 		library require name
 *
 */

module.exports = (config) => {
    let
        tailorConfig = config.tailor,
        resolveConfig = config.resolve,
        inputConfig = config.input,
        projModule = Path.resolve(config.root, inputConfig.path);

    return {
        alias: _.merge({
            "root": Path.resolve(config.root),
            "@": `root/${inputConfig.path}`,
        }, resolveConfig.alias),
        modules: [Path.join(tailorConfig.path, "node_modules"), "node_modules"],
        extensions: [".js", ".less", ".css", ".html", ".json"],
        // cacheWithContext: true
    };
};