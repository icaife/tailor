/**
 * @description constant server
 * @author Leon.Cai
 */

module.exports = {
	host: "localhost",
	port: 8080,
	devServer: {
		noInfo: true,
		quiet: true,
		clientLogLevel: 'info',
		disableHostCheck: true,
		// 不启用压缩
		compress: true,
		// enable hmr
		hot: true,
		hotOnly: true,
		// no lazy mode
		lazy: false,
		watchOptions: {
			ignored: /node_modules/,
			aggregateTimeout: 300,
			poll: true
		},
		overlay: {
			warnings: false,
			error: true
		},
		headers: {
			"Access-Control-Allow-Origin": "*"
		},
		// options for formating the statistics
		stats: {
			children: false,
			errors: true,
			colors: true,
			chunks: false,
			chunkModules: false
		}
	}
};