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

Log.info(`\nwork info:\n\tpath:${Log.chalk.blue(Path.join(Config.basic.root))}\n\tenv:${Log.chalk.blue(Config.basic.env)}`);
let destPath = Path.join(Config.basic.root, Config.basic.dest);

//clean dest path if exists
FSE.existsSync(destPath) && (Shell.rm("-rf", destPath), Log.info("clean " + Log.chalk.blue(destPath) + " done"));

//init
Log.info("Enjoy yourself! :)");

init();

function init() {
	let isDev = Config.basic.env === Constant.env.development;

	PreCommit(Config); //init pre commit

	if (isDev) { // if development,run webpack server
		Serve.run();
	} else { //run webpack
		let exitCode = Shell.exec("webpack --config webpack.config.js --colors --hide-modules --bail").code; //--progress --bail
		process.exit(exitCode);
	}
}