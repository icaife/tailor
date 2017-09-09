#!/usr/bin/env node

/**
 * @description tf-tailor cli
 *     -p   production
 *     -t   test
 *     -d   development
 *     -e   envioronment，for finding get config file
 */


const
    Yargs = require("yargs"),
    Path = require("path"),
    pkg = require("../package.json"),
    args = Yargs.argv,
    tailor = require("../index.js");

Yargs
    .usage("Usage: $0 <command> [options]")
    .alias("p", "production")
    .alias("t", "test")
    .alias("d", "development")
    .alias("e", "envioronment")
    .alias("h", "help")
    .epilog("Leon.Cai copyright 2017 ");

tailor({
    env: "dev",
    ctx: Path.resolve(process.cwd())
});

console.log("tailor cli.");