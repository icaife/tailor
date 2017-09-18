/**
 * @description plugins
 * @author Leon.Cai
 */

const
    Webpack = require("webpack"),
    Path = require("path"),
    Shell = require("shelljs"),
    Log = require("../../lib/util/log"),
    HtmlWebpackPlugin = require("html-webpack-plugin"),
    // HtmlWebpackReplaceUrlPlugin = require("html-webpack-replaceurl-plugin"),
    StringReplaceWebpackPlugin = require("string-replace-webpack-plugin"),
    ManifestPlugin = require("webpack-manifest-plugin"),
    CopyWebpackPlugin = require('copy-webpack-plugin'),
    ExtractTextPlugin = require("extract-text-webpack-plugin"),
    StyleExtHtmlWebpackPlugin = require("style-ext-html-webpack-plugin"),
    WriteFileWebpackPlugin = require("write-file-webpack-plugin"),
    FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin"),
    WebpackDashboard = require("webpack-dashboard"),
    WebpackDashboardPlugin = require("webpack-dashboard/plugin"),
    BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin,
    StyleLintPlugin = require("stylelint-webpack-plugin"),
    UglifyJsPlugin = Webpack.optimize.UglifyJsPlugin,
    ModuleConcatenationPlugin = Webpack.optimize.ModuleConcatenationPlugin,
    CommonsChunkPlugin = Webpack.optimize.CommonsChunkPlugin,
    HashedModuleIdsPlugin = Webpack.HashedModuleIdsPlugin,
    SourceMapDevToolPlugin = Webpack.SourceMapDevToolPlugin,
    DefinePlugin = Webpack.DefinePlugin;

/**
 * plugins for html
 * @param  {Object} config [description]
 * @param  {Object} entry  [description]
 * @return {Array}        [description]
 */
function htmlPlugin(config, entry) {
    let
        plugins = [],
        inputConfig = config.input,
        outputConfig = config.output,
        htmlInputConfig = inputConfig.html,
        htmlOutputConfig = outputConfig.html;

    Object
        .keys(entry)
        .forEach((page) => {
            let
                pageItem = entry[page],
                options = {
                    filename: `${htmlOutputConfig.path}/${page}.${htmlOutputConfig.ext}`,
                    chunks: [page], //TODO:add common js
                    template: `${page}.${htmlInputConfig.ext[0]}`,
                    inject: !false, //TODO: auto inject
                    minify: {}
                };

            plugins.push(new HtmlWebpackPlugin(options));
        });

    return plugins;
}

/**
 * plugins for common
 * @param  {Object} config [description]
 * @return {Object}        [description]
 */
function commonPlugin(config, entry) {
    let plugins = [],
        inputConfig = config.input,
        outputConfig = config.output,
        jsConfig = outputConfig.js,
        fileConfig = outputConfig.file;

    plugins.push(
        new HashedModuleIdsPlugin(),
        new StringReplaceWebpackPlugin(),
        new CopyWebpackPlugin([{
            context: Path.join(config.root, inputConfig.path),
            from: {
                glob: "**/vendor/**/*.*",
                dot: true
            },
            to: Path.join(config.root, outputConfig.path, jsConfig.path)
        }]),
        new DefinePlugin(config.vars || {}),
        // new ManifestPlugin({
        //     fileName: `${fileConfig.path}/manifest.json`,
        //     publicPath: `${outputConfig.publicPath}`
        // }),
        // new CommonsChunkPlugin({
        //     names: [...Object.keys(entry)],
        //     chunks: [],
        //     minChunks: 4,
        //     filename: `${jsConfig.path}/[name]` + (outputConfig.useHash ? `.[chunkhash:${outputConfig.hashLen}]` : "") + `.js`,
        // }),
        // {
        //     /**
        //      * @description errors print
        //      * @see https://doc.webpack-china.org/api/plugins/compiler/#-
        //      * @see tttps://webpack.github.io/docs/plugins.html#the-compiler-instance
        //      */
        //     apply: function(compiler) {
        //         compiler.plugin("done", function(stats, type, msg) {
        //             if (stats.hasErrors()) { //有错误,退出 exit -1
        //                 let errors = stats.compilation.errors || [],
        //                     msg = errors.join("\n");
        //                 Log.error(`some errors occurred:\n${msg}\n`);
        //                 process.exit(1);
        //             }
        //         });
        //     }
        // }
    );

    return plugins;
}

module.exports = (config, entry) => {
    return {
        common: commonPlugin(config, entry),
        html: htmlPlugin(config, entry)
    };
};