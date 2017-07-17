/**
 * @description webpack config
 * @author Leon.Cai
 */

/**
 * @see
 * 	"dev": "webpack --process --colors --watch",
 *  "publish-mac": "export NODE_ENV=prod&&webpack -p --process --colors",
 *  "publish-windows": "SET NODE_ENV=prod&&webpack -p --process --colors"
 * @see  https://github.com/gwuhaolin/blog/issues/2
 * @see  http://www.jianshu.com/p/1a452981f510
 * @see  http://acgtofe.com/posts/2016/02/full-live-reload-for-express-with-webpack
 */
"use strict";

const
	Webpack = require("webpack"),
	Config = require("./config");

module.exports = Config.webpack;