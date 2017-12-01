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
                pagePath = htmlOutputConfig.path,
                pageName = page,
                pageInputExt = htmlInputConfig.ext[0],
                pageOutputExt = htmlOutputConfig.ext,
                options = {
                    filename: `${pagePath}/${pageName}.${pageOutputExt}`,
                    chunks: [pageName], //TODO:add common js
                    template: `${pageName}.${pageInputExt}`,
                    inject: !false, //TODO: auto inject
                    minify: outputConfig.html.optm ? {
                        html5: true,
                        collapseWhitespace: true,
                        collapseBooleanAttributes: true,
                        collapseWhitespace: true,
                        // minifyCSS: true,
                        // minifyJS: true,
                    } : false
                };

            plugins.push(new HtmlWebpackPlugin(options));
        });

    return plugins;
}

/**
 * plugins for style
 * @param  {Object} config [description]
 * @param  {Object} entry  [description]
 * @return {Array}        [description]
 */
function stylePlugin(config, entry) {
    let
        plugins = [],
        outputConfig = config.output,
        styleConfig = outputConfig.style;

    plugins.push(new ExtractTextPlugin({ //extract css
        filename: `${styleConfig.path}/[name]` + (outputConfig.useHash ? `.[contenthash:${outputConfig.hashLen}]` : "") + `.css`,
        allChunks: !true,
        disable: !styleConfig.extract
    }));

    return plugins;
}

/**
 * plugins for lint
 * @param  {[type]} config [description]
 * @param  {[type]} entry  [description]
 * @return {[type]}        [description]
 */
function lintPlugin(config, entry) {
    let
        plugins = [],
        inputConfig = config.input,
        outputConfig = config.output;

    plugins.push(
        new StyleLintPlugin({
            configFile: Path.join(config.root, ".stylelintrc"),
            failOnWarning: false, // warning occured then stop
            failOnError: false, // error occured then stop
            emitError: true,
            emitOnWarning: false,
            files: ["**/*.css", "**/*.less"], //TODO
            quiet: false,
        })
    );

    return plugins;
}

/**
 * plugins for dev
 * @param  {Object} config [description]
 * @param  {Object} entry  [description]
 * @return {Array}        [description]
 */
function devPlugin(config, entry) {
    let plugins = [],
        outputConfig = config.output,
        inputConfig = config.input,
        htmlOutputConfig = outputConfig.html,
        // imageInputConfig = inputConfig.image,
        fileInputConfig = inputConfig.file;

    plugins.push( //views write to hard disk
        new WriteFileWebpackPlugin({
            test: new RegExp(`(${[htmlOutputConfig.ext].join("|")})$`, "i")
        }),
        new Webpack.optimize.OccurrenceOrderPlugin(),
        new Webpack.HotModuleReplacementPlugin(),
        new Webpack.NoEmitOnErrorsPlugin(),
        // new HardSourceWebpackPlugin()
    );

    return plugins;
}

/**
 * plugins for optm
 * @param  {Object} config [description]
 * @param  {Object} entry  [description]
 * @return {Array}        [description]
 */
function optmPlugin(config, entry) {
    let
        plugins = [],
        outputConfig = config.output,
        fileConfig = outputConfig.file;

    plugins.push(
        new UglifyJsPlugin({ //this will be very slow
            drop_debugger: true,
            dead_code: true,
            join_vars: true,
            reduce_vars: true,
            drop_console: true,
            comments: /[^\s\S]/g,
            sourceMap: true
        }),
        new ModuleConcatenationPlugin(),
        new ManifestPlugin({
            fileName: `${fileConfig.path}/manifest.json`,
            publicPath: `${outputConfig.publicPath}`
        })
    );

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

    /**
     * TODO:
     *     SourceMapDevToolPlugin
     *     BundleAnalyzerPlugin
     */
    plugins.push(
        // new HashedModuleIdsPlugin(),
        new StringReplaceWebpackPlugin(),
        new FriendlyErrorsWebpackPlugin(),
        // new ProgressBarWebpackPlugin({
        //     format: "tailor build [:bar] " + ":percent" + " (:elapsed seconds)",
        //     clear: !false,
        //     complete: "▊",
        //     incomplete: "░",
        //     renderThrottle: 1
        // }),
        new CopyWebpackPlugin([{
            context: Path.join(config.root, inputConfig.path),
            from: {
                glob: "**/vendor/**/*.*",
                dot: true
            },
            to: Path.join(config.root, outputConfig.path, jsConfig.path)
        }]),
        new DefinePlugin(varsHandler(config.vars)),
        new CommonsChunkPlugin({
            /**
             * @see https://doc.webpack-china.org/plugins/commons-chunk-plugin
             * @type {Array}
             */
            names: [...Object.keys(entry)], //TODO
            chunks: [],
            minChunks: 4,
            filename: `${jsConfig.path}/[name]` + (outputConfig.useHash ? `.[chunkhash]` : "") + `.js`,
        })
    );

    // plugins.push({
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
    // });

    return plugins;
}

//TODO;
function dllPlugin(config, entry) {
    let plugins = [];

    return plugins;
}


/**
 * vars handler
 * @param  {Object} json [description]
 * @return {Object}      [description]
 */
function varsHandler(json) {
    json = json || {};

    let result = {};

    for (let key in json) {
        let val = json[key];

        if (typeof val === "string") {
            result[key] = JSON.stringify(val);
        } else if (Object.prototype.toString.call(val) === "[object Object]") {
            varsHandler(val);
        } else {
            result[key] = val;
        }
    }

    return result;
}

module.exports = (config, entry) => {
    return {
        common: commonPlugin(config, entry),
        html: htmlPlugin(config, entry),
        style: stylePlugin(config, entry),
        dev: devPlugin(config, entry),
        optm: optmPlugin(config, entry),
        lint: lintPlugin(config, entry)
    };
};