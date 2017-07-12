/**
 * @description constant server
 * @author Leon.Cai
 */

module.exports = {
	domain: "localhost",
	port: 8080,
	devServer: {
		// noInfo: true,
		// quiet: true,
		clientLogLevel: 'info',
		// 不启用压缩
		compress: false,
		// enable hmr
		hot: true,
		hotOnly: true,
		// no lazy mode
		lazy: false,
		watchOptions: {
			ignored: /node_modules/,
			aggregateTimeout: 300,
			poll: false
		},
		overlay: {
			warnings: false,
			error: true
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