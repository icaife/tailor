/**
 * @description module config
 * @author Leon.Cai
 */
"use strict";
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = (config) => {
    let basic = config.basic;

    return {
        rules: [{
            test: /\.(html|\.blade.php)$/,
            use: "html"
        }, {
            test: /\.(css|less)$/,
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: [{
                    loader: "css-loader",
                    options: {
                        importLoaders: 1
                    }
                }, {
                    loader: "postcss-loader",
                    options: {
                        plugins: (loader) => [
                            require("autoprefixer")({
                                browsers: ["Chrome >= 35", "FireFox >= 40", "ie > 8", "Android >= 4", "Safari >= 5.1", "iOS >= 7"],
                                remove: true
                            }),
                            // require("postcss-cssnext")(),
                            require("cssnano")({

                            })
                        ]
                    }
                }, {
                    loader: "less-loader",
                    options: {}
                }]
            })
        }, {
            test: /\.(png|jpg|gif|bmp)/ig,
            use: [
                /*{
                                loader: "file-loader",
                                options: {
                                    name: `${basic.assets}/[path][name].[hash:6].[ext]`
                                }
                            }, */
                {
                    loader: "url-loader",
                    options: {
                        name: `${basic.assets}/[path][name].[hash:6].[ext]`,
                        limit: 10
                    }
                }
            ]
        }]
    }
}