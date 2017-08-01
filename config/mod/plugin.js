/**
 * @description plugins for webpack config
 * @author Leon.Cai
 */

"use strict";

const
    Webpack = require("webpack"),
    Path = require("path"),
    HtmlWebpackPlugin = require("html-webpack-plugin"),
    HtmlWebpackReplaceUrlPlugin = require("html-webpack-replaceurl-plugin"),
    StringReplaceWebpackPlugin = require("string-replace-webpack-plugin"),
    CleanWebpackPlguin = require("clean-webpack-plugin"),
    ManifestPlugin = require("webpack-manifest-plugin"),
    ExtractTextPlugin = require("extract-text-webpack-plugin"),
    StyleExtHtmlWebpackPlugin = require("style-ext-html-webpack-plugin"),
    CopyWebpackPlugin = require("copy-webpack-plugin"),
    HtmlWebpackHarddiskPlugin = require("html-webpack-harddisk-plugin"),
    WriteFileWebpackPlugin = require("write-file-webpack-plugin"),
    UglifyJsPlugin = Webpack.optimize.UglifyJsPlugin,
    ModuleConcatenationPlugin = Webpack.optimize.ModuleConcatenationPlugin,
    CommonsChunkPlugin = Webpack.optimize.CommonsChunkPlugin;

module.exports = (config) => {
    let plugin = [],
        entry = config.entry,
        basic = config.basic,
        envs = config.constant.env,
        htmlConfig = basic.html,
        htmlExt = htmlConfig.ext,
        assetsPath = Path.join(basic.root, basic.dest, basic.assets);

    plugin.push(
        new ModuleConcatenationPlugin(),
        new StringReplaceWebpackPlugin(),
        // new HtmlWebpackPluginReplace({ //add js and css to file end
        //     replace: (html, obj) => {
        //         //todo
        //         html = html.replace(/$/, addCss(obj.css) + addJs(obj.js));
        //         return html;
        //     },
        //     config: config
        // }),
        new ManifestPlugin({
            fileName: `${basic.assets}/manifest.json`,
            publicPath: `${basic.cdn}`
        }), /*new StyleExtHtmlWebpackPlugin()*/
        // new CopyWebpackPlugin([{
        //     context: Path.join(basic.root, basic.src),
        //     from: {
        //         glob: "**/*.{blade.php,html}",
        //         dot: true
        //     },
        //     to: Path.join(basic.root, basic.dest, basic.views)
        // }]),
        new Webpack.ProvidePlugin(basic.globalVars),
        new CleanWebpackPlguin([basic.dest], { //clean dirs
            root: basic.root,
            verbose: !true
        }),
        /**
         * @see https://doc.webpack-china.org/guides/author-libraries/#-library
         * @see https://github.com/webpack/webpack/tree/master/examples/multiple-commons-chunks
         * @see https://github.com/boijs/boi-kernel/blob/ed1c95266cd17853c0e7b02678800000a7cdb052/lib/config/generateConfig/_entry.js
         */
    );

    if (basic.env === envs.development) {
        plugin.push( //for webpack hot middleware
            new Webpack.optimize.OccurrenceOrderPlugin(),
            new Webpack.HotModuleReplacementPlugin(),
            new Webpack.NoEmitOnErrorsPlugin()
        );
    }

    if (basic.env === envs.test) {

    }

    if (basic.env == envs.production || basic.env === envs.test) {
        plugin.push(
            new ExtractTextPlugin({ //extract css
                filename: `${basic.assets}/[name]` + (basic.output.useHash ? `.[contenthash:${basic.output.hashLen}]` : "") + `.css`,
                allChunks: true
            }),
            /**
             * @see  https://github.com/mishoo/UglifyJS2
             */
            new UglifyJsPlugin({
                drop_debugger: true,
                dead_code: true,
                join_vars: true,
                reduce_vars: true,
                drop_console: true,
                comments: /[^\s\S]/g
            }));
    }

    if (basic.env === envs.dll) {

    }

    if (basic.env !== envs.dll) { //not dll env
        Object.keys(entry).forEach((page) => {
            let item = entry[page],
                obj = Path.parse(page),
                fileName = `${page}`, //TODO
                opts = {
                    filename: `${basic.views}/${fileName}.${basic.output.html.ext}`,
                    template: `${fileName}.${basic.html.ext[0]}`,
                    inject: !false,
                    alwaysWriteToDisk: true,
                };

            plugin.push(new HtmlWebpackPlugin(opts));
        });

        // plugin.push(new HtmlWebpackHarddiskPlugin({
        //     alwaysWriteToDisk: true
        // }));
        plugin.push(new WriteFileWebpackPlugin({
            test: /(assets|views)/
        }));

        plugin.push(new CommonsChunkPlugin({
            names: [...Object.keys(entry)],
            // name: "vendor",
            // chunks: [...Object.keys(entry)],
            chunks: [],
            minChunks: 4,
            // minChunks: module => {
            //     let context = module.context;

            //     return /[\\\/]common[\\\/]/.test(context);
            // },
            // children: true,
            filename: `${basic.assets}/[name].common` + (basic.output.useHash ? `.[chunkhash:${basic.output.hashLen}]` : "") + `.js`,
        }));

        // Object.keys(basic.vendor).forEach((item) => {
        //     plugin.push(new Webpack.DllReferencePlugin({
        //         manifest: require(Path.join(assetsPath, `dll/${item}-dll-manifest.json`)),
        //         context: Path.join(assetsPath),
        //         name: item
        //     }));
        // });
    } else { //build dll env
        plugin.push(new Webpack.DllPlugin({
            context: Path.join(assetsPath),
            path: Path.join(assetsPath, "dll/[name]-dll-manifest.json"),
            name: "[name]" + (basic.output.useHash ? `.[chunkhash:${basic.output.hashLen}]` : "")
        }));
    }

    //todo:
    //  ProvidePlugin
    //  DefinePlugin
    //  EnvironmentPlugin process.env
    //  stats-webpack-plugin
    //  AggressiveMergingPlugin
    //  MinChunkSizePlugin
    //  LimitChunkCountPlugin
    return plugin;
}