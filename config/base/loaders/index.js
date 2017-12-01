/**
 * @description loaders
 * @author Leon.Cai
 * @see https://doc.webpack-china.org/loaders
 */
const
    FileLoader = require("./file.js"),
    HtmlLoader = require("./html.js"),
    ImageLoader = require("./image.js"),
    JSLoader = require("./js.js"),
    StyleLoader = require("./style.js"),
    VueLoader = require("./vue.js"),
    UtilLoader = require("./util.js");

module.exports = (config) => {
    let
        file = FileLoader(config),
        html = HtmlLoader(config),
        image = ImageLoader(config),
        js = JSLoader(config),
        style = StyleLoader(config),
        vue = VueLoader(config),
        util = UtilLoader(config);

    return Object.assign({}, file, html, image, js, style, vue, util);
};