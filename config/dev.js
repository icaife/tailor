/**
 * @description dev config
 * @author Leon.Cai
 */

const
    Path = require("path"),
    Base = require("./base"),
    Webpack = require("webpack"),
    WebpackDashboardPlugin = require("webpack-dashboard/plugin");

/**
 * generage webpack config
 * @return {[type]} [description]
 */
function generateConfig(config) {
    let
        base = Base(config),
        inputConfig = config.input,
        context = Path.resolve(config.root, inputConfig.path),
        entry = generateEntry(config, base.entry),
        module = generateModule(config, base.module),
        plugins = generatePlugins(config, base.plugins);

    return {
        context: context,
        entry: entry,
        module: module,
        output: base.output,
        resolve: base.resolve,
        resolveLoader: base.resolveLoader,
        plugins: plugins,
        profile: true,
        externals: config.global, //TODO
        watch: config.watch, //middleware default true
        devtool: config.devtool ? "cheap-module-eval-source-map" : false
    };
}

/**
 * generage entry
 * @return {Object}
 */
function generateEntry(config, entry) {
    let
        tailorConfig = config.tailor,
        outputConfig = config.output,
        hotClient = Path.resolve(`${tailorConfig.path}/lib/helper/hot-client.js`),
        hotClientQuery = `?path=${outputConfig.publicPath}/__webpack_hmr&reload=true`;

    Object
        .keys(entry)
        .forEach((page) => {
            let chunks = entry[page] || [];

            chunks.push(hotClient + hotClientQuery);
        });

    return entry;
}

/**
 * generage module config
 * @param  {Object} config [description]
 * @param  {Object} module [description]
 * @return {Object}        [description]
 */
function generateModule(config, module) {
    let
        rules = module.rules,
        loaders = module.loaders,
        htmlRule = rules.html,
        jsRule = rules.js,
        styleRule = rules.style,
        imageRule = rules.image,
        fileRule = rules.file,
        vueRule = rules.vue,
        htmlLoader = rules.html,
        jsLoader = loaders.js,
        styleLoader = loaders.style,
        imageLoader = loaders.image,
        fileLoader = loaders.file,
        roitjsLoader = loaders.roitjs,
        vueLoader = loaders.vue;

    styleRule.use.push(
        styleLoader.lessLoader
    );

    return {
        rules: [
            htmlRule,
            jsRule,
            styleRule,
            imageRule,
            fileRule,
            vueRule
        ],
        noParse: [/node_modules|vendor/]
    };
}

/**
 * generate plugins
 * @return {Array} [description]
 */
function generatePlugins(config, plugins) {
    let
        commonPlugin = plugins.common,
        htmlPlugin = plugins.html,
        result = [...commonPlugin,
            ...htmlPlugin,
            new Webpack.optimize.OccurrenceOrderPlugin(),
            new Webpack.HotModuleReplacementPlugin(),
            new Webpack.NoEmitOnErrorsPlugin()
        ];

    if (Path.sep === "/") { //webpack dashboard not support windows
        let dashboard = new WebpackDashboard();
        result.push(new WebpackDashboardPlugin(dashboard.setData));
    }

    return result;
}

module.exports = generateConfig;