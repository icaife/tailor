/**
 * @description module for css sprite
 * @author Leon.Cai
 * @see https://github.com/2createStudio/postcss-sprites
 * @see https://github.com/boijs/boi-kernel/blob/master/lib/config/generateConfig/mp/style.js
 */

const
    Path = require("path"),
    PostCssSprites = require("postcss-sprites");

module.exports = (config) => {
    let inputConfig = config.input;

    return {
        retina: true,
        relativeTo: "rule",
        spritePath: Path.join(config.root, inputConfig.path),
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
            return /([^\/\\]+-sprite)[\/\\]/.test(image.url) ? Promise.resolve() : Promise.reject();
        },
        groupBy: (image) => {
            let groups = image.url.match(/([^\/\\]+-sprite)[\/\\]/),
                groupName;

            groupName = image.path.replace(Path.join(config.root, inputConfig.path), "").replace(/[\\\/]+[^\\\/]+$/, "").replace(/\\/g, "/");
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
    }
};