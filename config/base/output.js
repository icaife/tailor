/**
 * @description get entries
 * @author Leon.Cai
 */
"use strict";
const
    Path = require("path");

module.exports = (config) => {
    let
        outputConfig = config.output,
        fileName = outputConfig.useHash ? `[name].[chunkhash].js` : '[name].js',
        chunkFilename = outputConfig.useHash ? `[name].[chunkhash].js` : "[name].js",
        outputPath = Path.join(config.root, outputConfig.path),
        publicPath = /\/$/.test(outputConfig.publicPath) ? outputConfig.publicPath : outputConfig.publicPath + "/",
        jsConfig = outputConfig.js,
        assetsPath = jsConfig.path;

    let output = {
        path: outputPath,
        publicPath: publicPath,
        filename: `${assetsPath}/${fileName}`,
        chunkFilename: `${assetsPath}/${chunkFilename}`,
        sourceMapFilename: `[file].map`,
        pathinfo: !true,
        libraryTarget: "umd",
        library: config.global || {}
    };

    if (outputConfig.useHash) {
        output.hashDigestLength = outputConfig.hashLen;
    }

    return output;
};