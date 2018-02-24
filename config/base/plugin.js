/**
 * @description plugins
 * @author Leon.Cai
 */

const Webpack = require("webpack"),
	Path = require("path"),
	Log = require("../../lib/util/log"),
	HtmlWebpackPlugin = require("html-webpack-plugin"),
	StringReplaceWebpackPlugin = require("string-replace-webpack-plugin"),
	CopyWebpackPlugin = require("copy-webpack-plugin"),
	ExtractTextPlugin = require("extract-text-webpack-plugin"),
	StyleExtHtmlWebpackPlugin = require("style-ext-html-webpack-plugin"),
	WriteFileWebpackPlugin = require("write-file-webpack-plugin"),
	FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin"),
	BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
		.BundleAnalyzerPlugin,
	StyleLintPlugin = require("stylelint-webpack-plugin"),
	AddAssetHtmlWebpackPlugin = require("add-asset-html-webpack-plugin"),
	AssetsPlugin = require("assets-webpack-plugin"),
	Moment = require("moment"),
	MiniMatch = require("minimatch"),
	HappyPack = require("happypack"),
	OS = require("os"),
	ENV = require("../../constant/env.js"),
	Loaders = require("./loaders"),
	DllPlugin = Webpack.DllPlugin,
	DllReferencePlugin = Webpack.DllReferencePlugin,
	UglifyJsPlugin = Webpack.optimize.UglifyJsPlugin,
	ModuleConcatenationPlugin = Webpack.optimize.ModuleConcatenationPlugin,
	CommonsChunkPlugin = Webpack.optimize.CommonsChunkPlugin,
	HashedModuleIdsPlugin = Webpack.HashedModuleIdsPlugin,
	SourceMapDevToolPlugin = Webpack.SourceMapDevToolPlugin,
	ProvidePlugin = Webpack.ProvidePlugin,
	DefinePlugin = Webpack.DefinePlugin,
	COMMON_CHUNKS_NAME = "common-chunks",
	COMMON_MANIFEST_NAME = "common-manifest",
	COMMON_DLL_NAME = "common-dll";

/**
 * plugins for html
 * @param  {Object} config [description]
 * @param  {Object} entry  [description]
 * @return {Array}        [description]
 */
function htmlPlugin(config, entry) {
	let plugins = [],
		inputConfig = config.input,
		outputConfig = config.output,
		htmlInputConfig = inputConfig.html,
		htmlOutputConfig = outputConfig.html,
		groupEntries = inputConfig.entry.group || {},
		groups = findGroups(entry, groupEntries);

	Object.keys(entry).forEach(page => {
		let pageItem = entry[page],
			pagePath = htmlOutputConfig.path,
			pageName = page,
			pageInputExt = htmlInputConfig.ext[0],
			pageOutputExt = htmlOutputConfig.ext,
			chunks = [COMMON_MANIFEST_NAME],
			groupName = getGroup(pageName, groups);

		groupName && chunks.push([groupName, COMMON_CHUNKS_NAME].join("-")); //push group name, common chunk name

		chunks.push(pageName);

		let template = `${pageName}.${pageInputExt}`;
		let options = {
			filename: `${pagePath}/${pageName}.${pageOutputExt}`,
			chunks: chunks, //TODO
			template: template,
			chunksSortMode: "manual",
			inject: !false, //TODO: auto inject
			minify: outputConfig.html.optm
				? {
						html5: true,
						collapseWhitespace: true,
						collapseBooleanAttributes: true,
						collapseWhitespace: true,
						ignoreCustomComments: [/<!--[\w\W]+-->/g]
						// minifyCSS: true,
						// minifyJS: true,
					}
				: false
		};
		// FSE.pathExistsSync(`${config.root}/${inputConfig.path}/${template}`) &&
		new RegExp(inputConfig.entry.prefix + "$").test(pageName) &&
			plugins.push(new HtmlWebpackPlugin(options));
	});

	function getGroup(entryName, groups) {
		for (let groupName in groups) {
			let items = groups[groupName];

			if (items.indexOf(entryName) > -1) {
				return groupName;
			}
		}
	}

	return plugins;
}

/**
 * plugins for style
 * @param  {Object} config [description]
 * @param  {Object} entry  [description]
 * @return {Array}        [description]
 */
function stylePlugin(config, entry) {
	let plugins = [],
		outputConfig = config.output,
		styleConfig = outputConfig.style;

	plugins.push(
		new ExtractTextPlugin({
			//extract css
			filename:
				`${styleConfig.path || "."}/[name]` +
				(outputConfig.useHash
					? `.[contenthash:${outputConfig.hashLen}]`
					: "") +
				`.css`,
			allChunks: true,
			disable: !styleConfig.extract
		})
	);

	return plugins;
}

/**
 * plugins for lint
 * @param  {[type]} config [description]
 * @param  {[type]} entry  [description]
 * @return {[type]}        [description]
 */
function lintPlugin(config, entry) {
	let plugins = [],
		inputConfig = config.input,
		outputConfig = config.output;

	plugins.push(
		new StyleLintPlugin({
			configFile: Path.join(config.root, ".stylelintrc"),
			failOnWarning: false, // warning occured then stop
			failOnError: false, // error occured then stop
			emitError: true,
			emitOnWarning: false,
			quiet: false,
			cache: true
		})
	);

	return plugins;
}

/**
 * plugins for dev
 * @param  {Object} config [description]
 * @param  {Object} entry  [description]
 * @return {Array}        [description]
 */
function devPlugin(config, entry) {
	let plugins = [],
		outputConfig = config.output,
		inputConfig = config.input,
		htmlOutputConfig = outputConfig.html,
		// imageInputConfig = inputConfig.image,
		fileInputConfig = inputConfig.file;

	plugins.push(
		//views write to hard disk
		new WriteFileWebpackPlugin({
			test: new RegExp(`(${[htmlOutputConfig.ext].join("|")})$`, "i")
		}),
		new Webpack.optimize.OccurrenceOrderPlugin(),
		new Webpack.HotModuleReplacementPlugin(),
		new Webpack.NoEmitOnErrorsPlugin()
		// new HardSourceWebpackPlugin()
	);

	return plugins;
}

/**
 * plugins for optm
 * @param  {Object} config [description]
 * @param  {Object} entry  [description]
 * @return {Array}        [description]
 */
function optmPlugin(config, entry) {
	let plugins = [],
		outputConfig = config.output,
		fileConfig = outputConfig.file;

	plugins.push(
		new UglifyJsPlugin({
			//this will be very slow
			drop_debugger: true,
			dead_code: true,
			join_vars: true,
			reduce_vars: true,
			drop_console: true,
			comments: /[^\s\S]/g,
			sourceMap: true,
			parallel: true,
			exclude: /\.min\.js$/
		}),
		new ModuleConcatenationPlugin(),
		new AssetsPlugin({
			path: Path.join(outputConfig.path, fileConfig.path),
			filename: "map.json",
			metadata: {
				date: Moment().format(),
				tailor: config.tailor.package.version
			}
		})
	);

	return plugins;
}

function happyPlugin(config, entry) {
	// HappyPack.SERIALIZABLE_OPTIONS = HappyPack.SERIALIZABLE_OPTIONS.concat([
	// 	"postcss"
	// ]);

	let happyThreadPool = HappyPack.ThreadPool({
			size: OS.cpus().length
		}),
		plugins = [],
		loaders = Loaders(config);

	plugins.push(
		new HappyPack({
			id: loaders.happyJsLoaderName,
			loaders: [loaders.babelLoader, loaders.eslintLoader],
			threadPool: happyThreadPool,
			verbose: true
		}),
		new HappyPack({
			id: loaders.happyStyleLoaderName,
			loaders: [loaders.lessLoader],
			threadPool: happyThreadPool,
			verbose: true
		})
	);

	return plugins;
}

/**
 * plugins for common
 * @param  {Object} config [description]
 * @return {Object}        [description]
 */
function commonPlugin(config, entry) {
	let plugins = [],
		inputConfig = config.input,
		groupEntries = inputConfig.entry.group || {},
		outputConfig = config.output,
		jsConfig = outputConfig.js,
		entryKeys = Object.keys(entry),
		fileConfig = outputConfig.file,
		projConfig = config._projConfig,
		dllConfig = projConfig.dll;

	/**
	 * TODO:
	 *     SourceMapDevToolPlugin
	 *     BundleAnalyzerPlugin
	 */

	plugins.push(
		new HashedModuleIdsPlugin(),
		new StringReplaceWebpackPlugin(),
		new FriendlyErrorsWebpackPlugin(),
		new DefinePlugin(varsHandler(config.vars))
	);

	if (config.env !== ENV.dll) {
		plugins.push(
			/**
			 * @see https://doc.webpack-china.org/plugins/commons-chunk-plugin
			 * @see https://github.com/creeperyang/blog/issues/37
			 * @type {Array}
			 */
			new CommonsChunkPlugin({
				name: COMMON_MANIFEST_NAME,
				minChunks: Infinity
			}),
			new CopyWebpackPlugin([
				{
					context: Path.join(config.root, inputConfig.path),
					from: {
						glob: "**/vendor/**",
						dot: true
					},
					to: Path.join(
						config.root,
						outputConfig.path,
						jsConfig.path
					),
					toType: "dir"
				},
				{
					context: Path.join(config.root, inputConfig.path),
					from: {
						glob: `${dllConfig.output.path.replace(
							inputConfig.path,
							""
						)}/**`.replace(/^\/+/, ""),
						dot: true
					},
					to: Path.join(
						config.root,
						outputConfig.path,
						jsConfig.path
					),
					toType: "dir",
					force: true
				}
			])
		);

		let groups = findGroups(entry, groupEntries);

		for (let groupName in groups) {
			let chunks = groups[groupName];

			chunks &&
				chunks.length &&
				plugins.push(
					new CommonsChunkPlugin({
						name: `${groupName}-${COMMON_CHUNKS_NAME}`,
						chunks: chunks,
						minChunks: (mod, count) => {
							return count >= 3;
						},
						filename:
							`${jsConfig.path}/[name]` +
							(outputConfig.useHash ? `.[chunkhash]` : "") +
							`.js`
					})
				);
		}
	}

	//for happy pack
	if (config.parallel) {
		plugins.push(...happyPlugin(config, entry));
	}

	return plugins;
}

function findGroups(entries, group) {
	let groups = {};

	for (let groupName in group) {
		let items = [].concat(group[groupName]),
			arr = (groups[groupName] = []);

		for (let entryName in entries) {
			for (let i = 0, len = items.length; i < len; i++) {
				let item = items[i];

				if (MiniMatch(entryName, item)) {
					arr.push(entryName);
				}
			}
		}
	}

	return groups;
}

/**
 * @see https://github.com/superpig/blog/issues/6
 */
function dllPlugin(config, entry) {
	let plugins = [],
		inputConfig = config.input,
		outputConfig = config.output,
		include = inputConfig.entry.include || inputConfig.entry.dll || {},
		projConfig = config._projConfig,
		dllConfig = projConfig.dll;

	if (Object.keys(include).length) {
		let context = Path.join(config.root, inputConfig.path);

		if (config.env === ENV.dll) {
			plugins.push(
				new DllPlugin({
					library: `${outputConfig.library}`,
					name: `${outputConfig.library}`,
					path: Path.join(
						outputConfig.path,
						`[name]-${COMMON_DLL_NAME}.json`
					)
				})
			);
		} else {
			let dllAssets = [],
				dllPath = Path.resolve(config.root, dllConfig.output.path),
				styleInputConfig = inputConfig.style,
				styleReg = new RegExp(
					`\\.(${styleInputConfig.ext.join("|")})$`,
					"i"
				),
				outputPath =
					`/${outputConfig.js.path}/` +
					dllConfig.output.path.replace(inputConfig.path, ""),
				publicPath = `${outputConfig.publicPath}/${outputPath}`;

			outputPath = outputPath.replace(/([\w_-]+)\/+/g, "$1/");
			publicPath = publicPath.replace(/([\w_-]+)\/+/g, "$1/");

			for (let key in include) {
				let manifest = require(`${config.root}/${
					dllConfig.output.path
				}/${key}-${COMMON_DLL_NAME}.json`);

				plugins.push(
					new DllReferencePlugin({
						context: context,
						manifest: manifest
					})
				);

				let existStyle = Object.keys(manifest.content).some(key => {
					return styleReg.test(key);
				});

				if (existStyle) {
					dllAssets.push({
						filepath: Path.resolve(dllPath, `${key}.css`),
						typeOfAsset: "css",
						hash: true,
						outputPath: outputPath,
						publicPath: publicPath
					});
				}

				dllAssets.push({
					filepath: Path.resolve(dllPath, `${key}.js`),
					typeOfAsset: "js",
					hash: true,
					outputPath: outputPath,
					publicPath: publicPath
				});
			}

			plugins.push(new AddAssetHtmlWebpackPlugin(dllAssets));
		}
	}

	return plugins;
}

/**
 * vars handler
 * @param  {Object} json [description]
 * @return {Object}      [description]
 */
function varsHandler(json) {
	json = json || {};

	let result = {};

	for (let key in json) {
		let val = json[key];

		if (typeof val === "string") {
			result[key] = JSON.stringify(val);
		} else if (Object.prototype.toString.call(val) === "[object Object]") {
			varsHandler(val);
		} else {
			result[key] = val;
		}
	}

	return result;
}

module.exports = (config, entry) => {
	return {
		common: commonPlugin(config, entry),
		html: htmlPlugin(config, entry),
		style: stylePlugin(config, entry),
		dev: devPlugin(config, entry),
		optm: optmPlugin(config, entry),
		lint: lintPlugin(config, entry),
		dll: dllPlugin(config, entry)
	};
};
