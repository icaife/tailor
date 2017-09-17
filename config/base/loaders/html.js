/**
 * @description loader for html
 * @author Leon.Cai
 */

const
    ArtTemplateLoader = require("art-template-loader"),
    StringReplaceWebpackPlugin = require("string-replace-webpack-plugin");

module.exports = (config) => {
    let outputConfig = config.output;
    let artTemplateLoader = {
            loader: "art-template-loader",
            options: {
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
                        test: /{#([@#]?)[ \t]*([\w\W]*?)[ \t]*#}/, //TODO:vue or other javascript,php blade template
                        use: function(match, raw, close, code) {

                            return {
                                code: `"${match.toString()}"`.replace(/\.(\w+)/g, '[\'$1\']').replace(/{#/g, "{{").replace(/#}/g, "}}"),
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