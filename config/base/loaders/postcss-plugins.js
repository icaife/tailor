/**
 * @description module for postcss
 * @author Leon.Cai
 */
const
    AutoPrefixer = require("autoprefixer"),
    CssNano = require("cssnano"),
    PostCssSprites = require("postcss-sprites"),
    Sprite = require("./sprite-config.js");

module.exports = (config) => {
    let autoprefixer = AutoPrefixer({
            browsers: ["Chrome >= 35", "FireFox >= 40", "ie > 8", "Android >= 4", "Safari >= 5.1", "iOS >= 7"],
            remove: true
        }),
        cssnano = CssNano(),
        sprite = PostCssSprites(Sprite(config));

    return [
        autoprefixer,
        cssnano,
        sprite
    ];
};