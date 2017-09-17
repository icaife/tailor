/**
 * @description loader for vue
 * @author Leon.Cai
 */

module.exports = (config) => {
    let vueLoader = {
        //@see https://github.com/vuejs/vue-loader/blob/master/docs/en/options.md
        //@see https://vue-loader.vuejs.org/zh-cn/
        loader: "vue-loader",
        options: {
            sourceMap: true,
            esModule: false,
            transformToRequire: {
                script: ["src"],
                style: ["src"],
                img: ["src", "data-src", "data-original"]
            },
            loaders: {
                js: "babel-loader!eslint-loader"
            }
        }
    };
    return {
        vueLoader
    };
};