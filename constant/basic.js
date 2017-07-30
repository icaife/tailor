/**
 * @description constant basic
 * @author Leon.Cai
 */
const
    Path = require("path"),
    cur = Path.resolve(__dirname, `../`),
    config = {
        cur: cur,
        domain: "localhost:8080",
        configFile: "tailor.config.js",
        src: "src",
        dest: "dest",
        views: "views",
        assets: "assets",
        cdn: "",
        entry: {
            prefix: "index",
            glob: "**",
            ext: "js"
        },
        output: {
            useHash: true,
            hashLen: 6,
            html: {
                ext: "blade.php"
            }
        },
        html: {
            ext: ["html"]
        },
        js: {
            ext: ["js"],
            attrs: {
                defer: true
            }
        },
        css: {
            ext: ["css", "less"]
        },
        img: {
            ext: ["jpg", "jpeg", "png", "gif", ]
        },
        file: {
            ext: ["svg", "eof", "woff", "woff2", "eot", "ttf"]
        },
        alias: {},
        vendor: {},
        globalVars: {},
        modules: [],
        extensions: []
    };

module.exports = config;