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
        modules: [Path.resolve(tailorConfig.path, "node_modules")].concat(resolveLoaderConfig.modules),
        extensions: extensions,
        cacheWithContext: true,
    };
};