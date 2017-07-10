/**
 * @description config for tailor
 * @author Leon.Cai
 */
"use strict";
const
	Path = require("path");

module.exports = {
	basic: {
		cur: Path.resolve(__dirname, "../"),
		root: Path.resolve(Path.join(__dirname, "../../tffview")),
		src: "src",
		dest: "dest",
		views: "views",
		env: "dev",
		assets: "assets",
		cdn: "//cdn.tff.com/",
		entryPrefix: "index",
		entryExt: "js",
		entryGlob: "**",
		htmlExt: "blade.php",
		jsExt: "js",
		cssExt: "css"
	}
};