/**
 * @description pre commit
 * @author Leon.Cai
 */

"use stricts";

const Shell = require("shelljs"),
    Log = require("../util/log");

function checkConflict() {
    let reg = "^<<<<<<<\\s|^=======$|^>>>>>>>\\s",
        results = null,
        cmd = `git grep --git-dir=/Users/leon/dev/github/tffview/.git -n -P "${reg}"`;

    try {
        Shell.exec(cmd);
    } catch (e) {
        Log.error(e.toString());
        Shell.exit(1);
    }


}

module.exports = function() {};