/**
 * @description config index
 * @author Leon.Cai
 */
"use strict";

module.exports = (config) => {
    let
        generateConfig = require("./generate.js"),
        webpackConfig = generateConfig(config);

    return webpackConfig;
};