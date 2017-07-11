"use strict";

const
    Webpack = require("webpack"),
    WebpackDevServer = require("webpack-dev-server"),
    webpackConfig = require("./webpack.config.js"),
    compiler = Webpack(webpackConfig),
    server = new WebpackDevServer(compiler, webpackConfig.devServer);

server.listen(8080);