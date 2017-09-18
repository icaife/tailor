/**
 * @description module config
 * @author Leon.Cai
 */
"use strict";

const
    Path = require("path"),
    ExtractTextPlugin = require("extract-text-webpack-plugin"),
    StringReplaceWebpackPlugin = require("string-replace-webpack-plugin"),
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
        spritePath: Path.join(config.basic.root, config.basic.src /*, config.basic.assets*/ ),
        // stylesheetPath: Path.join(config.basic.root, config.basic.src /*, config.basic.assets*/ ),
        spritesmith: {
            padding: 4,
            algorithm: "binary-tree", //default
            algorithmOpts: {
                sort: true
            },
            exportOpts: {
                quality: 85
            }
        },
        filterBy: (image) => {
            return /([^\/\\]+-sprite)[\/\\]/ /*TODO*/ .test(image.url) ? Promise.resolve() : Promise.reject();
        },
        groupBy: (image) => {
            let groups = image.url.match(/([^\/\\]+-sprite)[\/\\]/),
                groupName = undefined;
            //console.log(image.path.replace(Path.join(config.basic.root, config.basic.src), ""));
            // groupName = groups ? groups[1] : "icons-sprite";
            groupName = image.path.replace(Path.join(config.basic.root, config.basic.src), "").replace(/[\\\/]+[^\\\/]+$/, "").replace(/\\/g, "/");
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
                    image.groups = image.groups.filter((group) => {
                        return ("@" + ratio + "x") !== group;
                    });
                    groupName += "@" + ratio + "x";
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
                let filenameChunks = spritesheet.groups.concat(spritesheet.extension),
                    destPath = Path.join(opts.spritePath, filenameChunks.join("."));

                return destPath;
            }
        }
    });
let
    jsRule = config => {
        let
            isDev = config.env === config.constant.env.dev;

        return [{
            test: /\.js/,
            exclude: /node_modules|vendor/,
            use: [{
                loader: "babel-loader",
                options: {
                    presets: [
                        Path.join(config.basic.cur, "./node_modules/babel-preset-es2015"),
                        Path.join(config.basic.cur, "./node_modules/babel-preset-stage-2")
                    ],
                    babelrc: false,
                    retainLines: true,
                    cacheDirectory: true,
                    // exclude: /node_modules|vendor/
                }
            }, {
                /**
                 * @see https://www.npmjs.com/package/eslint-loader
                 */
                loader: "eslint-loader",
                // enforce: "pre",
                options: {
                    configFile: Path.join(config.basic.root, ".eslintrc"),
                    failOnWarning: false, // warning occured then stop
                    failOnError: false, // error occured then stop
                    cache: false, // disable cache
                    emitError: true,
                    emitOnWarning: false,
                    quiet: false,
                    exclude: /node_modules|vendor/
                        //@ see https://www.npmjs.com/package/eslint-loader#outputreport-default-false-
                        // outputReport: {
                        //     filePath: "d:/checkstyle.json",
                        //     formatter: require("eslint/lib/formatters/checkstyle")
                        // }
                        // formatter: require("eslint-friendly-formatter")
                }
            }]
        }]
    };

let
    htmlRule = config => [{
        test: new RegExp(`.(${config.basic.html.ext.join("|")})$`.replace(/\./g, "\\."), "i"),
        use: [
            /*{
                        loader: "html-loader",
                        options: {
                            // interpolate: true,
                            // ignoreCustomFragments: [/\{\{.*?}}/],
                            // attrs: ["img:src", "img:data-src", "img:data-original", "link:href", "script:src"]
                        }
                    }, */

            {
                loader: /*lib/loader/*/ "art-template-loader",
                options: {
                    extname: "." + config.basic.html.ext[0], //TODO
                    htmlResourceRoot: Path.join(config.basic.root, config.basic.src),
                    root: Path.join(config.basic.root, config.basic.src),
                    htmlResourceRules: [
                        /<(?:img)[^>]+\b(?:(?:data|original)-)?(?:src|href)="([^"{}]*)"[^>]*?>/img, //img tag
                    ],
                    //handle art-template and php template conflicts
                    rules: [{
                            test: /{{raw}}([\w\W]*?){{\/raw}}/,
                            use: function(match, code) {
                                return {
                                    output: 'raw',
                                    code: JSON.stringify(code)
                                }
                            }
                        }, {
                            test: /@{{([@#]?)[ \t]*([\w\W]*?)[ \t]*}}/, //TODO:vue or other javascript,php blade template
                            use: function(match, raw, close, code) {

                                return {
                                    code: `"${match.toString()}"`,
                                    output: "raw"
                                };
                            }
                        }, {
                            test: /{#([@#]?)[ \t]*([\w\W]*?)[ \t]*#}/, //TODO:vue or other javascript,php blade template
                            use: function(match, raw, close, code) {

                                return {
                                    code: `"${match.toString()}"`.replace(/\.(\w+)/g, '[\'$1\']').replace(/{#/g, "{{").replace(/#}/g, "}}"),
                                    output: "raw"
                                };
                            }
                        }
                        /*, {
                                                    test: /{{[ \t]*\$([\w\W]*?)[ \t]*}}/, //php blade template
                                                    use: function(match, raw, close, code) {

                                                        return {
                                                            code: `"${match.toString()}"`,
                                                            output: "raw"
                                                        };
                                                    }
                                                }*/
                        , {
                            test: /{{[ \t]*\w+\([ \t]*\$([\w\W]*?)?\)[ \t]*}}/, //php blade template with function
                            use: function(match, raw, close, code) {
                                return {
                                    code: `"${match.toString()}"`,
                                    output: "raw"
                                };
                            }
                        },
                        ...require("art-template").defaults.rules,
                    ],
                }
            }, {
                loader: StringReplaceWebpackPlugin.replace({ //TODO replace something
                    replacements: [{
                        pattern: /<script[^>]+src="([^"]+)"[^>]*?>[\s\S]*?<\/script>/img,
                        replacement: function(match, src, offset, string) {
                            let result = /^(\w+:)?(\/\/)/.test(src) ? src : (`${config.basic.cdn}/${config.basic.assets }/${src}`).replace(/\\/g, "/");

                            return match.toString().replace(src, result);
                            //TODO: webpack loader async
                            // return new Promise((resolve, reject) => {
                            //     require.resolve(this.options.context, src, function(err, result) {
                            //         if (err) {
                            //             reject(err);
                            //         } else {
                            //             resolve(result);
                            //         }
                            //     });
                            // });
                        }
                    }]
                })
            },
            /*
                        //todo;
                        {
                            loader: "htmllint-loader",
                            // enforce: "pre",
                            // exclude: /node_modules/,
                            // @see https://github.com/mattlewis92/htmlhint-loader
                            options: {
                                configFile: Path.join(config.basic.root, ".htmllintrc"),
                                config: Path.join(config.basic.root, ".htmllintrc"),
                                // emitAs: "error"
                            }
                        }*/
        ],
    }, {
        test: /\.tag$/,
        use: [{
            loader: "riotjs-loader",
            options: {
                sourceMap: true
            }
        }]
    }, {
        test: /\.vue$/,
        use: [{
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
                // extractCSS: false,
            }
        }]
    }];

let
    styleRule = config => {
        let
            isDev = config.env === config.constant.env.dev,
            postcssPlugins = [AutoPrefixer({
                    browsers: ["Chrome >= 35", "FireFox >= 40", "ie > 8", "Android >= 4", "Safari >= 5.1", "iOS >= 7"],
                    remove: true
                }),
                CssNano({
                    // safe: true,
                    // minifyFontValues: {
                    //     removeQuotes: false
                    // },
                    // discardUnused: {
                    //     fontFace: false
                    // }
                }),
            ];

        // if (!isDev) {
        postcssPlugins.push(PostCssSprites(spritesConfig(config)));
        // }

        let styleLoaders = [{
            loader: "style-loader",
            options: {
                sourceMap: true
            }
        }, {
            loader: "css-loader",
            options: {
                importLoaders: 1,
                sourceMap: true
            }
        }, {
            loader: "postcss-loader",
            options: {
                plugins: postcssPlugins,
                sourceMap: true
            }
        }, {
            loader: "less-loader",
            options: {
                sourceMap: true
            }
        }];

        return [{
            test: new RegExp(`.(${config.basic.css.ext.join("|")})$`.replace(/\./g, "\\."), "i"),
            // exclude: /node_modules/,
            use: isDev ? styleLoaders : ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: styleLoaders.slice(1)
            })
        }]
    };
let
    imageRule = config => {
        let basic = config.basic,
            outputConfig = basic.output,
            name = `${config.basic.assets}/[path][name]` + (outputConfig.useHash ? `.[hash:${outputConfig.hashLen}]` : "") + `.[ext]`;

        return [{
            test: {
                test: new RegExp(`.(${config.basic.img.ext.join("|")})$`.replace(/\./g, "\\."), "i"),
            },
            use: [{
                loader: "file-loader", //url-loader
                options: {
                    name: `${name}`,
                    useRelativePath: true
                }
            }, {
                loader: "image-webpack-loader",
                options: {
                    mozjpeg: { //jpeg
                        quality: 80,
                        progressive: true,
                    },
                    bypassOnDebug: true,
                    optipng: { //png
                        optimizationLevel: 4
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
                    },
                    limit: 10 * 1024
                }
            }]
        }];
    };

let
    fileRule = config => {
        let basic = config.basic,
            outputConfig = basic.output,
            name = `${config.basic.assets}/[path][name]` + (outputConfig.useHash ? `.[hash:${outputConfig.hashLen}]` : "") + `.[ext]`;

        return [{
            test: {
                test: new RegExp(`.(${config.basic.file.ext.join("|")})$`.replace(/\./g, "\\."), "i"),
            },
            use: [{
                loader: "file-loader", //url-loader
                options: {
                    name: `${name}`,
                    useRelativePath: true,
                    // limit: 1024 * 10
                }
            }]
        }];
    };

module.exports = (config) => {
    let rules = [...jsRule(config), ...htmlRule(config), ...styleRule(config), ...imageRule(config), ...fileRule(config)];

    return {
        rules: rules,
        noParse: [/vendor/]
    }
};