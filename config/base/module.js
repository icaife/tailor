/**
 * @description module config
 * @author Leon.Cai
 */
"use strict";
const
    Loaders = require("./loaders");

/**
 * js handler
 * @return {Array} [description]
 */
function jsHandler(config, loaders) {
    let
        inputConfig = config.input,
        jsConfig = inputConfig.js;

    return {
        test: new RegExp(`\\.(${jsConfig.ext.join("|")})$`, "i"),
        exclude: /node_modules|vendor/,
        use: [loaders.babelLoader]
    };
}

/**
 * html handler
 * @param  {Object} loaders [description]
 * @param  {Object} config  [description]
 * @return {Array}         [description]
 */
function htmlHandler(config, loaders) {
    let
        inputConfig = config.input,
        htmlConfig = inputConfig.html;

    return {
        test: new RegExp(`\\.(${htmlConfig.ext.join("|")})$`, "i"),
        use: [loaders.artTemplateLoader, loaders.stringReplaceLoader]
    };
}

/**
 * style handler
 * @param  {Object} loaders [description]
 * @param  {Object} config  [description]
 * @return {Array}         [description]
 */
function styleHandler(config, loaders) {
    let
        inputConfig = config.input,
        styleConfig = inputConfig.style;

    return {
        test: new RegExp(`\\.(${styleConfig.ext.join("|")})$`, "i"),
        use: [loaders.styleLoader, loaders.cssLoader, loaders.lessLoader]
    };
}

/**
 * image handler
 * @param  {Object} loaders [description]
 * @param  {Object} config  [description]
 * @return {Array}         [description]
 */
function imageHandler(config, loaders) {
    let
        inputConfig = config.input,
        imageConfig = inputConfig.image;

    return {
        test: new RegExp(`\\.(${imageConfig.ext.join("|")})$`, "i"),
        use: [loaders.fileLoader]
    };
}

/**
 * file handler
 * @param  {Object} loaders [description]
 * @param  {Object} config  [description]
 * @return {Array}         [description]
 */
function fileHandler(config, loaders) {
    let
        inputConfig = config.input,
        fileConfig = inputConfig.file;

    return {
        test: new RegExp(`\\.(${fileConfig.ext.join("|")})$`, "i"),
        use: [loaders.fileLoader]
    };
}

function vueHandler(config, loaders) {
    return {
        test: /\.vue$/,
        use: [loaders.vueLoader]
    };
}

module.exports = (config, loaders) => {
    let
        jsRule = jsHandler(config, loaders),
        htmlRule = htmlHandler(config, loaders),
        styleRule = styleHandler(config, loaders),
        imageRule = imageHandler(config, loaders),
        fileRule = fileHandler(config, loaders),
        vueRule = vueHandler(config, loaders);

    return {
        rules: {
            js: jsRule,
            html: htmlRule,
            style: styleRule,
            image: imageRule,
            file: fileRule,
            vue: vueRule
        },
        loaders: loaders
    };
};