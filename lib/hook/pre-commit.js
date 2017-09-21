/**
 * @description pre commit
 * @author Leon.Cai
 * @see http://www.runoob.com/linux/linux-shell-variable.html
 * @see https://github.com/typicode/husky
 */

"use strict";

const
    FSE = require("fs-extra"),
    Path = require("path"),
    Shell = require("shelljs"),
    Log = require("../util/log"),
    pkg = require("../../package.json");

/**
 * check pre commit installed
 * @param  {[type]} projPath [description]
 * @return {[type]}          [description]
 */
function checkInstalled(projPath) {
    let preCommitPath = getPreCommitPath(projPath),
        content = FSE.readFileSync(preCommitPath, "utf-8"),
        version = content.match(/version:\s*(\d+(?:\.\d+){2})/) || false;

    if (version && version[1] !== pkg.version) {
        version = false;
    }

    return !!content.toString().match(/tailor/img) && !!version;
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

    let preCommitPath = Path.join(gitPath, "/hooks/pre-push");

    FSE.ensureFileSync(preCommitPath);

    return preCommitPath;
}

/**
 * install pre commit
 * @param  {[type]} projPath [description]
 * @return {[type]}          [description]
 */
function install(projPath) {
    let
        projName = projPath.match(/([^\/]+)[\/\\]?$/g)[0],
        shellContent =
        `#!/bin/sh
#version: ${pkg.version}
#context: ${projPath}
echo "====================[tailor lint shell start]===================="
tempDir=$PWD;
projDir="${projPath}";

if [ -d $projDir ]; then
    cd $projDir && tailor lint
    RESULT=$?
else
    echo "tailor not found,plz check it"
fi

cd $tempDir

echo "====================[tailor lint shell end with exit code:$RESULT]===================="

[ $RESULT -ne 0 ] && exit 1

exit 0
#tailor pre commit shell end`.replace(/\r/g, ""),
        gitPath = getPreCommitPath(projPath);

    if (gitPath) {
        FSE.writeFileSync(gitPath, shellContent);
    } else {
        Log.error("not supported GIT.");
    }
}

function run(config) {

    //check pre commit and install pre commit shell
    if (!checkInstalled(config.root)) {
        install(config.root, config.tailor.path);
        Log.info("install tailor pre-commit success");
    } else {
        Log.info("tailor precommit hook has been installed already");
    }

}

module.exports = run;