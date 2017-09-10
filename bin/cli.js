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
    _ = require("lodash"),
    pkg = require("../package.json"),
    tailor = require("../index.js"),
    envs = Constant.env,
    OPTIONS = {
        e: "envioronment",
        h: "help",
        f: "file"
    },
    configDir = Path.resolve(process.cwd(), "config/env"),
    argv = Yargs
    .usage("Usage: $0 <command> [options]")
    .default("e", envs.development) //default development
    .default("f", "dev.env.json")
    .alias("t", "test")
    .alias("h", "help")
    .epilog("Leon.Cai copyright 2017 ")
    .argv;

let
    config = _.merge(require(Path.join(configDir, "base.env.json")), require(Path.join(configDir, argv.f)));

tailor({
    env: argv.e, //environment
    ctx: Path.resolve(process.cwd()), //project root
    config: config
});