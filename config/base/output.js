/**
 * @description get entries
 * @author Leon.Cai
 */
"use strict";
const
    Path = require("path");

module.exports = (config) => {
    let outputConfig = config.output,
        fileName = outputConfig.useHash ? `[name].[chunkhash:${outputConfig.hashLen}].js` : '[name].js',
        chunkFilename = outputConfig.useHash ? `[name].[chunkhash:${outputConfig.hashLen}].js` : "[name].js",
        outputPath = Path.join(config.root, outputConfig.path),
        publicPath = /\/$/.test(outputConfig.publicPath) ? outputConfig.publicPath : outputConfig.publicPath + "/",
        jsConfig = outputConfig.js,
        assetsPath = jsConfig.path;

    let output = {
        path: outputPath,
        publicPath: publicPath,
        filename: `${assetsPath}/${fileName}`,
        chunkFilename: `${assetsPath}/${chunkFilename}`,
        sourceMapFilename: `${assetsPath}/[name].map`,
        pathinfo: false,
        libraryTarget: outputConfig.libraryTarget,
        library: outputConfig.library
    };

    return output;
};