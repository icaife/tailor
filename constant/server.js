/**
 * @description constant server
 * @author Leon.Cai
 */

module.exports = {
    domain: "localhost",
    port: 8080,
    devServer: {
        noInfo: false,
        quiet: true,
        log: () => {},
        clientLogLevel: "info",
        disableHostCheck: true,
        // 是否启用压缩
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
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "*",
            "Accept": "*/*"
        },
        // options for formating the statistics
        stats: {
            children: false,
            // Add public path information
            publicPath: true,
            errors: true,
            colors: true,
            chunks: false,
            chunkModules: false
        }
    }
};