/**
 * base config
 * @param  {[type]} cofnig [description]
 * @return {[type]}        [description]
 */
const
    Entry = require("./entry.js"),
    Resolve = require("./resolve.js"),
    ResolveLoader = require("./resolve-loader.js"),
    Plugin = require("./plugin.js"),
    Output = require("./output.js"),
    Loaders = require("./loaders"),
    Module = require("./module.js");

module.exports = (config) => {
    let
        loaders = Loaders(config),
        module = Module(config, loaders),
        entry = Entry(config),
        resolve = Resolve(config, entry),
        resolveLoader = ResolveLoader(config, entry),
        plugins = Plugin(config, entry),
        output = Output(config, entry);

    return {
        entry,
        module,
        resolve,
        resolveLoader,
        plugins,
        output
    };
};