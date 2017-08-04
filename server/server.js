"use strict";

const
    Webpack = require("webpack"),
    DevMiddleware = require("webpack-dev-middleware"),
    HotMiddleware = require("webpack-hot-middleware"),
    Express = require("express"),
    Config = require("../config"),
    basic = Config.basic,
    webpackConfig = Config.webpack,
    serverConfig = Config.server;

function redirectMiddleware(req, res, next) {
    let reqUrl = req.url;

    if (!/^\/?assets/.test(reqUrl)) {}

    // console.log(reqUrl);
    return next();
}

function run() {
    // console.log(serverConfig.devServer);
    const
        compiler = Webpack(webpackConfig),
        devMiddleware = DevMiddleware(compiler, serverConfig.devServer),
        hotMiddleware = HotMiddleware(compiler),
        app = new Express();

    compiler.plugin("compilation", function(compilation) {
        compilation.plugin("succeed-module", function(module) {
            let resource = module.resource;
            let reg = new RegExp(`.(${basic.html.ext.join("|")})$`.replace(/\./g, "\\."), "i");
            if (reg.test(resource)) {
                hotMiddleware.publish({
                    action: "reload",
                    src: resource
                });
            }
        });
    });

    app
        .use(devMiddleware)
        .use(hotMiddleware)
        // .use(redirectMiddleware)
        .listen(serverConfig.port, serverConfig.host, function(err) {
            if (err) {
                throw new Error(err);
            }
        });

}

module.exports = {
    run: run
};