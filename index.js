/**
 * @tailor start
 * @author Leon.Cai
 */
"use strict";
const
    Webpack = require("webpack"),
    Path = require("path"),
    FSE = require("fs-extra"),
    Log = require("./lib/util/log"),
    Shell = require("shelljs"),
    Config = require("./config"),
    Server = require("./server"),
    ENV = require("./constant/env.js");

/**
 * run tailor
 * @param  {[type]} config [description]
 * @return {[type]}        [description]
 */
function run(config) {
    let
        webpackConfig = Config(config),
        outputConfig = config.output,
        compiler = null;

    Log.info(`
work info:
    path: ${Path.join(config.root)}
    env: ${config.env}

env info:
    buildPath: ${outputConfig.path}
    publicPath: ${outputConfig.publicPath}
`);

    Log.info("Enjoy yourself! :)");

    if (outputConfig.clean) {
        let outputPath = Path.join(config.root, outputConfig.path);

        FSE.existsSync(outputPath) && (Shell.rm("-rf", outputPath), Log.info("clean " + Log.chalk.blue(outputPath) + " done"));
    }

    compiler = Webpack(webpackConfig);

    if (config.env === ENV.dev) {
        Server(config, compiler);
    } else {
        compiler.run(compilerCallback);
    }

    return compiler;
}

/**
 * compiler callback
 * @param  {Object} err  [description]
 * @param  {Object} stat [description]
 */
function compilerCallback(err, stat) {
    if (err) {
        Log.error(err.stack);
        process.exit(1);
    }

    const Stats = stat.toJson();

    if (Stats.errors.length !== 0) {
        Log.error(Stats.errors);
        process.exit(1);
    }
    // 输出构建结果
    process.stdout.write(stat.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
    }) + '\n');

    Log.info('Build successfully!');

    process.exit(0);
}

module.exports = run;