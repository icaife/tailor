/**
 * base config
 * @param  {[type]} cofnig [description]
 * @return {[type]}        [description]
 */
const
    Entry = require("./entry.js"),
    Module = require("./module.js"),
    Resolve = require("./resolve.js"),
    ResolveLoader = require("./resolve-loader.js"),
    Plugin = require("./plugin.js"),
    Output = require("./output.js");

module.exports = (config) => {
    let
        entry = Entry(config),
        module = Module(config, entry),
        resolve = Resolve(config, entry);

    return {
        entry: entry,
        module: module,
        resolve: resolve
    };
};