#!/usr/bin/env node

/**
 * @description tf-tailor cli
 */

/**
 * @example
 *     tailor -e dev
 */

const
    Yargs = require("yargs"),
    Path = require("path"),
    FSE = require("fs-extra"),
    Log = require("../lib/util/log"),
    _ = require("lodash"),
    tryRequire = require("try-require"),
    pkg = require("../package.json"),
    tailor = require("../index.js"),
    preCommit = require("../lib/hook/pre-commit.js"),
    ENV = require("../constant/env.js"),
    OPTIONS = {
        e: "env",
        h: "help",
        f: "file",
        r: "r",
        c: "config"
    },
    CONFIG_FILE = "tailor.config.json",
    configDir = Path.join(process.cwd(), "config"),
    argv = Yargs
    .usage("Usage: $0 <command> [options]")
    .default("e", ENV.dev) //default development
    .default("c", {})
    .default("f", CONFIG_FILE)
    .default("r", false)
    .alias("h", "help")
    .alias("f", "file")
    .alias("e", "env")
    .alias("c", "config")
    .alias("v", "version")
    .alias("r", "reg")
    .epilog("toursforfun.com copyright 2017 ")
    .argv;


if (argv.version) {
    Log.info(`${pkg.version}`);
    process.exit(0);
}

if (argv.help) {
    Log.info(`please see: https://github.com/icaife/tailor for help.`);
    process.exit(0);
}

if (!tryRequire(Path.join(configDir, argv.file))) {
    Log.error(`not found the ${argv.file} in ${configDir},please check.`);
    process.exit(1);
}

let
    config = {};

try {
    let projConfig = require(Path.join(configDir, argv.file));

    argv.env = ENV[argv.env] ? ENV[argv.env] : ENV.dev;

    config = _.merge({},
        require("../config/config.json"),
        projConfig.base,
        projConfig[argv.env] || {},
        fixJson(argv.c)
    );

} catch (e) {
    Log.error(e.message);
    process.exit(1);
}

//set env
config.env = ENV[argv.env];
//set project root
config.root = Path.resolve(process.cwd());
//set tailor config
config.tailor = {
    path: Path.resolve(__dirname, "../")
};
//set reg
config.reg = argv.reg ? new RegExp(argv.reg, "img") : /./;

let cmd = (argv._ || [])[0];

if (cmd === "hook") {
    preCommit(config); //install hook
    process.exit(0);
}

tailor(config);

function fixJson(str) {
    if (typeof str !== "string" || !str) {
        return {};
    }

    return eval("(" + str + ")");
}