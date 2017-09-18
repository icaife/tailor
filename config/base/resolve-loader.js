/**
 * @description webpack resolve
 * @author Leon.Cai
 */
"use strict";
const Path = require("path");

module.exports = (config) => {
    let tailorConfig = config.tailor,
        resolveLoaderConfig = config.resolveLoader,
        extensions = resolveLoaderConfig.extensions;

    return {
        modules: [Path.resolve(tailorConfig.path, "./node_modules"), "node_modules"],
        // moduleExtensions: ['-loader'],
        cacheWithContext: true,
    };
};