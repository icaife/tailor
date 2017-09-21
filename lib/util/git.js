/**
 * util for git
 */

const Shell = require("shelljs");

/**
 * check conflict
 * @return {[type]} [description]
 */
function checkConflict() {
    let reg = "^<<<<<<<\\s|^=======$|^>>>>>>>\\s",
        results = null,
        cmd = `git grep -n -P "${reg}"`;

    try {
        Shell.exec(cmd, {
            cwd: null
        }, function(e, stdout, stderr) {

        });
    } catch (e) {
        Log.error(e.toString());
        Shell.exit(1);
    }
}


module.exports = {
    checkConflict
};