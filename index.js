/**
 * @tailor start
 * @author Leon.Cai
 */
"use strict";

const
    Path = require("path"),
    Shell = require("shelljs"),
    Log = require("./lib/util/log"),
    Webpack = require("webpack"),
    Constant = require("./constant"),
    Config = require("./config"),
    Serve = require("./server");

Log.info(`\nwork info:\n\tpath:${Log.chalk.blue(Path.join(Config.basic.root))}\n\tenv:${Log.chalk.blue(Config.basic.env)}`);
let destPath = Path.join(Config.basic.root, Config.basic.dest);
Shell.rm("-rf", destPath)
Log.info("\nclean " + Log.chalk.blue(destPath) + " done");

console.log(Shell.exec("git grep -n -P module.exports")[0]);

if (Config.basic.env === Constant.env.development) {
    Serve.run();
} else {
    Shell.exec("webpack --colors --config webpack.config.js");
}