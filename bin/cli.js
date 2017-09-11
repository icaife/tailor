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
        dev: "dev.env.json",
        test: "test.env.json",
        prod: "prod.env.json"
    },
    configDir = Path.resolve(process.cwd(), "config/env"),
    argv = Yargs
    .usage("Usage: $0 <command> [options]")
    .default("e", envs.dev) //default development
    .default("c", "")
    .default("f")
    .alias("t", "test")
    .alias("h", "help")
    .alias("f", "file")
    .alias("e", "env")
    .alias("c", "config")
    .epilog("Leon.Cai copyright 2017 ")
    .argv;

let
    config = {};

try {
    config = _.merge(require(Path.join(configDir, ENV_FILES.base)), argv.f ? require(Path.join(configDir, argv.f)) : require(Path.join(configDir, ENV_FILES[argv.e])), fixJson(argv.c));
} catch (e) {
    Log.error(e.message);
}

tailor({
    ctx: Path.resolve(process.cwd()), //project root
    config: config
});

function fixJson(str) {
    if (typeof str !== "string" || !str) {
        return {};
    }

    return eval("(" + str + ")");
}