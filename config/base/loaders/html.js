/**
 * @description loader for html
 * @author Leon.Cai
 */

const Path = require("path");

module.exports = config => {
	let outputConfig = config.output,
		inputConfig = config.input;

	let htmlLoader = {
			loader: "html-loader",
			options: {}
		},
		/**
		 * @see https://aui.github.io/art-template/zh-cn/docs/rules.html
		 */
		artTemplateLoader = {
			loader: "art-template-loader",
			options: {
				debug: config.env === "dev",
				extname: "." + inputConfig.html.ext[0],
				cache: !true,
				htmlResourceRoot: Path.join(config.root, inputConfig.path),
				root: Path.join(config.root, inputConfig.path),
				htmlResourceRules: [
					/<(?:img)[^>]+\b(?:\w+-?)?(?:src)="([^"{}]*(?:jpg|png|gif|webp|bmp))"[^>]*?>/gim //img tag
				],
				rules: [
					{
						test: /{{raw}}([\w\W]*?){{\/raw}}/,
						use: function(match, code) {
							return {
								output: "raw",
								code: JSON.stringify(code)
							};
						}
					},
					{
						test: /@{{([@#]?)[ \t]*([\w\W]*?)[ \t]*}}/g, //TODO:vue or other javascript,php blade template
						use: function(match, raw, close, code) {
							return {
								code: `"${match.toString()}"`,
								output: "raw"
							};
						}
					},
					{
						test: /{#([@#]?)[ \t]*([\w\W]*?)[ \t]*#}/g, //TODO:php blade template
						use: function(match, raw, close, code) {
							return {
								code: `"${match.toString()}"`
									.replace(/\.(\w+)/g, "['$1']")
									.replace(/{#/g, "{{")
									.replace(/#}/g, "}}"),
								output: "raw"
							};
						}
					},
					...require("art-template").defaults.rules
				]
			}
		};

	return {
		htmlLoader,
		artTemplateLoader
	};
};
