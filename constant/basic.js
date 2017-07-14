/**
 * @description constant basic
 * @author Leon.Cai
 */
const
	Path = require("path"),
	proj = "tffview",
	cur = Path.resolve(__dirname, `../`),
	root = Path.resolve(cur, `../${proj}`);

module.exports = {
	cur: cur,
	root: root,
	src: "src",
	dest: "dest",
	views: "views",
	assets: "assets",
	cdn: "//cdn.tff.com:8080/",
	entry: {
		prefix: "index",
		glob: "**",
		ext: "js"
	},
	html: {
		ext: ["html", "blade.php"]
	},
	js: {
		ext: ["js"]
	},
	css: {
		ext: ["css", "less"]
	},
	img: {
		ext: ["jpg", "jpeg", "png", "gif", "svg", "eof", "woff", "woff2", "eot", "ttf"]
	}
};