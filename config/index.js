/**
 * @description config index
 * @author Leon.Cai
 */
"use strict";

const
    _ = require("lodash"),
    Yargs = require("yargs"),
    Log = require("../lib/util/log"),
    Util = require("../lib/util/util"),
    Path = require("path"),
    Entry = require("./mod/entry"),
    Module = require("./mod/module"),
    Output = require("./mod/output"),
    Plugin = require("./mod/plugin"),
    Resolve = require("./mod/resolve"),
    Constant = require("../constant"),
    ResolveLoader = require("./mod/resolve-loader"),
    args = parse(Yargs.argv._);

function parse(args) {
    args = args || [];
    let obj = {},
        spliter = "=";

    args.forEach((el) => {
        let arr = el.split(spliter),
            key = arr[0],
            value = arr[1] || true;
        obj[key] = value;
    });

    return obj;
}

function init(args) {
    let
        env = Constant.env[args.env] ? Constant.env[args.env] : Constant.env.development, //default development
        commonConfig = require("./common"),
        envConfig = require(`./${env}`),
        projRoot = args.ctx,
        projConfig = args.config;

    if (!projConfig) {
        Log.error(`not found project which contains the tailor config file,plz check it.`);
        process.exit(-1); //error ,exit 1
    }

    //found project root
    projConfig.basic.root = projRoot.replace(/[\\]/g, "/");

    let
        mergedConfig = _.merge({
            constant: Constant
        }, commonConfig, envConfig, projConfig),
        basic = mergedConfig.basic,
        server = mergedConfig.server;

    let
        entry = Entry(mergedConfig),
        params = _.merge({
            entry: entry
        }, mergedConfig);

    let
        context = Path.resolve(basic.root, basic.src),
        output = Output(params),
        mod = Module(params),
        resolve = Resolve(params),
        resolveLoader = ResolveLoader(params),
        plugins = Plugin(params);

    return {
        basic: basic,
        server: server,
        webpack: {
            context: context,
            entry: entry,
            module: mod,
            output: output,
            resolve: resolve,
            resolveLoader: resolveLoader,
            plugins: plugins,
            profile: true,
            externals: basic.globalVars,
            watch: basic.env === Constant.env.development, //middleware default true
            devtool: ({
                // "development": "cheap-module-eval-source-map",
                // "production": "eval-source-map",
                "development": "cheap-module-eval-source-map",
                "production": "cheap-module-source-map",
            })[basic.env === Constant.env.development ? "development" : "production"]
        }
    }

}

module.exports = init;