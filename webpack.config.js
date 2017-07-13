/**
 * @description webpack config
 * @author Leon.Cai
 */

/**
 * @see
 * 	"dev": "webpack --progress --colors --watch",
 *  "publish-mac": "export NODE_ENV=prod&&webpack -p --progress --colors",
 *  "publish-windows": "SET NODE_ENV=prod&&webpack -p --progress --colors"
 * @see  https://github.com/gwuhaolin/blog/issues/2
 */
"use strict";

const
    Webpack = require("webpack"),
    Config = require("./config");

module.exports = Config.webpack;