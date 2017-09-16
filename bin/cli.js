#!/usr/bin/env node

/**
 * @description tf-tailor cli
 */

/**
 * @example
 *     tailor -e dev -f qa1
 */
const
    Yargs = require("yargs"),
    Path = require("path"),
    Constant = require("../constant"),
    FSE = require("fs-extra"),
    Log = require("../lib/util/log"),
    _ = require("lodash"),
    pkg = require("../package.json"),
    tailor = require("../index.js"),
    envs = Constant.env,
    OPTIONS = {
        e: "env",
        h: "help",
        f: "file"
    },
    ENV_FILES = {
        base: "base.env.json",
        custom: "custom.env.json",
        env: "env.json"
    },
    configDir = Path.resolve(process.cwd(), "config/env"),
    argv = Yargs
    .usage("Usage: $0 <command> [options]")
    .default("e", envs.dev) //default development
    .default("c", "")
    .default("f")
    .alias("h", "help")
    .alias("f", "file")
    .alias("e", "env")
    .alias("c", "config")
    .epilog("toursforfun.com copyright 2017 ")
    .argv;

let
    config = {};

if (!FSE.existsSync(Path.join(configDir, ENV_FILES.base))) {
    Log.error("not found the base.env.json,please check.");
    process.exit(1);
}

try {
    config = _.merge(
        require(Path.join(configDir, ENV_FILES.base)),
        FSE.existsSync(configDir, ENV_FILES.env) ? require(Path.join(configDir, ENV_FILES.env)) : {},
        argv.f ?
        require(Path.join(configDir, argv.f)) :
        (FSE.existsSync(configDir, ENV_FILES.custom) ? require(Path.join(configDir, ENV_FILES.custom)) : {}),
        fixJson(argv.c)
    );

} catch (e) {
    Log.error(e.message);
    process.exit(1);
}

config.env = argv.e;

// tailor({
//     ctx: Path.resolve(process.cwd()), //project root
//     config: config
// });

function fixJson(str) {
    if (typeof str !== "string" || !str) {
        return {};
    }

    return eval("(" + str + ")");
}