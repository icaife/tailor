/**
 * @description loader for vue
 * @author Leon.Cai
 */

module.exports = (config) => {
    let
        outputConfig = config.output,
        vueLoader = {
            //@see https://github.com/vuejs/vue-loader/blob/master/docs/en/options.md
            //@see https://vue-loader.vuejs.org/zh-cn/
            loader: "vue-loader",
            options: {
                // sourceMap: !!config.devtool,
                cssSourceMap: false,
                sourceMap: false,
                esModule: false,
                transformToRequire: {
                    script: ["src"],
                    style: ["src"],
                    img: ["src", "data-src", "data-original"] //TODO
                },
                loaders: { //TODO
                    js: "babel-loader!eslint-loader"
                }
            }
        };
    return {
        vueLoader
    };
};