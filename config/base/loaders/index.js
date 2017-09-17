/**
 * @description loaders
 * @author Leon.Cai
 * @see https://doc.webpack-china.org/loaders/thread-loader
 */
const
    FileLoader = require("./file.js"),
    HtmlLoader = require("./html.js"),
    ImageLoader = require("./image.js"),
    JSLoader = require("./js.js"),
    RoitjsLoader = require("./roitjs.js"),
    StyleLoader = require("./style.js"),
    VueLoader = require("./vue.js");

module.exports = (config) => {
    let
        file = FileLoader(config),
        html = HtmlLoader(config),
        image = ImageLoader(config),
        js = JSLoader(config),
        roitjs = RoitjsLoader(config),
        style = StyleLoader(config),
        vue = VueLoader(config);

    return {
        file,
        html,
        image,
        js,
        roitjs,
        style,
        vue
    };
};