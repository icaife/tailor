/**
 * @description loader for riot tag
 * @author Leon.Cai
 */

module.exports = (config) => {
    let riotjsLoader = {
        loader: "riotjs-loader",
        options: {
            sourceMap: true
        }
    };

    return {
        riotjsLoader
    };
};