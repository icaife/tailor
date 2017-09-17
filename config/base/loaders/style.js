/**
 * @description module for style
 * @author Leon.Cai
 */
const
    postcssPlugins = require("./postcss-plugins.js"),
    ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = (config) => {
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
                // sourceMap: true
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
                sourceMap: true
            }
        },
        extractTextLoader = ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: [cssLoader, postcssLoader, lessLoader]
        });

    return {
        styleLoader,
        cssLoader,
        postcssLoader,
        lessLoader,
        extractTextLoader
    };
};