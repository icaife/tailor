/**
 * @description get entries
 * @author Leon.Cai
 */

"use strict";

const
    _ = require("lodash"),
    Glob = require("glob"),
    Path = require("path");

module.exports = (config) => {
    let entries = {},
        inputConfig = config.input,
        cwd = Path.join(config.root, inputConfig.path),
        entryConfig = inputConfig.entry,
        glob = "**",
        prefix = entryConfig.prefix,
        ext = entryConfig.ext,
        options = {
            cwd: cwd,
            sync: true
        },
        globInstance = new Glob.Glob(`${glob}/${prefix}.${ext}`, options),
        dirs = globInstance.found;

    dirs.forEach(function(dir) {
        let name = dir.replace(/\.[^.]+$/ig, "").replace(/\\/g, "/");

        if (config.reg.test(name)) {
            entries[name] = [`./${dir}`];
        }
    });

    return entries;
};