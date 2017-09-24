/**
 * @description module for postcss
 * @author Leon.Cai
 */
const
    AutoPrefixer = require("autoprefixer"),
    CssNano = require("cssnano"),
    PostCssSprites = require("postcss-sprites"),
    SpriteConfig = require("./sprite-config.js");

module.exports = (config) => {
    let
        autoprefixer = AutoPrefixer({
            browsers: ["Chrome >= 35", "FireFox >= 40", "ie > 9", "Android >= 4", "Safari >= 5.1", "iOS >= 7"],
            remove: true
        }),
        cssnano = CssNano(),
        spriteConfig = SpriteConfig(config),
        sprite = PostCssSprites(spriteConfig);

    return [
        autoprefixer,
        cssnano,
        sprite
    ];
};