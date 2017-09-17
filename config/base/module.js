/**
 * @description module config
 * @author Leon.Cai
 */
"use strict";
const Loaders = require("./loaders");

/**
 * js handler
 * @return {Array} [description]
 */
function jsHandler(loaders, config) {
    let
        inputConfig = config.input,
        entryConfig = inputConfig.entry;

    return [{
        test: new RegExp(`\\.(${entryConfig.ext})$`, "i"),
        exclude: /node_modules|vendor/,
        use: [loaders.babelLoader]
    }];
}

/**
 * html handler
 * @param  {Object} loaders [description]
 * @param  {Object} config  [description]
 * @return {Array}         [description]
 */
function htmlHandler(loaders, config) {
    let
        inputConfig = config.input,
        htmlConfig = inputConfig.html;

    return [{
        test: new RegExp(`\\.(${htmlConfig.ext.join("|")})$`, "i"),
        use: [loaders.artTemplateLoader]
    }];
}

/**
 * style handler
 * @param  {Object} loaders [description]
 * @param  {Object} config  [description]
 * @return {Array}         [description]
 */
function styleHandler(loaders, config) {
    let
        inputConfig = config.input,
        styleConfig = inputConfig.style;

    return [{
        test: new RegExp(`\\.(${styleConfig.ext.join("|")})$`, "i"),
        use: styleConfig.extract ? loaders.extractTextLoader : [loaders.styleLoader, loaders.cssLoader];
    }];
}

/**
 * image handler
 * @param  {Object} loaders [description]
 * @param  {Object} config  [description]
 * @return {Array}         [description]
 */
function imageHandler(loaders, config) {
    let
        inputConfig = config.input,
        imageConfig = config.image;

    return [{
        test: new RegExp(`\\.(${imageConfig.ext.join("|")})$`, "i"),
        use: [loaders.fileLoader]
    }];
}

/**
 * file handler
 * @param  {Object} loaders [description]
 * @param  {Object} config  [description]
 * @return {Array}         [description]
 */
function fileHandler(loaders, config) {
    let
        inputConfig = config.input,
        fileConfig = config.file;

    return [{
        test: new RegExp(`\\.(${fileConfig.ext.join("|")})$`, "i"),
        use: [loaders.fileLoader]
    }];
}

module.exports = (config) => {
    let
        loaders = Loaders(config),
        jsRule = jsHandler(loaders.js, config),
        htmlRule = htmlHandler(loaders.html, config),
        styleRule = styleHandler(loaders.style, config),
        imageRule = imageHandler(loaders.file, config),
        fileRule = fileHandler(loaders.file, config);

    return {
        rules: {
            js: jsRule,
            html: htmlRule,
            style: styleRule,
            image: imageRule,
            file: fileRule
        },
        loaders: loaders
    };
};