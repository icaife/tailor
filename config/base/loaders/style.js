/**
 * @description module for style
 * @author Leon.Cai
 */
const
    PostcssPlugins = require("./postcss-plugins.js");

module.exports = (config) => {
    let postcssPlugins = PostcssPlugins(config);

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
                // sourceMap: true
            }
        };

    return {
        styleLoader,
        cssLoader,
        postcssLoader,
        lessLoader,
    };
};