/**
 * @description module for style
 * @author Leon.Cai
 */
const
    PostcssPlugins = require("./postcss-plugins.js");

module.exports = (config) => {
    let postcssPlugins = PostcssPlugins(config),
        sourceMap = !!config.devtool;

    let
        styleLoader = {
            loader: "style-loader",
            options: {
                // sourceMap: true
            }
        },
        cssLoader = {
            loader: "css-loader",
            options: {
                importLoaders: 1,
                sourceMap: sourceMap
            }
        },
        postcssLoader = {
            loader: "postcss-loader",
            options: {
                plugins: postcssPlugins
            }
        },
        lessLoader = {
            loader: "less-loader",
            options: {
                sourceMap: sourceMap
            }
        };

    return {
        styleLoader,
        cssLoader,
        postcssLoader,
        lessLoader,
    };
};