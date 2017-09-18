/**
 * @description config index
 * @author Leon.Cai
 */
"use strict";
const
    tryRequire = require("try-require");

module.exports = (config) => {
    let env = config.env,
        generateConfig = require(`./${env}.js`);

    return generateConfig && generateConfig(config);
};

// const
//     _ = require("lodash"),
//     Yargs = require("yargs"),
//     Log = require("../lib/util/log"),
//     Util = require("../lib/util/util"),
//     Path = require("path"),
//     Entry = require("./mod/entry"),
//     Module = require("./mod/module"),
//     Output = require("./mod/output"),
//     Plugin = require("./mod/plugin"),
//     Resolve = require("./mod/resolve"),
//     Constant = require("../constant"),
//     ResolveLoader = require("./mod/resolve-loader"),
//     args = parse(Yargs.argv._);

// function parse(args) {
//     args = args || [];
//     let obj = {},
//         spliter = "=";

//     args.forEach((el) => {
//         let arr = el.split(spliter),
//             key = arr[0],
//             value = arr[1] || true;
//         obj[key] = value;
//     });

//     return obj;
// }

// function init(args) {
//     let
//         commonConfig = require("./common"),
//         projRoot = args.ctx,
//         projConfig = args.config;

//     if (!projConfig) {
//         Log.error(`not found project which contains the tailor config file,plz check it.`);
//         process.exit(-1); //error ,exit 1
//     }

//     //found project root
//     projConfig.basic.root = projRoot.replace(/[\\]/g, "/");

//     let
//         config = _.merge(commonConfig, projConfig),
//         basic = config.basic;

//     config.constant = Constant;

//     let
//         entry = Entry(config),
//         params = _.merge({
//             entry: entry
//         }, config);

//     let
//         context = Path.resolve(basic.root, basic.src),
//         output = Output(params),
//         mod = Module(params),
//         resolve = Resolve(params),
//         resolveLoader = ResolveLoader(params),
//         plugins = Plugin(params);

//     return _.merge(config, {
//         webpack: {
//             context: context,
//             entry: entry,
//             module: mod,
//             output: output,
//             resolve: resolve,
//             resolveLoader: resolveLoader,
//             plugins: plugins,
//             profile: true,
//             externals: basic.globalVars,
//             watch: config.env === Constant.env.dev, //middleware default true
//             devtool: ({
//                 "dev": "cheap-module-eval-source-map",
//                 "prod": "cheap-module-source-map",
//             })[config.env === Constant.env.dev ? "dev" : "prod"]
//         }
//     });
// }

// module.exports = init;