/**
 * @description constant server
 * @author Leon.Cai
 */

module.exports = {
    domain: "localhost",
    port: 8888,
    devServer: {
        noInfo: false,
        quiet: false,
        clientLogLevel: "info",
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
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "*",
            "Accept": "*/*"
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