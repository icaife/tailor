"use strict";

/**
 * @see http://webpack.github.io/docs/webpack-dev-server.html
 *      http://webpack.github.io/docs/webpack-dev-middleware.html
 */

const
    Webpack = require("webpack"),
    DevMiddleware = require("webpack-dev-middleware"),
    HotMiddleware = require("webpack-hot-middleware"),
    Express = require("express"),
    Path = require("path"),
    Log = require("../lib/util/log");

function run(config, compiler) {
    let
        serverConfig = config.server,
        inputConfig = config.input,
        outputConfig = config.output;

    const
        devMiddleware = DevMiddleware(compiler, serverConfig.devServer),
        hotMiddleware = HotMiddleware(compiler),
        app = new Express();

    compiler.plugin("compilation", function(compilation) {
        compilation.plugin("succeed-module", function(module) { //html-webpack-plugin-after-emit
            let resource = module.resource,
                reg = new RegExp(`.(${inputConfig.html.ext.join("|")})$`.replace(/\./g, "\\."), "i");

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

    Log.info(`start server on: ${serverConfig.host}:${serverConfig.port}`);

    app
    // .use([
    //         // new RegExp(`\\.(${inputConfig.file.ext.join("|")})$`, "i")
    //         /^\/+assets/
    //     ],
    //     function(req, res, next) {
    //         console.log(req.url);
    //         // res.sendFile(Path.join(config.root, outputConfig.path, outputConfig.file.path, req.url));
    //         // res.end();

    //         if (/iconfont/.test(req.url)) {
    //             console.log("found iconfont->", req.url);
    //         } else {
    //             console.log(req.url);
    //         }

    //         next();
    //     } ||
    //     Express.static(Path.join(config.root, outputConfig.path)))
        .use(devMiddleware)
        .use(hotMiddleware)
        .listen(serverConfig.port, serverConfig.host, function(err) {
            if (err) {
                throw new Error(err);
            }
        });

}

module.exports = run;