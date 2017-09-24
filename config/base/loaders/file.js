/**
 * @description loader for file
 * @author Leon.Cai
 */

module.exports = (config) => {
    let
        outputConfig = config.output,
        name = `${outputConfig.file.path}/[path][name]` + (outputConfig.useHash ? `.[hash:${outputConfig.hashLen}]` : "") + `.[ext]`;

    let fileLoader = {
        loader: "file-loader",
        options: {
            name: `${name}`,
            useRelativePath: true
        }
    };

    return {
        fileLoader: fileLoader
    };
};