/**
 * @description config index
 * @author Leon.Cai
 */
"use strict";

const
    _ = require("lodash"),
    Path = require("path"),
    Entry = require("./mod/entry"),
    Module = require("./mod/module"),
    Output = require("./mod/output"),
    Plugin = require("./mod/plugin"),
    Resolve = require("./mod/resolve"),
    ResolveLoader = require("./mod/resolve-loader");

let
    CommonConfig = require("./common"),
    DevelopmentConfig = require("./development"),
    TestConfig = require("./test"),
    ProductionConfig = require("./production");

let
    mergedConfig = _.merge({}, _.clone(CommonConfig), ProductionConfig);

let
    basic = mergedConfig.basic,
    env = mergedConfig.env,
    context = Path.resolve(basic.root, basic.src),
    entry = Entry({
        basic: basic
    }),
    output = Output({
        basic: basic,
        env: env,
        entry: entry
    }),
    mod = Module({
        basic: basic,
        env: env,
        entry: entry
    }),
    resolve = Resolve({
        basic: basic,
        env: env,
        entry: entry
    }),
    resolveLoader = ResolveLoader({
        basic: basic,
        entry: entry
    }),
    plugins = Plugin({
        basic: basic,
        env: env,
        entry: entry
    });

module.exports = {
    webpack: {
        context: context,
        entry: entry,
        module: mod,
        output: output,
        resolve: resolve,
        resolveLoader: resolveLoader,
        plugins: plugins,
        profile: true,
        watch: true,
    }
};