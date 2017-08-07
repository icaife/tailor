/**
 * @description pre commit
 * @author Leon.Cai
 * @see http://www.runoob.com/linux/linux-shell-variable.html
 */

"use strict";

const
    FSE = require("fs-extra"),
    Path = require("path"),
    Shell = require("shelljs"),
    Log = require("../util/log");

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

/**
 * check pre commit installed
 * @param  {[type]} projPath [description]
 * @return {[type]}          [description]
 */
function checkInstalled(projPath) {
    let preCommitPath = getPreCommitPath(projPath);

    let content = FSE.readFileSync(preCommitPath, "utf-8");

    return !!content.toString().match(/tailor/img);
}

/**
 * get pre commit file path
 * @param  {[type]} projPath [description]
 * @return {[type]}          [description]
 */
function getPreCommitPath(projPath) {
    let gitPath = Path.join(projPath, ".git"),
        isExist = FSE.existsSync(gitPath);

    if (!isExist) { //this proj is not a git repository
        return false;
    }

    let preCommitPath = Path.join(gitPath, "/hooks/pre-commit");

    FSE.ensureFileSync(preCommitPath);

    return preCommitPath;
}

/**
 * install pre commit
 * @param  {[type]} projPath [description]
 * @return {[type]}          [description]
 */
function install(projPath, cur) {
    let
        projName = projPath.match(/([^\/]+)[\/\\]?$/g)[0],
        shellContent =
        `#!/bin/sh
#proj:${projName}
echo "====================[tailor pre commit shell start]===================="
tempDir=$PWD;
tailorDir="${cur}";

if [ -d $tailorDir ]; then
    cd $tailorDir && npm run test proj=${projName}
    RESULT=$?
else
    echo "tailor not found,plz check it"
fi

cd $tempDir

echo "====================[tailor pre commit shell end with exit code:$RESULT]===================="

[ $RESULT -ne 0 ] && exit 1

exit 0
#tailor pre commit shell end`.replace(/\r/g, "");

    FSE.appendFileSync(getPreCommitPath(projPath), shellContent);
}

function run(config) {
    let basic = config.basic;

    //check pre commit and install pre commit shell
    if (!checkInstalled(basic.root)) {
        install(basic.root, basic.cur);
        Log.info("install tailor pre-commit success");
    }

}

module.exports = run;