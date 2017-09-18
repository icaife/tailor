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
    Config = require("./config");


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
    path: ${Log.chalk.blue(Path.join(config.root))}
    env: ${Log.chalk.blue(config.env)}
`);

    Log.info("Enjoy yourself! :)");

    if (outputConfig.clean) {
        let outputPath = Path.join(outputConfig.root, outputConfig.path);

        FSE.existsSync(destPath) && (Shell.rm("-rf", destPath), Log.info("clean " + Log.chalk.blue(destPath) + " done"));
    }

    compiler = Webpack(webpackConfig);
    compiler.run(compilerCallback);

    return compiler;
}

module.exports = run;

// const
//     FSE = require("fs-extra"),
//     Path = require("path"),
//     Shell = require("shelljs"),
//     Log = require("./lib/util/log"),
//     PreCommit = require("./lib/hook/pre-commit"),
//     Webpack = require("webpack"),
//     Constant = require("./constant"),
//     Config = require("./config"),
//     Serve = require("./server");

// function init(args) {
//     let config = Config(args);

//     Log.info(`
// work info:
//     path:${Log.chalk.blue(Path.join(config.basic.root))}
//     env:${Log.chalk.blue(config.env)}
//     `);

//     let destPath = Path.join(config.basic.root, config.basic.dest);

//     //clean dest path if exists
//     FSE.existsSync(destPath) && (Shell.rm("-rf", destPath), Log.info("clean " + Log.chalk.blue(destPath) + " done"));

//     //init
//     Log.info("Enjoy yourself! :)");

//     let isDev = config.env === Constant.env.dev,
//         compiler = null;

//     PreCommit(config); //init pre commit

//     if (isDev) { // if development,run webpack server
//         Serve(config);
//     } else { //run webpack
//         // let exitCode = Shell.exec("webpack --config webpack.config.js --colors --hide-modules").code; //--progress --bail
//         // process.exit(exitCode);
//         compiler = Webpack(config.webpack);
//         compiler.run(compilerCallback);
//     }


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

// module.exports = init;