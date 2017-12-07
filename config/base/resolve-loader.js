/**
 * @description webpack resolve
 * @author Leon.Cai
 */
"use strict";
const Path = require("path");

module.exports = (config) => {
    let
        tailorConfig = config.tailor,
        resolveLoaderConfig = config.resolveLoader,
        extensions = resolveLoaderConfig.extensions;

    return {
        modules: [Path.join(tailorConfig.path, "./node_modules")],
        cacheWithContext: true,
    };
};