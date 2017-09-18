/**
 * @description loader for html
 * @author Leon.Cai
 */

const
    Path = require("path"),
    StringReplaceWebpackPlugin = require("string-replace-webpack-plugin");

module.exports = (config) => {
    let outputConfig = config.output,
        inputConfig = config.input;

    let artTemplateLoader = {
            loader: "art-template-loader",
            options: {
                extname: "." + inputConfig.html.ext[0],
                htmlResourceRoot: Path.join(config.root, inputConfig.path),
                root: Path.join(config.root, inputConfig.path),
                htmlResourceRules: [
                    /<(?:img)[^>]+\b(?:\w+-?)?(?:src)="([^"{}]*)"[^>]*?>/img, //img tag
                ],
                rules: [{
                        test: /{{raw}}([\w\W]*?){{\/raw}}/,
                        use: function(match, code) {
                            return {
                                output: 'raw',
                                code: JSON.stringify(code)
                            }
                        }
                    }, {
                        test: /@{{([@#]?)[ \t]*([\w\W]*?)[ \t]*}}/, //TODO:vue or other javascript,php blade template
                        use: function(match, raw, close, code) {

                            return {
                                code: `"${match.toString()}"`,
                                output: "raw"
                            };
                        }
                    }, {
                        test: /{#([@#]?)[ \t]*([\w\W]*?)[ \t]*#}/, //TODO:php blade template
                        use: function(match, raw, close, code) {

                            return {
                                code: `"${match.toString()}"`.replace(/\.(\w+)/g, '[\'$1\']').replace(/{#/g, "{{").replace(/#}/g, "}}"),
                                output: "raw"
                            };
                        }
                    }, {
                        test: /{{[ \t]*\w+\([ \t]*\$([\w\W]*?)?\)[ \t]*}}/, //php blade template with function
                        use: function(match, raw, close, code) {
                            return {
                                code: `"${match.toString()}"`,
                                output: "raw"
                            };
                        }
                    },
                    ...require("art-template").defaults.rules,
                ],
            }
        },
        stringReplaceLoader = StringReplaceWebpackPlugin.replace({ //TODO replace something
            replacements: [{
                pattern: /<script[^>]+src="([^"]+)"[^>]*?>[\s\S]*?<\/script>/img,
                replacement: function(match, src, offset, string) {
                    let result = /^(\w+:)?(\/\/)/.test(src) ? src : (`${outputConfig.publicPath}/${outputConfig.js.path}/${src}`).replace(/\\/g, "/");

                    return match.toString().replace(src, result);
                }
            }]
        });

    return {
        artTemplateLoader,
        stringReplaceLoader
    };
};