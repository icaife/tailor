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
        info: Chalk.black,
        error: Chalk.red,
        warn: Chalk.yellow
    };

function log(msg, type) {
    let fn = COLORS[type] || COLORS.info;
    console.log(`[${PROJ_NAME}]` + now() + ": " + fn(msg));
}

function now() {
    let m = Moment();

    return m.format("LTS");
}

log.info = function(msg) {
    log(msg, COLORS.info);
};
log.error = function(msg) {
    log(msg, COLORS.error);
};
log.warn = function(msg) {
    log(msg, COLORS.warn);
};
log.COLORS = COLORS;
log.chalk = Chalk;

module.exports = log;