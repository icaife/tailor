/**
 * @description dev config
 * @author Leon.Cai
 */

const
    Path = require("path"),
    Base = require("./base"),
    Webpack = require("webpack"),
    ENV = require("../constant/env.js");

/**
 * handler for webpack config
 * @return {[type]} [description]
 */
function generateConfig(config) {
    let outputConfig = config.output,
        publicPath = /\/$/.test(outputConfig.publicPath) ? outputConfig.publicPath : outputConfig.publicPath + "/";

    outputConfig.publicPath = publicPath;

    let
        base = Base(config),
        inputConfig = config.input,
        context = Path.resolve(config.root, inputConfig.path),
        entry = entryHandler(config, base.entry),
        module = moduleHandler(config, base.module),
        plugins = pluginsHandler(config, base.plugins),
        devtool = config.devtool;

    return {
        target: "web",
        bail: true,
        context: context,
        entry: entry,
        module: module,
        plugins: plugins,
        output: base.output,
        resolve: base.resolve,
        resolveLoader: base.resolveLoader,
        profile: false,
        externals: config.global || {}, //TODO
        watch: config.watch, //middleware default true
        /**
         * @see https://juejin.im/post/58293502a0bb9f005767ba2f
         */
        devtool: devtool
    };
}

/**
 * handler for entry
 * @return {Object}
 */
function entryHandler(config, entry) {
    let
        tailorConfig = config.tailor,
        outputConfig = config.output,
        hotClient = Path.resolve(`${tailorConfig.path}/lib/helper/hot-client.js`),
        hotClientQuery = `?path=${outputConfig.publicPath}__webpack_hmr&reload=true`;

    if (config.env === ENV.dev) { //if dev,add hot client in entry
        Object
            .keys(entry)
            .forEach((page) => {
                let chunks = entry[page] || [];

                chunks.push(hotClient + hotClientQuery);
            });
    }

    return entry;
}

/**
 * handler for module config
 * @param  {Object} config [description]
 * @param  {Object} module [description]
 * @return {Object}        [description]
 */
function moduleHandler(config, module) {
    let
        rules = module.rules,
        loaders = module.loaders,
        htmlRule = rules.html,
        jsRule = rules.js,
        styleRule = rules.style,
        imageRule = rules.image,
        fileRule = rules.file,
        vueRule = rules.vue;

    //js rule
    //TODO

    //style rule
    //TODO

    //image rule
    //TODO

    let result = {
        rules: [
            htmlRule,
            jsRule,
            styleRule,
            imageRule,
            fileRule,
            vueRule
        ],
        noParse: [/vendor/] // why not use node_modules??
    };

    return result;
}

/**
 * generate plugins
 * @return {Array} [description]
 */
function pluginsHandler(config, plugins) {
    let
        commonPlugin = plugins.common,
        htmlPlugin = plugins.html,
        stylePlugin = plugins.style,
        devPlugin = plugins.dev,
        result = [
            ...commonPlugin,
            ...htmlPlugin,
            ...stylePlugin,
            ...plugins.lint //style lint plugin
        ];

    if (config.env === ENV.dev) {
        result.push(...devPlugin);
    } else {
        result.push(...plugins.optm);
    }

    return result;
}

module.exports = generateConfig;