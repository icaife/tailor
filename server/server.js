"use strict";

const
    Webpack = require("webpack"),
    DevMiddleware = require("webpack-dev-middleware"),
    HotMiddleware = require("webpack-hot-middleware"),
    Express = require("express");

function redirectMiddleware(req, res, next) {
    let reqUrl = req.url;

    if (!/^\/?assets/.test(reqUrl)) {}

    // console.log(reqUrl);
    return next();
}

function run(config) {
    let
        basic = config.basic,
        webpackConfig = config.webpack,
        serverConfig = config.server;

    const
        compiler = Webpack(webpackConfig),
        devMiddleware = DevMiddleware(compiler, serverConfig.devServer),
        hotMiddleware = HotMiddleware(compiler),
        app = new Express();

    compiler.plugin("compilation", function(compilation) {
        compilation.plugin("succeed-module", function(module) {
            let resource = module.resource,
                reg = new RegExp(`.(${basic.html.ext.join("|")})$`.replace(/\./g, "\\."), "i");

            if (reg.test(resource)) {
                refresh.queue.push(resource);
            }
        });

        function refresh(resource) {
            hotMiddleware.publish({
                action: "reload",
                src: resource
            });
        }

        refresh.queue = [];

        compiler.plugin("done", function() {
            refresh.queue.length && refresh(refresh.queue);
            refresh.queue.length = 0;
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

module.exports = run;