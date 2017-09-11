/**
 * @description get entries
 * @author Leon.Cai
 * @see TODO:https://github.com/gwuhaolin/web-webpack-plugin html as entry
 */

"use strict";

const
    _ = require("lodash"),
    Glob = require("glob"),
    Path = require("path");

module.exports = (config) => {
    let entries = {},
        plugins = [],
        basic = config.basic,
        cwd = Path.join(basic.root, basic.src),
        entryConfig = basic.entry,
        glob = entryConfig.glob,
        prefix = entryConfig.prefix,
        ext = entryConfig.ext,
        options = {
            cwd: cwd,
            sync: true
        },
        globInstance = new Glob.Glob(`${glob}/${prefix}.${ext}`, options),
        dirs = globInstance.found;

    dirs.forEach(function(dir) {
        let name = dir.replace(/\.[^.]+$/ig, ""),
            mod = Path.join(name.replace(/[\/\\]+[^\/\\]+$/, ""), prefix).replace(/\\/g, "/");

        entries[mod] = [`./${dir}`];
    });

    return entries;
};