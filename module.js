/**
 * @description module config
 * @author Leon.Cai
 */
"use strict";
const
    Path = require("path"),
    ExtractTextPlugin = require("extract-text-webpack-plugin"),
    AutoPrefixer = require("autoprefixer"),
    CssNano = require("cssnano"),
    PostCss = require("postcss"),
    PostCssSprites = require("postcss-sprites"),
    updateRule = require("postcss-sprites/lib/core").updateRule;

let
    spritesConfig = (config) => ({
        /**
         * @see https://github.com/2createStudio/postcss-sprites
         * @see https://github.com/boijs/boi-kernel/blob/master/lib/config/generateConfig/mp/style.js
         */
        retina: true,
        relativeTo: "rule",
        spritePath: Path.join(config.basic.dest, config.basic.assets),
        stylesheetPath: Path.join(config.basic.dest, config.basic.assets),
        // basePath: "",
        spritesmith: {
            padding: 4
        },
        filterBy: (image) => {
            return /([^\/\\]+-sprite)[\/\\]/ /*TODO*/ .test(image.url) ? Promise.resolve() : Promise.reject();
        },
        groupBy: (image) => {
            let groups = image.url.match(/([^\/\\]+-sprite)[\/\\]/),
                groupName = undefined;
            console.log(image.path.replace(Path.join(config.basic.root, config.basic.src), ""));
            groupName = groups ? groups[1] : "icons-sprite";
            // groupName = image.path.replace(Path.join(config.basic.root, config.basic.src), "").replace(/[\\\/]+[^\\\/]+$/, "").replace(/\\/g, "/");
            image.retina = true;
            image.ratio = 1;

            if (groups) {
                let ratio = /@(\d+)x$/gi.exec(groupName);
                if (ratio) {
                    ratio = ratio[1];

                    while (ratio > 10) {
                        ratio = ratio / 10;
                    }

                    image.ratio = ratio;
                }
            }

            return Promise.resolve(groupName);
        },
        hooks: {
            onUpdateRule: function(rule, token, image) {
                ["width", "height"].forEach(function(prop) {
                    let value = image.coords[prop];

                    if (image.retina) {
                        value /= image.ratio;
                    }

                    rule.insertAfter(rule.last, PostCss.decl({
                        prop: prop,
                        value: value + "px"
                    }));
                });

                updateRule(rule, token, image);
            },
            onSaveSpritesheet: function(opts, spritesheet) {
                let filenameChunks = spritesheet.groups.concat(spritesheet.extension);

                return Path.join(opts.spritePath, filenameChunks.join('.'));
            }
        }
    }),
    htmlRule = (config) => ({
        test: /\.(html|\.blade.php)$/,
        use: "html-loader"
    }),
    styleRule = (config) => ({
        test: /\.(css|less)$/,
        use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: [{
                loader: "css-loader",
                options: {
                    // importLoaders: 1
                }
            }, {
                loader: "postcss-loader",
                options: {
                    plugins: [
                        AutoPrefixer({
                            browsers: ["Chrome >= 35", "FireFox >= 40", "ie > 8", "Android >= 4", "Safari >= 5.1", "iOS >= 7"],
                            remove: true
                        }),
                        CssNano({}),
                        PostCssSprites(spritesConfig(config)),
                    ]
                }
            }, {
                loader: "less-loader",
                options: {}
            }]
        })
    }),
    imageRule = (config) => ({
        test: /\.(png|jpe?g|bmp|gif|svg|eof|woff|eot)/i,
        use: [{
            loader: "file-loader", //url-loader
            options: {
                name: `${config.basic.assets}/[path][name].[hash:6].[ext]`,
                // limit: 1024 * 10
            }
        }]
    }),
    otherRule = (config) => ({ //TODO
        test: /(png|jpe?g|gif|svg|eof|woff|eot)/ig,
        use: [{
            loader: "file-loader",
            options: {
                name: `${config.basic.assets}/[path][name].[hash:6].[ext]`,
            }
        }, {
            loader: "image-webpack-loader",
            options: {
                mozjpeg: { //jpeg
                    quality: 80
                },
                bypassOnDebug: true,
                progressive: true,
                optipng: { //png
                    optimizationLevel: 3
                },
                pngquant: { //png
                    quality: "75-90",
                    speed: 4,
                    verbose: true
                },
                svgo: { //svg
                    plugins: [{
                        removeViewBox: false
                    }, {
                        removeEmptyAttrs: false
                    }]
                }
            }
        }]
    });

module.exports = (config) => {
    return {
        rules: [htmlRule(config), styleRule(config), imageRule(config)]
    }
}