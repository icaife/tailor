/**
 * @tailor start
 * @author Leon.Cai
 */
"use strict";

const
    FSE = require("fs-extra"),
    Path = require("path"),
    Shell = require("shelljs"),
    Log = require("./lib/util/log"),
    PreCommit = require("./lib/hook/pre-commit"),
    Webpack = require("webpack"),
    Constant = require("./constant"),
    Config = require("./config"),
    Serve = require("./server");

function init(args) {
    let config = Config(args);

    Log.info(`
		work info:
			path:${Log.chalk.blue(Path.join(config.basic.root))}
			env:${Log.chalk.blue(config.basic.env)}
	`);

    let destPath = Path.join(config.basic.root, config.basic.dest);

    //clean dest path if exists
    FSE.existsSync(destPath) && (Shell.rm("-rf", destPath), Log.info("clean " + Log.chalk.blue(destPath) + " done"));

    //init
    Log.info("Enjoy yourself! :)");

    let isDev = config.basic.env === Constant.env.development,
        compiler = null;

    PreCommit(config); //init pre commit

    if (isDev) { // if development,run webpack server
        Serve(config);
    } else { //run webpack
        // let exitCode = Shell.exec("webpack --config webpack.config.js --colors --hide-modules").code; //--progress --bail
        // process.exit(exitCode);
        compiler = Webpack(config.webpack);
        compiler.run(compilerCallback);
    }

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

        // let options = config.webpack;

        // if (!options.watch || err) {
        //     // Do not keep cache anymore
        //     compiler.purgeInputFileSystem();
        // }
        // if (err) {
        //     lastHash = null;
        //     console.error(err.stack || err);
        //     if (err.details) console.error(err.details);
        //     process.exit(1); // eslint-disable-line
        // }
        // if (outputOptions.json) {
        //     process.stdout.write(JSON.stringify(stats.toJson(outputOptions), null, 2) + "\n");
        // } else if (stats.hash !== lastHash) {
        //     lastHash = stats.hash;
        //     var statsString = stats.toString(outputOptions);
        //     if (statsString)
        //         process.stdout.write(statsString + "\n");
        // }
        // if (!options.watch && stats.hasErrors()) {
        //     process.exitCode = 2;
        // }
    }
}



module.exports = init;