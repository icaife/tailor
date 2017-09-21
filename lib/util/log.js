/**
 * @description log util for tailor
 * @author Leon.Cai
 */
"use strict";

const
    Chalk = require("chalk"),
    Moment = require("moment"),
    PROJ_NAME = "tailor",
    COLORS = {
        info: Chalk.gray,
        error: Chalk.red,
        warn: Chalk.yellow
    };

function log(msg, type) {
    let fn = COLORS[type] || COLORS.info;

    console.log(Chalk.blue(`[${PROJ_NAME}]${now()}:  ` + fn(msg)));
}

function now() {
    let m = Moment();

    return m.format("LTS");
}

log.info = function(msg) {
    log(msg, "info");
};

log.error = function(msg) {
    log(msg, "error");
};

log.warn = function(msg) {
    log(msg, "warn");
};

log.COLORS = COLORS;
log.chalk = Chalk;

module.exports = log;