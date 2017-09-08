#!/usr/bin/env node

/**
 * @description tf-tailor cli
 * @see http://hao.jobbole.com/commander-js/
 */

const
    cmd = require("commander"),
    pkg = require("../package.json");

cmd
    .version(pkg.version)
    .usage("[options] <file ...>")
    .option("-d, --development", "Development environment")
    .option("-t, --test", "Test environment")
    .option("-pcli, --production", "Product environment")
    .parse(process.argv);

console.log("test");