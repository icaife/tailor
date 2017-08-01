"use strict";

const
    Webpack = require("webpack"),
    Koa = require("koa"),
    KoaMiddleware = require("koa-webpack-middleware"),
    DevMiddleware = KoaMiddleware.devMiddleware, //require("webpack-dev-middleware"),
    HotMiddleware = KoaMiddleware.hotMiddleware, //require("webpack-hot-middleware"),
    Config = require("../config"),
    basic = Config.basic,
    webpackConfig = Config.webpack,
    serverConfig = Config.server,
    router = new(require("koa-router"))();

function redirectMiddleware(ctx, next) {
    let req = ctx.req;
    let res = ctx.res;
    let reqUrl = req.url;

    if (!/^\/?assets/.test(reqUrl)) {}

    console.log(reqUrl);
    return next();
}

function run() {
    const
        compiler = Webpack(webpackConfig),
        devMiddleware = DevMiddleware(compiler, serverConfig.devServer),
        hotMiddleware = HotMiddleware(compiler),
        app = new Koa();

    compiler.plugin("compilation", function(compilation) {
        // compilation.plugin("html-webpack-plugin-after-emit", function(data, cb) {
        // 	console.log("[HMR] html changed,refresh page..");
        // 	hotMiddleware.publish({
        // 		action: "reload"
        // 	});
        // 	cb();
        // });

        compilation.plugin("succeed-module", function(module) {
            let resource = module.resource;
            let reg = new RegExp(`.(${config.basic.html.ext.join("|")})$`.replace(/\./g, "\\."), "i");

            if (reg.test(resource)) {
                hotMiddleware.publish({
                    action: "reload",
                    src: resource
                });
            }
        });
    });

    router.get("/:name", function(ctx, next) {
        ctx.body = "Hello " + ctx.params.name;

        return next();
    });

    app
        .use(devMiddleware)
        .use(hotMiddleware)
        // .use(redirectMiddleware)
        .use(router.routes())
        .use(router.allowedMethods())
        .listen(serverConfig.port, serverConfig.host, function(err) {
            if (err) {
                throw new Error(err);
            }
        });
}

module.exports = {
    run: run
};